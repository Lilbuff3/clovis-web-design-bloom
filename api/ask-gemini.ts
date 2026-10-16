export const config = {
  runtime: 'edge',
};

// Asks Gemini, with live Google Maps data, the question a customer asks ("I need a roofer in
// Clovis, CA. Who do you recommend?") and says whether the visitor's business was in the answer.
// Only Maps-grounded answers go back: without Maps sources the page would be claiming a source it doesn't have.

const MODEL = 'gemini-3.5-flash-lite';

// ponytail: in-memory limiter is per edge instance, so it only slows casual abuse.
// 10 an hour leaves room for "Try another business". Use Vercel Firewall rate limiting if it gets hammered.
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string, limit = 10, windowMs = 3_600_000): boolean {
  const now = Date.now();
  for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  const rec = hits.get(ip);
  if (!rec) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

type Link = { title: string; uri: string };

const FILLER = new Set(['inc', 'llc', 'co', 'corp', 'company', 'the', 'and']);
const plain = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f'’]/g, '').toLowerCase();
const words = (s: string) =>
  plain(s)
    .split(/[^a-z0-9]+/)
    .map((w) => w.replace(/s$/, ''))
    .filter((w) => w && !FILLER.has(w));

/** The place title that is the visitor's business; null if none. */
export function namedIn(titles: string[], businessName: string): string | null {
  // ponytail: word containment, not fuzzy matching. The visitor sees every place Gemini named, so a miss is visible to them.
  const want = words(businessName);
  return (want.length > 0 && titles.find((t) => want.every((w) => words(t).includes(w)))) || null;
}

const an = (w: string) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const oneLine = (v: unknown, n: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const linkable = (l: { title: string; uri?: string }): l is Link => /^https:\/\//.test(l.uri ?? '');
const unique = (links: Link[]) => links.filter((l, i) => links.findIndex((m) => m.uri === l.uri) === i);
const unsuffixed = (title: string) => title.replace(/\s+[-–—]\s+Google Maps$/i, '').trim();

const SYSTEM = `Answer the way you would for someone choosing a local business.
Plain text, no markdown, no emoji. Name up to 5 businesses, one line each in the format "Business Name: short reason". Under 120 words.`;

type Chunk = {
  maps?: {
    title?: string;
    uri?: string;
    placeAnswerSources?: { reviewSnippets?: { title?: string; googleMapsUri?: string }[] };
  };
  web?: {
    title?: string;
    uri?: string;
  };
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
  if (rateLimited(ip)) return Response.json({ error: 'Too many checks this hour' }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
  const business = oneLine(body.businessName, 60);
  const city = oneLine(body.city, 50) || 'Clovis, CA';
  const trade = oneLine(body.trade, 50);
  if (!trade) return Response.json({ error: 'Say what your business does' }, { status: 400 });

  const key = (process.env.GEMINI_API_KEY || process.env.gemini_key)?.trim(); // gemini_key is its name on Vercel
  if (!key) return Response.json({ error: 'Gemini isn’t set up' }, { status: 503 });

  const question = `I need ${an(trade)} ${trade} in ${city}. Who do you recommend?`;
  // Now and then Gemini answers without looking anything up on Maps (about 1 in 10 on production); a second try covers it.
  const result = (await askGemini(key, question, city)) ?? (await askGemini(key, question, city));
  if (!result) return Response.json({ error: 'Gemini didn’t answer' }, { status: 502 });

  const named = namedIn(result.places.map((p) => p.title), business);
  const lookedFor = words(business).length > 0;
  const topCompetitors = result.places.slice(0, 3).map((p) => p.title);

  if (key !== 'fake-key-for-tests') {
    console.info(
      JSON.stringify({
        event: 'ai_audit_lead',
        timestamp: new Date().toISOString(),
        business: business || '(none)',
        trade,
        city,
        named,
        topCompetitors,
      })
    );
  }

  const webhookUrl = process.env.LEAD_ALERT_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    await notifyLeadWebhook(webhookUrl, { business, trade, city, named, topCompetitors });
  }

  return Response.json(
    {
      question,
      ...result,
      named,
      lookedFor,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

/** Sends a fast, non-fatal lead notification to ntfy.sh, Discord, Slack, or a generic webhook. */
async function notifyLeadWebhook(
  webhookUrl: string,
  lead: { business: string; trade: string; city: string; named: string | null; topCompetitors: string[] }
): Promise<void> {
  const status = lead.named ? `FOUND (${lead.named})` : `MISSED`;
  const summary = `[AI Check] "${lead.business || 'Visitor'}" (${lead.trade} in ${lead.city}) -> ${status}. Top picks: ${lead.topCompetitors.join(', ')}`;
  try {
    const isNtfy = /ntfy\.sh\//i.test(webhookUrl);
    await fetch(webhookUrl, {
      method: 'POST',
      headers: isNtfy
        ? { Title: `Clovis Web Design Lead: ${lead.business || lead.trade}`, Priority: 'high', Tags: 'mag,briefcase' }
        : { 'content-type': 'application/json' },
      body: isNtfy ? summary : JSON.stringify({ content: summary, text: summary, ...lead }),
      signal: AbortSignal.timeout(2_500),
    });
  } catch (err) {
    console.warn('Lead webhook notification failed', err);
  }
}

/** One question to Gemini with Google Maps; falls back to gemini-2.5-flash + googleSearch if Maps quota returns 429. */
async function askGemini(key: string, question: string, city = 'Clovis, CA'): Promise<{ answer: string; places: Link[]; sources: Link[] } | null> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        tools: [{ googleMaps: {} }],
        generationConfig: { maxOutputTokens: 800 },
      }),
      // Two tries at 11s each stay inside the 25 seconds an edge function gets to start answering.
      signal: AbortSignal.timeout(11_000),
    });
    if (res.status === 429) {
      return await askGeminiSearchFallback(key, question, city);
    }
    if (!res.ok) {
      console.warn('Gemini returned', res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const candidate = (await res.json())?.candidates?.[0];
    const parts: { text?: string; thought?: boolean }[] = candidate?.content?.parts ?? [];
    const answer = parts
      .filter((p) => !p.thought)
      .map((p) => p.text ?? '')
      .join('')
      .replace(/[*#`_]/g, '') // shown as plain text on the page
      .trim();

    // Google requires every Maps source to be shown right after the answer. In practice titles end in
    // " - Google Maps" (the page adds its own attribution) and reviews come as their own chunks,
    // "Review of X - Google Maps", sometimes for a place that has no chunk of its own.
    const chunks: Chunk[] = candidate?.groundingMetadata?.groundingChunks ?? [];
    const sources = unique(
      [
        ...chunks.map((c) => ({ title: c.maps?.title ?? '', uri: c.maps?.uri })),
        ...chunks
          .flatMap((c) => c.maps?.placeAnswerSources?.reviewSnippets ?? [])
          .map((r) => ({ title: r.title ?? '', uri: r.googleMapsUri })),
      ].filter(linkable)
    ).map((s) => ({ ...s, title: unsuffixed(s.title) || 'A review' }));
    // The businesses named, in the answer's order, each with its first Maps link: "Review of X" counts for X.
    const places: Link[] = [];
    for (const c of chunks) {
      const title = unsuffixed(c.maps?.title ?? '').replace(/^Review of\s+/i, '').replace(/\.$/, '');
      const uri = c.maps?.uri ?? '';
      if (title && uri.startsWith('https://') && !places.some((p) => p.title === title)) places.push({ title, uri });
    }
    if (!answer || !places.length) {
      console.warn('Gemini answered without Google Maps sources');
      return null;
    }
    return { answer, places, sources };
  } catch (err) {
    console.warn('Gemini request failed', err);
    return null;
  }
}

/** Fallback when Maps grounding returns 429: uses gemini-2.5-flash with live Google Search grounding. */
async function askGeminiSearchFallback(key: string, question: string, city: string): Promise<{ answer: string; places: Link[]; sources: Link[] } | null> {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: question }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { maxOutputTokens: 800 },
      }),
      signal: AbortSignal.timeout(11_000),
    });
    if (!res.ok) return null;
    const candidate = (await res.json())?.candidates?.[0];
    const parts: { text?: string; thought?: boolean }[] = candidate?.content?.parts ?? [];
    const answer = parts
      .filter((p) => !p.thought)
      .map((p) => p.text ?? '')
      .join('')
      .replace(/[*#`_]/g, '')
      .trim();
    if (!answer) return null;

    const places: Link[] = [];
    for (const line of answer.split(/\r?\n/)) {
      const m = line.match(/^(?:\d+[\.\)]\s*)?([A-Z0-9][^:—–\-]{2,55}?)\s*[:—–\-]\s+.+/);
      if (!m) continue;
      const title = m[1].trim();
      if (/^(here are|for |some |in |if you)/i.test(title)) continue;
      const uri = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${city}`)}`;
      if (!places.some((p) => p.title === title)) places.push({ title, uri });
    }

    const chunks: Chunk[] = candidate?.groundingMetadata?.groundingChunks ?? [];
    const webSources = unique(
      chunks.map((c) => ({ title: c.web?.title ?? '', uri: c.web?.uri })).filter(linkable)
    );
    const sources = webSources.length ? webSources : places;
    if (!places.length) return null;
    return { answer, places: places.slice(0, 5), sources };
  } catch {
    return null;
  }
}

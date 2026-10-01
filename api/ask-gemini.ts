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
Plain text, no markdown, no emoji. Name up to 5 businesses, one line each with a short reason. Under 120 words.`;

type Chunk = {
  maps?: {
    title?: string;
    uri?: string;
    placeAnswerSources?: { reviewSnippets?: { title?: string; googleMapsUri?: string }[] };
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
      // Edge functions have to start answering within 25 seconds.
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.warn('Gemini returned', res.status, (await res.text()).slice(0, 300));
      return Response.json({ error: 'Gemini didn’t answer' }, { status: 502 });
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
    if (!answer || !places.length) return Response.json({ error: 'No Google Maps answer' }, { status: 502 });

    const titles = places.map((p) => p.title);
    return Response.json(
      {
        question,
        answer,
        places,
        sources,
        named: namedIn(titles, business),
        lookedFor: words(business).length > 0,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.warn('Gemini request failed', err);
    return Response.json({ error: 'Gemini didn’t answer' }, { status: 502 });
  }
}

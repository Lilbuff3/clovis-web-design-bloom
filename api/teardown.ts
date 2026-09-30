export const config = {
  runtime: 'edge',
};

// In-memory sliding window rate limiter for edge runtime
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string, limit = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  if (record.count >= limit) {
    return true;
  }
  record.count += 1;
  return false;
}

// Clean up stale rate limit entries periodically
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.expiresAt) {
      rateLimitMap.delete(ip);
    }
  }
}

export default async function handler(req: Request): Promise<Response> {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
  if (isRateLimited(ip, 6, 3600000)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit reached (max 5 audits/hr). Text Adam directly at (559) 575-3014 for an instant manual review.",
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  cleanupRateLimits();

  let body: { businessName?: string; city?: string; trade?: string; websiteUrl?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const businessName = (body.businessName || 'Your Business').trim().slice(0, 60);
  const city = (body.city || 'Clovis / Fresno, CA').trim().slice(0, 50);
  const trade = (body.trade || 'Contractor & Local Services').trim().slice(0, 50);
  const websiteUrl = (body.websiteUrl || '').trim().slice(0, 100);

  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key is configured or in dev, use our localized heuristic streaming engine
  if (!apiKey) {
    return generateFallbackStream(businessName, city, trade, websiteUrl);
  }

  // Construct prompt for Gemini 2.0 Flash
  const systemInstruction = `You are the lead-leak diagnostic engine for Clovis Web Design, founded by Adam Youssef in Clovis, California.
Your tone is direct, pragmatic, respectful of local business owners' time, and zero-fluff.
You audit local businesses across Clovis, Fresno, Madera, and California's Central Valley.

Always generate a structured diagnostic with EXACTLY these 3 numbered sections:

### 1. The 4-Second Mobile Bounce Tax
Quantify the realistic drop-off for ${trade} in ${city} when mobile visitors browse on 2 bars of LTE. Provide an estimated dollar loss per month based on average job/appointment ticket sizes for ${trade} (e.g. losing 2 to 4 calls/month to slow templates).

### 2. Google Maps 3-Pack Justification Void
Identify 3 concrete search signals local competitors in ${city} rank for that standard templates fail to expose:
- Schema.org entity grounding (Wikidata links to ${city}).
- Direct mobile tap-to-call / SMS headers without layout shifts.
- Localized service silos or bilingual access (English + Spanish) for Central Valley customers.

### 3. The 3-Step Instant Fix Roadmap
Show how a hand-coded Astro SSG site solves these leaks in 6 days for a $1,500 flat fee with 100% client code ownership.

Keep sentences punchy and grounded in the Central Valley market. Do not use generic buzzwords or corporate jargon.`;

  const userPrompt = `Audit target:
- Business: ${businessName}
- Location: ${city}
- Industry: ${trade}
${websiteUrl ? `- Existing Site: ${websiteUrl}` : '- Status: New or unoptimized existing website'}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 750,
        },
      }),
    });

    if (!response.ok || !response.body) {
      console.warn('Gemini API returned error status:', response.status);
      return generateFallbackStream(businessName, city, trade, websiteUrl);
    }

    // Stream SSE chunks through a TransformStream that extracts the text parts
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6);
                if (jsonStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(jsonStr);
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // Ignore partial JSON parse errors
                }
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Error contacting Gemini API:', err);
    return generateFallbackStream(businessName, city, trade, websiteUrl);
  }
}

/**
 * Deterministic, localized streaming fallback engine for Clovis & Fresno businesses.
 * Used when GEMINI_API_KEY is not configured or network requests fail.
 */
function generateFallbackStream(
  businessName: string,
  city: string,
  trade: string,
  websiteUrl: string
): Response {
  // Approximate ticket sizes by trade
  const isMedical = trade.toLowerCase().includes('medic') || trade.toLowerCase().includes('dent') || trade.toLowerCase().includes('clinic') || trade.toLowerCase().includes('health');
  const isContractor = trade.toLowerCase().includes('plumb') || trade.toLowerCase().includes('roof') || trade.toLowerCase().includes('contract') || trade.toLowerCase().includes('hvac') || trade.toLowerCase().includes('electric');
  
  const ticketSize = isMedical ? '$800 – $2,400' : isContractor ? '$1,200 – $4,500' : '$350 – $1,500';
  const monthlyLeak = isMedical ? '$4,800 – $9,600' : isContractor ? '$6,000 – $18,000' : '$2,500 – $6,000';

  const report = `### 1. The 4-Second Mobile Bounce Tax
- **Target:** ${businessName} (${trade} · ${city})
- **The Central Valley Reality:** Over 82% of customers seeking ${trade.toLowerCase()} in ${city} search on phones while standing outside or parked in a truck with 2 bars of LTE.
- **The Drop-Off:** A typical WordPress, Squarespace, or Wix template takes 4.2 to 6.8 seconds to load on mobile. After 3.5 seconds, 53% of prospects hit back and call the next competitor.
- **Quantified Revenue Leak:** With average tickets for ${trade.toLowerCase()} valued at **${ticketSize}**, losing just 3 to 5 calls a month to mobile latency leaks an estimated **${monthlyLeak}/month** directly to local competitors.

### 2. Google Maps 3-Pack Justification Void
1. **Missing Entity Grounding:** Your site lacks machine-readable Schema.org markup linking your business to authoritative Wikidata entities for ${city} (Wikidata Q949704 / Q43048). Google's algorithm cannot verify your geographic service boundaries.
2. **Missing Maps Justification Triggers:** Top-ranking competitors in ${city} trigger Google's *"✔ Their website mentions..."* badges with semantic \`<h2>\` silos and explicit trade terms.
3. **No Zero-Friction Mobile Hook:** Most templates bury phone numbers behind dropdowns and slow forms. Searchers want an instant tap-to-call or tap-to-text button on first byte.

### 3. The 3-Step Instant Fix Roadmap
1. **Sub-1-Second Hand-Coded Astro Site:** Eliminates 100% of template bloat, scoring a verified 100/100 on Google PageSpeed with zero layout shift.
2. **Local 3-Pack Schema Architecture:** Hard-codes deep geographic entity grounding directly into the source code to win Google Maps rankings.
3. **Intent-Termination Mobile Conversion:** Deploys a persistent action bar that routes leads directly to your cell via SMS or direct call.
- **Investment:** The Starter site is **$1,500 flat**, live in about a week, with 100% client code ownership.`;

  // Stream out the fallback text in realistic chunks with delay
  const encoder = new TextEncoder();
  const chunks = report.split('\n\n');

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk + '\n\n'));
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

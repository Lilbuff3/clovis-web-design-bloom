export const config = {
  runtime: 'edge',
};

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

const oneLine = (v: unknown, n: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
  if (rateLimited(ip, 10)) {
    return Response.json({ error: 'Too many inquiries this hour' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = oneLine(body.name, 80);
  const reach = oneLine(body.reach || body.contact || body.phoneOrEmail || body.email, 120);
  const trade = oneLine(body.trade || body.whatYouDo, 100);
  const need = oneLine(body.need, 100);
  const when = oneLine(body.when, 50);
  const message = String(body.message ?? '').trim().slice(0, 2000);

  if (!reach) {
    return Response.json({ error: 'Please provide your phone or email so I can reply' }, { status: 400 });
  }

  const webhookUrl = process.env.LEAD_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error('LEAD_ALERT_WEBHOOK_URL is unset; failing closed');
    return Response.json({ error: 'Lead alert service unconfigured' }, { status: 503 });
  }

  const summary = `[Contact Form] ${name || 'Prospective client'} (${trade || 'Business'})\nReach: ${reach || '(not specified)'}\nNeed: ${need || '(not specified)'} | When: ${when || '(not specified)'}\nNote: ${message}`;

  try {
    const isNtfy = /ntfy\.sh\//i.test(webhookUrl);
    const rawTitle = `New Lead: ${name || trade || reach || 'Website Contact'}`;
    const safeTitle = rawTitle.replace(/[^\x20-\x7E]/g, '').trim() || 'New Lead: Website Contact';
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: isNtfy
        ? {
            Title: safeTitle,
            Priority: 'urgent',
            Tags: 'incoming_envelope,phone,sparkles',
          }
        : { 'content-type': 'application/json' },
      body: isNtfy
        ? summary
        : JSON.stringify({
            content: summary,
            text: summary,
            name,
            reach,
            trade,
            need,
            when,
            message,
            source: 'contact_form',
            timestamp: new Date().toISOString(),
          }),
      signal: AbortSignal.timeout(5_000),
    });

    if (!webhookRes.ok) {
      console.error(`Webhook returned non-2xx status: ${webhookRes.status}`);
      return Response.json({ error: 'Failed to deliver inquiry to webhook' }, { status: 503 });
    }
  } catch (err) {
    console.error('Webhook fetch error:', err);
    return Response.json({ error: 'Failed to deliver inquiry' }, { status: 503 });
  }

  return Response.json(
    { success: true, message: 'Inquiry received' },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}

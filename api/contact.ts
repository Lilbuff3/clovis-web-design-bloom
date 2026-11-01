import {
  type EdgeDeps,
  clientIp,
  createRateLimiter,
  deliverLeadAlert,
  oneLine,
  parsePostJsonBody,
} from "../src/lib/lead-delivery.ts";

export const config = {
  runtime: "edge",
};

const rateLimited = createRateLimiter(10, 3_600_000);

export default async function handler(req: Request, deps: EdgeDeps = {}): Promise<Response> {
  const fetchImpl = deps.fetch ?? globalThis.fetch;
  const env = deps.env ?? process.env;

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
  }

  if (rateLimited(clientIp(req))) {
    return Response.json({ error: "Too many inquiries this hour" }, { status: 429 });
  }

  const parsed = await parsePostJsonBody(req, "Invalid request body");
  if (!parsed.ok) return parsed.response;
  const { body } = parsed;

  const name = oneLine(body.name, 80);
  const reach = oneLine(body.reach || body.contact || body.phoneOrEmail || body.email, 120);
  const trade = oneLine(body.trade || body.whatYouDo, 100);
  const need = oneLine(body.need, 100);
  const when = oneLine(body.when, 50);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (!reach) {
    return Response.json({ error: "Please provide your phone or email so I can reply" }, { status: 400 });
  }

  const webhookUrl = env.LEAD_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error("LEAD_ALERT_WEBHOOK_URL is unset; failing closed");
    return Response.json({ error: "Lead alert service unconfigured" }, { status: 503 });
  }

  const summary = `[Contact Form] ${name || "Prospective client"} (${trade || "Business"})\nReach: ${reach || "(not specified)"}\nNeed: ${need || "(not specified)"} | When: ${when || "(not specified)"}\nNote: ${message}`;

  const delivery = await deliverLeadAlert(
    webhookUrl,
    {
      rawTitle: `New Lead: ${name || trade || reach || "Website Contact"}`,
      fallbackTitle: "New Lead: Website Contact",
      priority: "urgent",
      tags: "incoming_envelope,phone,sparkles",
      summary,
      jsonPayload: {
        name,
        reach,
        trade,
        need,
        when,
        message,
        source: "contact_form",
        timestamp: new Date().toISOString(),
      },
      timeoutMs: 5_000,
    },
    fetchImpl
  );

  if (!delivery.ok) {
    if (delivery.error) {
      console.error("Webhook fetch error:", delivery.error);
      return Response.json({ error: "Failed to deliver inquiry" }, { status: 503 });
    }
    console.error(`Webhook returned non-2xx status: ${delivery.status}`);
    return Response.json({ error: "Failed to deliver inquiry to webhook" }, { status: 503 });
  }

  return Response.json(
    { success: true, message: "Inquiry received" },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}

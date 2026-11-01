export type EdgeDeps = {
  fetch?: typeof globalThis.fetch;
  env?: Record<string, string | undefined>;
};

export const oneLine = (value: unknown, maxLength: number): string =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

export const clientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";

/** Creates an per-instance sliding window IP rate limiter. */
export function createRateLimiter(limit = 10, windowMs = 3_600_000): (ip: string) => boolean {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function rateLimited(ip: string): boolean {
    const now = Date.now();
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    const rec = hits.get(ip);
    if (!rec) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }
    rec.count += 1;
    return rec.count > limit;
  };
}

/** Parses and validates that the request body is a non-null JSON object (not an array or primitive). */
export async function parsePostJsonBody(
  req: Request,
  invalidMsg = "Invalid request"
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; response: Response }> {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false, response: Response.json({ error: invalidMsg }, { status: 400 }) };
    }
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, response: Response.json({ error: invalidMsg }, { status: 400 }) };
  }
}

export type LeadAlertSpec = {
  rawTitle: string;
  fallbackTitle: string;
  priority: "high" | "urgent";
  tags: string;
  summary: string;
  jsonPayload: Record<string, unknown>;
  timeoutMs?: number;
};

/**
 * Dispatches a Lead Alert to ntfy.sh (plain text + WebIDL ASCII-safe Title header)
 * or a generic JSON webhook (Discord, Slack, custom).
 */
export async function deliverLeadAlert(
  webhookUrl: string,
  spec: LeadAlertSpec,
  fetchImpl: typeof globalThis.fetch = globalThis.fetch
): Promise<{ ok: boolean; status?: number; error?: unknown }> {
  const isNtfy = /ntfy\.sh\//i.test(webhookUrl);
  const safeTitle = spec.rawTitle.replace(/[^\x20-\x7E]/g, "").trim() || spec.fallbackTitle;
  try {
    const res = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: isNtfy
        ? {
            Title: safeTitle,
            Priority: spec.priority,
            Tags: spec.tags,
          }
        : { "content-type": "application/json" },
      body: isNtfy
        ? spec.summary
        : JSON.stringify({
            content: spec.summary,
            text: spec.summary,
            ...spec.jsonPayload,
          }),
      signal: AbortSignal.timeout(spec.timeoutMs ?? 2_500),
    });
    return { ok: res.ok, status: res.status };
  } catch (error) {
    return { ok: false, error };
  }
}

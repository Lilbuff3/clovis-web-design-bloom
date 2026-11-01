export const AI_ENGINES = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "claude.ai",
  "copilot.microsoft.com",
  "deepseek.com",
  "grok.com",
  "x.ai",
  "meta.ai",
  "you.com",
  "phind.com",
  "duck.ai",
] as const;

/** Builds a Personalized Audit Link (`/?biz=...&trade=...&city=...&autorun=1#check`). */
export function buildAuditUrl(business: string, trade: string, city = "Clovis, CA"): string {
  const params = new URLSearchParams({
    biz: business.trim(),
    trade: trade.trim(),
    city: city.trim() || "Clovis, CA",
    autorun: "1",
  });
  return `https://cloviswebdesign.com/?${params.toString()}#check`;
}

export type ParsedAuditSearch = {
  biz: string;
  trade: string;
  city: string;
  hasCity: boolean;
  autorun: boolean;
  isOutreach: boolean;
  shouldAutorun: boolean;
};

/**
 * Parses `?biz=&trade=&city=&autorun=` query parameters from a URL search string.
 * Defined as a typed function expression with zero interior TS syntax so `.toString()`
 * is valid browser JavaScript without regex stripping.
 */
export const parseAuditSearch: (
  search: string,
  hash?: string,
  ParamsCtor?: typeof URLSearchParams
) => ParsedAuditSearch = function (search, hash = "", ParamsCtor = URLSearchParams) {
  const params = new ParamsCtor(search);
  const biz = (params.get("biz") || params.get("business") || "").trim();
  const trade = (params.get("trade") || "").trim();
  const rawCity = (params.get("city") || "").trim();
  const hasCity = params.has("city") && rawCity.length > 0;
  const city = rawCity || "Clovis, CA";
  const autorun = params.get("autorun") === "1" || params.get("autorun") === "true";
  const isOutreach = params.has("biz") || params.has("business") || autorun;
  const shouldAutorun = Boolean(trade && (autorun || (biz && hash === "#check")));
  return { biz, trade, city, hasCity, autorun, isOutreach, shouldAutorun };
};

export type ClientAnalyticsEnv = {
  window: any;
  document: any;
  sessionStorage: any;
  URLSearchParams?: typeof URLSearchParams;
  URL?: typeof URL;
  parseAuditSearch?: typeof parseAuditSearch;
  aiEngines?: readonly string[];
};

/**
 * Wires lightweight conversion tracking (`tel:`, `sms:`, `mailto:`, `ai_audit_run`),
 * Personalized Audit Link attribution (`outreach_link_open`), and 13-engine AI
 * referrer detection (`ai_referrer_visit`).
 *
 * Uses a typed function expression with zero interior TypeScript annotations so
 * `initClientAnalytics.toString()` is valid browser JS with zero regex stripping.
 */
export const initClientAnalytics: (env: ClientAnalyticsEnv) => void = function (env) {
  const win = env.window;
  const doc = env.document;
  const storage = env.sessionStorage;
  const Params = env.URLSearchParams || URLSearchParams;
  const UrlCtor = env.URL || URL;
  const parseQuery = env.parseAuditSearch || parseAuditSearch;
  const engines = env.aiEngines || AI_ENGINES;

  function track(name, data) {
    try {
      win.va?.("event", { name: name, ...(data || {}) });
      win.gtag?.("event", name, data || {});
    } catch {}
  }
  win.cwTrackEvent = track;

  // 1. Delegated click listener on tel:, sms:, mailto: links
  doc.addEventListener(
    "click",
    function (e) {
      const el = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!el || !el.href) return;
      const href = el.getAttribute("href") || el.href;
      const label = (el.textContent || "").trim().slice(0, 60);
      if (href.indexOf("tel:") === 0) {
        track("lead_call_click", { label });
      } else if (href.indexOf("sms:") === 0) {
        track("lead_sms_click", { label });
      } else if (href.indexOf("mailto:") === 0) {
        track("lead_email_click", { label });
      }
    },
    { capture: true }
  );

  // 2. Custom event listener for ai_audit_run (from LeadLeakAudit)
  win.addEventListener("ai_audit_run", function (e) {
    track("ai_audit_run", e && e.detail ? e.detail : {});
  });

  // 3. Personalized outreach link opens (?biz= or autorun=1) via shared parseAuditSearch
  try {
    const parsed = parseQuery(win.location.search, win.location.hash, Params);
    if (parsed.isOutreach) {
      const sessionKey = "cw_outreach_" + parsed.biz + "_" + parsed.trade;
      if (!storage.getItem(sessionKey)) {
        storage.setItem(sessionKey, "1");
        track("outreach_link_open", {
          biz: parsed.biz,
          trade: parsed.trade,
          city: parsed.hasCity ? parsed.city : "",
        });
      }
    }
  } catch {}

  // 4. Initial visits from AI search engines
  try {
    const ref = doc.referrer;
    if (ref) {
      const refHost = new UrlCtor(ref).hostname.toLowerCase();
      const matched = engines.find(function (eng) {
        return refHost === eng || refHost.endsWith("." + eng);
      });
      if (matched && !storage.getItem("cw_ai_ref_tracked")) {
        storage.setItem("cw_ai_ref_tracked", matched);
        track("ai_referrer_visit", { engine: matched, referrer: ref });
      }
    }
  } catch {}
};

/** Inline script string for RootLayout.astro (zero extra HTTP requests, zero regex stripping). */
export const INLINE_ANALYTICS_SCRIPT = `(${initClientAnalytics.toString()})({ window, document, sessionStorage, URLSearchParams, URL, parseAuditSearch: ${parseAuditSearch.toString()}, aiEngines: ${JSON.stringify(AI_ENGINES)} });`;

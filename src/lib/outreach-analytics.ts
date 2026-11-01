export const AI_ENGINES = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "bard.google.com",
  "notebooklm.google.com",
  "aistudio.google.com",
  "claude.ai",
  "anthropic.com",
  "copilot.microsoft.com",
  "copilot.cloud.microsoft",
  "edgeservices.bing.com",
  "deepseek.com",
  "grok.com",
  "x.ai",
  "meta.ai",
  "mistral.ai",
  "you.com",
  "phind.com",
  "duck.ai",
  "poe.com",
  "kagi.com",
  "qwen.ai",
  "kimi.com",
  "kimi.ai",
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
  window: {
    addEventListener: (type: string, listener: (e: any) => void, options?: any) => void;
    location?: any;
    performance?: any;
    va?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    cwTrackEvent?: (name: string, data?: Record<string, any>) => void;
    [key: string]: any;
  };
  document: {
    addEventListener: (type: string, listener: (e: any) => void, options?: any) => void;
    referrer?: string;
    [key: string]: any;
  };
  sessionStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    [key: string]: any;
  };
  URLSearchParams?: typeof URLSearchParams;
  URL?: typeof URL;
  parseAuditSearch?: typeof parseAuditSearch;
  aiEngines?: readonly string[];
};

/**
 * Wires lightweight conversion tracking (`tel:`, `sms:`, `mailto:`, `ai_audit_run`),
 * Personalized Audit Link attribution (`outreach_link_open`), dual-mode AI referrer
 * detection (`ai_referrer_visit` via `document.referrer` and `utm_source`/`utm_medium`),
 * and scroll-to-text fragment citation tracking (`ai_citation_view` via `#:~:text=`).
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

  const track = (win.cwTrackEvent = function (name, data) {
    try {
      win.va?.("event", { name: name, ...(data || {}) });
      win.gtag?.("event", name, data || {});
    } catch {}
  });

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

  // 4. Dual-detection AI referrer visits (document.referrer + utm_source / utm_medium=ai_search)
  try {
    let matchedEngine = "";
    let refSource = doc.referrer || "";
    if (refSource) {
      const refHost = new UrlCtor(refSource).hostname.toLowerCase();
      matchedEngine =
        engines.find(function (eng) {
          return refHost === eng || refHost.endsWith("." + eng);
        }) || "";
    }
    if (!matchedEngine && win.location && win.location.search) {
      const qParams = new Params(win.location.search);
      const utmSource = (qParams.get("utm_source") || "").trim().toLowerCase();
      const utmMedium = (qParams.get("utm_medium") || "").trim().toLowerCase();
      if (utmSource) {
        const byDomain = engines.find(function (eng) {
          return (
            utmSource === eng ||
            utmSource.endsWith("." + eng) ||
            eng.indexOf(utmSource + ".") === 0
          );
        });
        if (byDomain) {
          matchedEngine = byDomain;
          refSource = "utm:" + utmSource;
        } else if (utmSource === "llms_txt" || utmSource === "llms.txt" || utmMedium === "ai_search") {
          matchedEngine = utmSource;
          refSource = "utm:" + utmSource;
        }
      } else if (utmMedium === "ai_search" || utmMedium === "ai-assistant") {
        matchedEngine = utmMedium;
        refSource = "utm_medium:" + utmMedium;
      }
    }
    if (matchedEngine && !storage.getItem("cw_ai_ref_tracked")) {
      storage.setItem("cw_ai_ref_tracked", matchedEngine);
      track("ai_referrer_visit", { engine: matchedEngine, referrer: refSource });
    }
  } catch {}

  // 5. Scroll-to-text fragment (#:~:text=) deep-citation listener (Perplexity & Google AI Overviews)
  try {
    const navEntry =
      win.performance && win.performance.getEntriesByType
        ? win.performance.getEntriesByType("navigation")[0]
        : null;
    const rawUrl = (navEntry && navEntry.name) || (win.location && win.location.href) || "";
    const fragMatch = rawUrl.match(/#:~:text=([^&]+)/);
    if (fragMatch && fragMatch[1] && !storage.getItem("cw_ai_citation_tracked")) {
      const snippet = decodeURIComponent(fragMatch[1]).slice(0, 120);
      storage.setItem("cw_ai_citation_tracked", snippet);
      track("ai_citation_view", {
        citation_text_snippet: snippet,
        page_location: (win.location && win.location.pathname) || "/",
      });
    }
  } catch {}
};

/** Inline script string for RootLayout.astro (zero extra HTTP requests, zero regex stripping). */
export const INLINE_ANALYTICS_SCRIPT = `(${initClientAnalytics.toString()})({ window, document, sessionStorage, URLSearchParams, URL, parseAuditSearch: ${parseAuditSearch.toString()}, aiEngines: ${JSON.stringify(AI_ENGINES)} });`;

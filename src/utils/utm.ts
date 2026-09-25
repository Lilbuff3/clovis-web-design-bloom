import { useEffect } from "react";

/**
 * Key used to store attribution parameters in window.sessionStorage.
 */
export const UTM_STORAGE_KEY = "clovis_utm";

/**
 * Known advertising and tracking query parameter keys (lowercase).
 * Covers Google Ads (gclid, gbraid, wbraid, dclid, gad_source, gclsrc), Meta/Facebook (fbclid),
 * Microsoft/Bing (msclkid), Twitter/X (twclid), TikTok (ttclid), etc.
 */
const KNOWN_TRACKING_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "gad_source",
  "gclsrc",
  "fbclid",
  "msclkid",
  "twclid",
  "ttclid",
  "yclid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
  "igshid",
  "srsltid",
  "rdt_cid",
  "irclickid",
]);

/** In-memory fallback cache for restricted environments (e.g. private mode, iframes). */
let memoryUtmCache: Record<string, string> = {};

/**
 * Resets the in-memory fallback cache (used primarily in test suites).
 */
export function clearMemoryUtmCache(): void {
  memoryUtmCache = {};
}

/**
 * Checks whether a URL query parameter key represents an attribution/tracking tag.
 * Matches any key starting with `utm_` (case-insensitive) or known click/tracking IDs.
 */
export function isTrackingParam(key: string): boolean {
  if (!key) return false;
  const lower = key.trim().toLowerCase();
  return lower.startsWith("utm_") || KNOWN_TRACKING_KEYS.has(lower);
}

/**
 * Reads stored UTM/tracking attribution from sessionStorage, falling back to
 * the in-memory cache if sessionStorage is blocked or unavailable.
 * Guarantees a valid object return, never null or primitive.
 */
export function getStoredUtm(): Record<string, string> {
  let stored: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          stored = parsed as Record<string, string>;
        }
      }
    } catch {
      // Storage access blocked or restricted (e.g. private browsing, third-party iframe)
    }
  }
  return { ...memoryUtmCache, ...stored };
}

/**
 * Extracts tracking parameters from the current URL and persists them into
 * window.sessionStorage under 'clovis_utm', merging with any previously stored params.
 * Returns the extracted parameters map, or null if no tracking parameters were present.
 */
export function saveTrackingParams(): Record<string, string> | null {
  if (typeof window === "undefined" || !window.location.search) return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const trackingParams: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      if (isTrackingParam(key)) {
        const trimmed = value.trim();
        if (trimmed) {
          trackingParams[key.toLowerCase()] = trimmed;
        }
      }
    }

    if (Object.keys(trackingParams).length === 0) return null;

    // Cache in memory for immediate resilience
    memoryUtmCache = { ...memoryUtmCache, ...trackingParams };

    try {
      const existing = getStoredUtm();
      const merged = { ...existing, ...trackingParams };
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    } catch (err) {
      console.warn("Unable to save tracking parameters to sessionStorage:", err);
    }

    return trackingParams;
  } catch (err) {
    console.warn("Unable to parse tracking parameters:", err);
    return null;
  }
}

/**
 * Strips tracking parameters from the current browser address bar without causing
 * a page reload, while safely preserving non-tracking query parameters and hash anchors.
 * Returns true if the address bar was updated, or false if no tracking params were present.
 */
export function cleanTrackingUrl(): boolean {
  if (typeof window === "undefined" || !window.location.search) return false;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const trackingParams: Record<string, string> = {};
    const keysToDelete: string[] = [];

    for (const [key, value] of searchParams.entries()) {
      if (isTrackingParam(key)) {
        const trimmed = value.trim();
        if (trimmed) {
          trackingParams[key.toLowerCase()] = trimmed;
        }
        keysToDelete.push(key);
      }
    }

    if (keysToDelete.length === 0) return false;

    // Ensure non-empty attribution parameters are preserved before stripping URL
    if (Object.keys(trackingParams).length > 0) {
      memoryUtmCache = { ...memoryUtmCache, ...trackingParams };
      try {
        const existing = getStoredUtm();
        const merged = { ...existing, ...trackingParams };
        window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.warn("Unable to save tracking parameters to sessionStorage:", err);
      }
    }

    // Delete all unique tracking keys from searchParams
    const uniqueKeys = Array.from(new Set(keysToDelete));
    for (const key of uniqueKeys) {
      searchParams.delete(key);
    }

    const remainingQuery = searchParams.toString();
    const queryPart = remainingQuery ? `?${remainingQuery}` : "";
    const cleanUrl = `${window.location.pathname}${queryPart}${window.location.hash}`;

    window.history.replaceState(window.history.state ?? {}, document.title, cleanUrl);
    return true;
  } catch (err) {
    console.warn("Unable to silently clean tracking parameters from URL:", err);
    return false;
  }
}

/**
 * Enriches Vercel Analytics events with stored attribution parameters.
 * If the address bar has already been cleaned via replaceState before the
 * analytics script fires, this restores the UTM parameters to event.url
 * so that the Vercel Analytics dashboard retains full attribution.
 */
export function enrichAnalyticsEvent<T extends { url: string }>(event: T): T {
  try {
    const utm = getStoredUtm();
    if (!utm || Object.keys(utm).length === 0) return event;

    const base =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://cloviswebdesign.com";
    const parsedUrl = new URL(event.url, base);
    let modified = false;

    for (const [key, value] of Object.entries(utm)) {
      if (value && !parsedUrl.searchParams.has(key)) {
        parsedUrl.searchParams.set(key, value);
        modified = true;
      }
    }

    if (modified) {
      return {
        ...event,
        url: parsedUrl.toString(),
      };
    }
  } catch (err) {
    console.warn("Analytics event enrichment failed:", err);
  }
  return event;
}

/**
 * Performs a silent clean:
 * 1. Immediately saves tracking parameters to sessionStorage under 'clovis_utm'.
 * 2. Waits a tick (or right after analytics initialization) and removes the tracking
 *    query parameters from the browser address bar without a page reload.
 *
 * Returns a cleanup cancellation function for timeouts.
 */
export function silentClean(delayMs: number = 0): () => void {
  if (typeof window === "undefined") return () => {};

  // Step 1: Immediately read and preserve attribution
  saveTrackingParams();

  // Step 2: Wait a tick to let analytics (e.g. @vercel/analytics) initialize with the
  // full URL, then silently clean the browser address bar.
  const timer = setTimeout(() => {
    cleanTrackingUrl();
  }, delayMs);

  return () => clearTimeout(timer);
}

/**
 * React hook that triggers the silent clean on mount and whenever the route updates.
 */
export function useSilentClean(dependency?: unknown): void {
  useEffect(() => {
    return silentClean();
  }, [dependency]);
}

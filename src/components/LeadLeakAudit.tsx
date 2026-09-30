import { useState, useRef, useMemo } from "react";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/data";

const TRADES = [
  "Contractor / Home Services",
  "Medical & Dental Clinic",
  "Restaurant & Food",
  "Local Retail & Boutique",
  "Professional & Legal",
];

export function LeadLeakAudit({ compact = false }: { compact?: boolean }) {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("Clovis, CA");
  const [trade, setTrade] = useState(TRADES[0]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);

  const cleanBusiness = businessName.trim() || "My Business";
  const cleanCity = city.trim() || "Clovis, CA";

  const smsMessage = useMemo(() => {
    return `Hi Adam! I ran the lead-leak teardown for ${cleanBusiness} in ${cleanCity} (${trade}). The report flagged our mobile bounce tax and missing Google Maps schema. Can we discuss fixing this with your $500 launch package?`;
  }, [cleanBusiness, cleanCity, trade]);

  const smsHref = `sms:${PHONE_TEL}?&body=${encodeURIComponent(smsMessage)}`;

  const runAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessName.trim()) {
      setErrorMsg("Please enter your business name.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setStreamingContent("");
    setCompleted(false);

    try {
      const res = await fetch("/api/teardown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: cleanBusiness,
          city: cleanCity,
          trade,
          websiteUrl: websiteUrl.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body received from server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        accumulated += text;
        setStreamingContent(accumulated);

        // Smoothly scroll results into view on mobile
        if (resultsRef.current && resultsRef.current.scrollHeight > 100) {
          resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
        }
      }

      setCompleted(true);
    } catch (err: any) {
      console.error("Audit error:", err);
      setErrorMsg(err.message || "Something went wrong running the audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(smsMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className={`w-full overflow-hidden rounded-[32px] border border-ink/15 bg-cream/95 text-ink shadow-[0_30px_70px_-25px_rgba(30,43,35,0.2)] ${compact ? "p-5 sm:p-6" : "p-6 sm:p-10"}`}>
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-persimmon opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-persimmon"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[.18em] text-persimmon font-semibold">
            Google Gemini 2.0 Engine · Central Valley Speed &amp; SEO Audit
          </span>
        </div>
        <span className="rounded-full bg-leaf/10 px-3 py-1 font-mono text-[10px] font-semibold text-leaf">
          Free · 60 Seconds
        </span>
      </div>

      <div className="mt-6">
        <h3 className={`font-display font-[420] leading-tight text-ink ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          Where is your website <em className="wonk text-persimmon">leaking leads?</em>
        </h3>
        <p className="mt-2 text-sm text-ink/75 sm:text-base leading-relaxed">
          Enter your trade and city below. Our diagnostic engine checks your local mobile latency hazard, your Google Maps 3-Pack justification gaps, and what it costs in lost calls every month.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={runAudit} className="mt-7 space-y-5">
        {/* Trade Selector Chips */}
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[.16em] text-ink/65 mb-2.5">
            1. Select your industry
          </label>
          <div className="flex flex-wrap gap-2">
            {TRADES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTrade(t)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-200 ${
                  trade === t
                    ? "scale-[1.02] border-ink bg-ink text-cream font-medium shadow-sm"
                    : "border-ink/20 bg-paper/60 text-ink/80 hover:border-ink/40 hover:bg-paper"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Business Name and City */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="audit-business-name" className="block">
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">
              2. Business name <span className="text-persimmon">*</span>
            </span>
            <input
              id="audit-business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Olsen Roofing & Solar"
              required
              className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-sans text-[15px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
            />
          </label>

          <label htmlFor="audit-city" className="block">
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">
              3. City / Service Area
            </span>
            <input
              id="audit-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Clovis, CA (or Fresno, Madera)"
              className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-sans text-[15px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
            />
          </label>
        </div>

        {/* Optional Website URL */}
        <label htmlFor="audit-website-url" className="block">
          <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">
            <span>4. Current website URL (Optional)</span>
            <span className="text-ink/40">Leave blank if starting fresh</span>
          </span>
          <input
            id="audit-website-url"
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="e.g. olsenroofing.com (or mybusiness.biz)"
            className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-mono text-[13.5px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
          />
        </label>

        {errorMsg && (
          <div className="rounded-xl border border-persimmon/30 bg-persimmon/10 px-4 py-2.5 text-xs text-persimmon-deep">
            {errorMsg}
          </div>
        )}

        {/* Run Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-persimmon py-4 text-center font-display text-lg font-medium text-cream shadow-md transition hover:bg-persimmon-deep hover:shadow-lg disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
              <span>Analyzing Central Valley signals…</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Run 60-Second Lead-Leak Teardown</span>
            </>
          )}
        </button>
      </form>

      {/* Streaming Results Display */}
      {(loading || streamingContent) && (
        <div className="mt-8 border-t border-ink/10 pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-leaf font-semibold">
              <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" />
              Live Diagnostic Output
            </div>
            {loading && (
              <span className="font-mono text-[10px] text-ink/50 animate-pulse">
                Streaming from Google Gemini…
              </span>
            )}
            {completed && (
              <span className="font-mono text-[10px] text-leaf font-bold">
                ✓ Analysis complete
              </span>
            )}
          </div>

          <div
            ref={resultsRef}
            className="max-h-[420px] overflow-y-auto rounded-2xl border border-ink/15 bg-paper p-5 sm:p-6 font-sans text-sm leading-relaxed text-ink/90 shadow-inner whitespace-pre-line"
          >
            {streamingContent}
            {loading && !streamingContent && (
              <div className="flex items-center gap-3 py-6 text-ink/60 font-mono text-xs">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-persimmon border-t-transparent" />
                Connecting to Gemini edge endpoint and computing market bounce rates...
              </div>
            )}
          </div>

          {/* High-Intent Conversion Card */}
          {completed && (
            <div className="mt-6 rounded-3xl border-2 border-persimmon bg-gradient-to-br from-cream via-paper to-blush/40 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-persimmon px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream">
                  Next Step · $500 Launch Offer
                </span>
                <span className="font-mono text-xs text-ink/60">Live in 6 Days</span>
              </div>

              <h4 className="font-display mt-3 text-2xl font-[420] text-ink">
                Ready to plug these leaks for <em className="wonk text-persimmon">$500 flat?</em>
              </h4>
              <p className="mt-1.5 text-sm text-ink/80 leading-snug">
                Text this diagnostic breakdown directly to Adam's cell. No sales pitch, no account rep — the person who answers builds your site.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={smsHref}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-persimmon px-6 py-3.5 font-medium text-cream shadow transition hover:bg-persimmon-deep hover:scale-[1.02]"
                >
                  <span>💬</span>
                  <span>Text Teardown to Adam ({PHONE_DISPLAY})</span>
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 bg-cream/90 px-4 py-3 font-mono text-xs text-ink transition hover:border-ink/50 hover:bg-cream"
                >
                  {copied ? "✓ Copied to clipboard" : "📋 Copy Summary"}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-ink/60 pt-2 border-t border-ink/10">
                <span>Direct cell: <a href={`tel:${PHONE_TEL}`} className="underline hover:text-persimmon">{PHONE_DISPLAY}</a></span>
                <span>100% Client Code Ownership</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

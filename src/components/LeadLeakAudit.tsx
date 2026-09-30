import { useState, useRef, useMemo, useId } from "react";
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
  const id = useId(); // this form renders twice (page + phone drawer), so ids must be unique

  const site = websiteUrl.trim();
  const smsMessage = useMemo(
    () =>
      site
        ? `Hi Adam! I ran the website check on ${site}. Can you tell me what you'd fix first?`
        : `Hi Adam! I don't have a website yet${businessName.trim() ? ` for ${businessName.trim()}` : ""}. Can we talk about the $1,500 starter site?`,
    [site, businessName]
  );

  const smsHref = `sms:${PHONE_TEL}?&body=${encodeURIComponent(smsMessage)}`;

  const runAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setStreamingContent("");
    setCompleted(false);

    try {
      const res = await fetch("/api/teardown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName.trim(), city: city.trim(), trade, websiteUrl: site }),
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
      setErrorMsg(err.message || "Something went wrong running the check. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(streamingContent).then(() => {
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
            Free website check
          </span>
        </div>
        <span className="rounded-full bg-leaf/10 px-3 py-1 font-mono text-[10px] font-semibold text-leaf">
          Free · about 30 seconds
        </span>
      </div>

      <div className="mt-6">
        <h3 className={`font-display font-[420] leading-tight text-ink ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          Where is your website <em className="wonk text-persimmon">leaking leads?</em>
        </h3>
        <p className="mt-2 text-sm text-ink/75 sm:text-base leading-relaxed">
          Type your website below. The check loads it, runs Google's own mobile speed test, and looks for what gets you calls: a tap-to-call button, business details Google can read, a Spanish version. Then you get a plain-English list of what to fix first.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={runAudit} className="mt-7 space-y-5">
        <label className="block" htmlFor={`${id}-url`}>
          <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">
            <span>1. Your website</span>
            <span className="text-ink/40">No site yet? Leave it blank</span>
          </span>
          <input
            id={`${id}-url`}
            type="text"
            inputMode="url"
            autoComplete="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="e.g. olsenroofing.com"
            className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-mono text-[13.5px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor={`${id}-business`}>
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">2. Business name (optional)</span>
            <input
              id={`${id}-business`}
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Olsen Roofing & Solar"
              className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-sans text-[15px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
            />
          </label>

          <label className="block" htmlFor={`${id}-city`}>
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/65">3. City</span>
            <input
              id={`${id}-city`}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Clovis, CA (or Fresno, Madera)"
              className="mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 font-sans text-[15px] outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream"
            />
          </label>
        </div>

        <div>
          <div id={`${id}-trade`} className="block font-mono text-[10px] uppercase tracking-[.16em] text-ink/65 mb-2.5">
            4. What you do
          </div>
          <div role="group" aria-labelledby={`${id}-trade`} className="flex flex-wrap gap-2">
            {TRADES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTrade(t)}
                aria-pressed={trade === t}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persimmon focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
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
              <span>Checking your site…</span>
            </>
          ) : (
            <>
              <span>Check my website</span>
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
              Your results
            </div>
            {loading && (
              <span className="font-mono text-[10px] text-ink/50 animate-pulse">
                Checking… up to 30 seconds
              </span>
            )}
            {completed && (
              <span className="font-mono text-[10px] text-leaf font-bold">
                ✓ Done
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
                Starting the check…
              </div>
            )}
          </div>

          {/* High-Intent Conversion Card */}
          {completed && (
            <div className="mt-6 rounded-3xl border-2 border-persimmon bg-gradient-to-br from-cream via-paper to-blush/40 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-persimmon px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream">
                  Next Step · $1,500 Starter Site
                </span>
                <span className="font-mono text-xs text-ink/60">Live in about a week</span>
              </div>

              <h4 className="font-display mt-3 text-2xl font-[420] text-ink">
                Want these fixed? One page, <em className="wonk text-persimmon">$1,500 flat.</em>
              </h4>
              <p className="mt-1.5 text-sm text-ink/80 leading-snug">
                Text my cell about it. No sales pitch, no account rep — the person who answers builds the site.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={smsHref}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-persimmon px-6 py-3.5 font-medium text-cream shadow transition hover:bg-persimmon-deep hover:scale-[1.02]"
                >
                  <span>💬</span>
                  <span>Text Adam about it</span>
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 bg-cream/90 px-4 py-3 font-mono text-xs text-ink transition hover:border-ink/50 hover:bg-cream"
                >
                  {copied ? "✓ Copied" : "📋 Copy results"}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-ink/60 pt-2 border-t border-ink/10">
                <span>Direct cell: <a href={`tel:${PHONE_TEL}`} className="underline hover:text-persimmon">{PHONE_DISPLAY}</a></span>
                <span>You own the code and domain</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

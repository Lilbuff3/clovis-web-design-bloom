import { useState, useMemo, useId } from "react";
import { PHONE_DISPLAY, PHONE_TEL } from "../lib/data";

type Link = { title: string; uri: string };
type Answer = { question: string; answer: string; places: string[]; sources: Link[]; named: string | null; lookedFor: boolean };

const an = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
// Google Maps attribution as Google specifies it: exact text, 12–16px, gray, never wrapped or translated.
const MAPS_CREDIT = { fontFamily: "Roboto, sans-serif", fontWeight: 400, fontSize: 12, color: "#5e5e5e", whiteSpace: "nowrap" } as const;
const sms = (body: string) => `sms:${PHONE_TEL}?&body=${encodeURIComponent(body)}`;

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3 outline-none transition placeholder:text-ink/35 focus:border-persimmon focus:bg-cream";
const labelClass = "font-mono text-[10px] uppercase tracking-[.16em] text-ink/65";

// The check streams plain text (it's also what "Copy results" copies); this lays it out line by line.
const PROGRESS = /^(Loading .+|Running Google.+)…$/;
const ROW = /^([✓✗–]) ([^:]+): (.+)$/;
const HEADING = /^(what the check found|what['’]s working|what to fix first):?$/i;
const MARK = {
  "✓": { label: "Passed", className: "bg-leaf/15 text-leaf" },
  "✗": { label: "Missing", className: "bg-persimmon/15 text-persimmon-deep" },
  "–": { label: "Note", className: "bg-ink/5 text-ink/50" },
} as const;

function Spinner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2 font-mono text-xs text-ink/60">
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-persimmon border-t-transparent" />
      {children}
    </div>
  );
}

function CheckResult({ text, loading }: { text: string; loading: boolean }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1];
  let working = false; // bullets under "What's working" get a check, fixes an arrow
  return (
    <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/90">
      {!lines.length && loading && <Spinner>Starting the check…</Spinner>}
      {lines.map((line, i) => {
        // Progress lines only while they're the latest news.
        if (PROGRESS.test(line)) return loading && line === last ? <Spinner key={i}>{line}</Spinner> : null;
        const row = line.match(ROW);
        if (row) {
          const mark = MARK[row[1] as keyof typeof MARK];
          return (
            <div key={i} className="flex items-start gap-3 border-b border-ink/10 py-2">
              <span role="img" aria-label={mark.label} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${mark.className}`}>
                {row[1]}
              </span>
              <span className="min-w-0 flex-1 sm:flex sm:justify-between sm:gap-6">
                <span className="block font-medium text-ink">{row[2]}</span>
                <span className="block text-ink/65 sm:text-right">{row[3]}</span>
              </span>
            </div>
          );
        }
        if (HEADING.test(line)) {
          working = /working/i.test(line);
          return (
            <h5 key={i} className="font-display pt-4 text-xl text-ink first:pt-0">
              {line[0] + line.slice(1).toLowerCase().replace(/:$/, "")}
            </h5>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="flex gap-2.5">
              <span aria-hidden="true" className={working ? "text-leaf" : "text-persimmon"}>{working ? "✓" : "→"}</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        }
        if (line.startsWith("Written by Gemini")) return <p key={i} className="pt-2 font-mono text-[10px] text-ink/50">{line}</p>;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export function LeadLeakAudit({ compact = false }: { compact?: boolean }) {
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("Clovis, CA");
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sent, setSent] = useState({ trade: "", city: "", name: "", site: "" });
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [completed, setCompleted] = useState(false);
  const [ai, setAi] = useState<Answer | "asking" | "failed" | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const id = useId(); // this form renders twice (page + phone drawer), so ids must be unique

  const answer = typeof ai === "object" ? ai : null;
  const outcome = !answer ? "none" : !answer.lookedFor ? "unknown" : answer.named ? "named" : "missing";
  const busy = loading || ai === "asking";
  const asked = `${an(sent.trade)} ${sent.trade} in ${sent.city}`;
  const who = sent.name || sent.site;

  // Each result writes the visitor's first text to Adam, so it says what they just saw.
  const smsMessage = useMemo(() => {
    const flagged = [...streamingContent.matchAll(/^✗ ([^:]+):/gm)].map((m) => m[1]);
    const findings = flagged.length ? ` My site check flagged: ${flagged.join(", ")}.` : "";
    const top = list(answer?.places.slice(0, 3) ?? []);
    if (outcome === "named") {
      return sent.site
        ? `Hi Adam! Gemini named ${answer?.named} when I asked for ${asked}.${findings} Is our site turning those people into calls?`
        : `Hi Adam! Gemini named ${answer?.named} when I asked for ${asked}, but we don't have a website for those people to land on. Can we talk about the $1,500 starter site?`;
    }
    if (outcome !== "none") {
      return `Hi Adam! I asked Gemini for ${asked}. It named ${top}${outcome === "missing" ? `, not ${who}` : ""}.${findings} What would it take to get on that list?`;
    }
    return sent.site
      ? `Hi Adam! I ran the website check on ${sent.site}.${findings} Can you tell me what you'd fix first?`
      : `Hi Adam! I don't have a website yet${sent.name ? ` for ${sent.name}` : ""}. Can we talk about the $1,500 starter site?`;
  }, [streamingContent, answer, outcome, sent, asked, who]);

  const recheckHref = sms(`Hi Adam! Could you re-ask Gemini for ${asked} next month and text me whether ${who ? `${who} shows up` : "we show up"}?`);

  const next = {
    named: {
      badge: "Next step · Text Adam",
      title: sent.site ? (
        <>You're on the list. <em className="wonk text-persimmon">Does your site turn them into calls?</em></>
      ) : (
        <>You're on the list. <em className="wonk text-persimmon">Give them somewhere to land.</em></>
      ),
      body: sent.site
        ? "People who tap through from Gemini land on your site. Send me your results and I'll tell you what I'd fix first."
        : "People who tap through from Gemini have no website to land on. A one-page site gives them a big call button and your hours: $1,500, live in about a week.",
    },
    missing: {
      badge: "Next step · Text Adam",
      title: <>Want to be on <em className="wonk text-persimmon">that list?</em></>,
      body: "Text me. I'll tell you honestly what it would take, and whether a new website is even the missing piece.",
    },
    unknown: {
      badge: "Next step · Text Adam",
      title: <>Is your business on <em className="wonk text-persimmon">that list?</em></>,
      body: "Text me. I'll tell you honestly what it would take, and whether a new website is even the missing piece.",
    },
    none: {
      badge: "Next Step · $1,500 Starter Site",
      title: <>Want these fixed? One page, <em className="wonk text-persimmon">$1,500 flat.</em></>,
      body: "Text my cell about it. No sales pitch, no account rep — the person who answers builds the site.",
    },
  }[outcome];

  const runAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const now = { trade: trade.trim(), city: city.trim() || "Clovis, CA", name: businessName.trim(), site: websiteUrl.trim() };
    const payload = JSON.stringify({ businessName: now.name, city: now.city, trade: now.trade, websiteUrl: now.site });
    setSent(now);
    setErrorMsg("");
    setLoading(true);
    setStreamingContent("");
    setCompleted(false);
    setAi("asking");

    // Not awaited: Gemini usually answers well before the speed test finishes, so its card shows first.
    fetch("/api/ask-gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((a: Answer) => setAi(a))
      .catch(() => setAi("failed"));

    try {
      const res = await fetch("/api/teardown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
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
            Free check
          </span>
        </div>
        <span className="rounded-full bg-leaf/10 px-3 py-1 font-mono text-[10px] font-semibold text-leaf">
          Free · about 30 seconds
        </span>
      </div>

      <div className="mt-6">
        <h3 className={`font-display font-[420] leading-tight text-ink ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          Does Google's AI <em className="wonk text-persimmon">recommend you?</em>
        </h3>
        <p className="mt-2 text-sm text-ink/75 sm:text-base leading-relaxed">
          Tell me what you do and where. The check asks Gemini, Google's AI, the question your customers ask, then checks your website: Google's own speed test, a tap-to-call button, business details Google can read. You get plain-English results and a text to me, already written.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={runAudit} className="mt-7 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor={`${id}-trade`}>
            <span className={labelClass}>1. What you do</span>
            <input
              id={`${id}-trade`}
              type="text"
              required
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              placeholder="e.g. roofer, dentist, taqueria"
              className={`${inputClass} font-sans text-[15px]`}
            />
          </label>

          <label className="block" htmlFor={`${id}-city`}>
            <span className={labelClass}>2. Your town</span>
            <input
              id={`${id}-city`}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Clovis, CA (or Fresno, Madera)"
              className={`${inputClass} font-sans text-[15px]`}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor={`${id}-business`}>
            <span className={labelClass}>3. Your business name</span>
            <input
              id={`${id}-business`}
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Olsen Roofing & Solar"
              className={`${inputClass} font-sans text-[15px]`}
            />
          </label>

          <label className="block" htmlFor={`${id}-url`}>
            <span className={labelClass}>4. Website, if you have one</span>
            <input
              id={`${id}-url`}
              type="text"
              inputMode="url"
              autoComplete="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. olsenroofing.com"
              className={`${inputClass} font-mono text-[13.5px]`}
            />
          </label>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-persimmon/30 bg-persimmon/10 px-4 py-2.5 text-xs text-persimmon-deep">
            {errorMsg}
          </div>
        )}

        {/* Run Button */}
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-persimmon py-4 text-center font-display text-lg font-medium text-cream shadow-md transition hover:bg-persimmon-deep hover:shadow-lg disabled:opacity-60"
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
              <span>Checking…</span>
            </>
          ) : (
            <span>{websiteUrl.trim() ? "Ask Gemini + check my site" : "Ask Gemini"}</span>
          )}
        </button>
      </form>

      {/* Results */}
      {(loading || streamingContent || ai) && (
        <div className="mt-8 border-t border-ink/10 pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-leaf font-semibold">
              <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" />
              Your results
            </div>
            {busy && (
              <span className="font-mono text-[10px] text-ink/50 animate-pulse">
                Checking… up to 30 seconds
              </span>
            )}
            {completed && !busy && (
              <span className="font-mono text-[10px] text-leaf font-bold">
                ✓ Done
              </span>
            )}
          </div>

          {/* What Gemini said: first, because it answers in seconds */}
          {ai && (
            <div className="mb-4 rounded-2xl border border-ink/15 bg-cream p-5 sm:p-6">
              <div className="font-mono text-[11px] uppercase tracking-[.18em] text-persimmon font-semibold">
                What Gemini tells your customers
              </div>
              {ai === "asking" ? (
                <div className="flex min-h-[120px] items-center gap-3 text-sm text-ink/70">
                  <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-persimmon border-t-transparent" />
                  Asking Gemini who it recommends for {asked}…
                </div>
              ) : ai === "failed" ? (
                <p className="mt-2 font-mono text-xs text-ink/60">Gemini didn't answer this time. Your site check is below.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-ink/75">
                    We asked Gemini, Google's AI, using Google Maps: “{ai.question}”
                  </p>
                  {ai.lookedFor && (
                    <p className={`font-display mt-3 text-xl ${ai.named ? "text-leaf" : "text-persimmon-deep"}`}>
                      {ai.named ? `✓ Gemini named you: ${ai.named}` : "✗ You weren't in Gemini's answer"}
                    </p>
                  )}
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/90">{ai.answer}</p>
                  {/* Google's terms: every Maps source right after the answer (collapsing is allowed), credited as "Google Maps" exactly. */}
                  <details className="mt-3 border-t border-ink/10 pt-3 text-[13px]">
                    <summary className="cursor-pointer font-mono text-[11px] text-ink/60 hover:text-ink">
                      Sources from{" "}
                      <span translate="no" style={MAPS_CREDIT}>
                        Google Maps
                      </span>{" "}
                      ({ai.sources.length})
                    </summary>
                    <ul className="mt-2 space-y-1.5">
                      {ai.sources.map((s) => (
                        <li key={s.uri}>
                          <a href={s.uri} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:text-persimmon">
                            {s.title}
                          </a>
                          {" · "}
                          <span translate="no" style={MAPS_CREDIT}>
                            Google Maps
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/50">
                    One question, asked just now. Google's AI Mode, the Gemini app and other AI apps can answer differently, and answers change.
                  </p>
                </>
              )}
            </div>
          )}

          {(loading || streamingContent) && (
            <div className="rounded-2xl border border-ink/15 bg-cream p-5 sm:p-6">
              <div className="font-mono text-[11px] uppercase tracking-[.18em] text-persimmon font-semibold">
                Website check{sent.site && ` · ${sent.site.replace(/^https?:\/\//i, "").replace(/\/$/, "")}`}
              </div>
              <CheckResult text={streamingContent} loading={loading} />
            </div>
          )}

          {/* Next step: shown once Gemini answers, or once the check is done and Gemini has settled */}
          {(answer || (completed && ai !== "asking")) && (
            <div className="mt-6 rounded-3xl border-2 border-persimmon bg-gradient-to-br from-cream via-paper to-blush/40 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-persimmon px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream">
                  {next.badge}
                </span>
                {outcome === "none" && <span className="font-mono text-xs text-ink/60">Live in about a week</span>}
              </div>

              <h4 className="font-display mt-3 text-2xl font-[420] text-ink">{next.title}</h4>
              <p className="mt-1.5 text-sm text-ink/80 leading-snug">{next.body}</p>

              <div className="mt-5">
                <div className="font-mono text-[9px] uppercase tracking-[.16em] text-ink/50">Your text, ready to send</div>
                <div
                  key={smsMessage}
                  className="mt-2 ml-auto max-w-[95%] rounded-3xl rounded-br-md bg-persimmon px-4 py-3 text-[14px] leading-snug text-white shadow-md"
                  style={{ animation: "pop .35s cubic-bezier(.3,1.4,.5,1)" }}
                >
                  {smsMessage}
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={sms(smsMessage)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-persimmon px-6 py-3.5 font-medium text-cream shadow transition hover:bg-persimmon-deep hover:scale-[1.02]"
                >
                  <span>💬</span>
                  <span>Send this to Adam</span>
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 bg-cream/90 px-4 py-3 font-mono text-xs text-ink transition hover:border-ink/50 hover:bg-cream"
                >
                  {copied ? "✓ Copied" : "📋 Copy results"}
                </button>
              </div>

              {(outcome === "missing" || outcome === "unknown") && (
                <a href={recheckHref} className="mt-4 block text-center text-[13px] underline decoration-persimmon decoration-2 underline-offset-4 hover:text-persimmon">
                  Not ready? Ask me to re-check next month
                </a>
              )}

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

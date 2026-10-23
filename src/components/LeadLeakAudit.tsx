import { useEffect, useId, useRef, useState } from "react";
import { PHONE_DISPLAY, mailTo, smsTo } from "../lib/data";

type Link = { title: string; uri: string };
type Answer = { question: string; answer: string; places: Link[]; sources: Link[]; named: string | null; lookedFor: boolean };

const an = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
// Results only render after a click, so this never runs on the server.
// Phones get a text to Adam; computers, which mostly can't open sms: links, get an email.
const onPhone = () => window.matchMedia("(pointer: coarse)").matches;
const reach = (body: string) => (onPhone() ? smsTo(body) : mailTo("Free AI check", body));
// Settles in on an exponential ease-out; no overshoot (DESIGN.md: no bouncy easing).
const rise = (delayMs: number) => ({ animation: `rise .7s cubic-bezier(.16,1,.3,1) ${delayMs}ms both` });
// Google Maps attribution as Google specifies it: exact text, 12–16px, gray, never wrapped or translated.
const MAPS_CREDIT = { fontFamily: "Roboto, sans-serif", fontWeight: 400, fontSize: 12, color: "#5e5e5e", whiteSpace: "nowrap" } as const;

const inputClass =
  "mt-1.5 w-full rounded-[8px] border border-[#151515]/20 bg-white px-4 py-3.5 font-sans text-base text-[#151515] outline-none transition placeholder:text-ink-soft focus:border-[#151515] focus:ring-1 focus:ring-[#151515]";
const labelClass = "font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft";
const smallLabel = "font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft";

export function LeadLeakAudit({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("Clovis, CA");
  const [sent, setSent] = useState({ name: "", trade: "", city: "" });
  const [ai, setAi] = useState<Answer | "asking" | "failed" | "limit" | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const id = useId(); // this form renders twice (page + phone drawer), so ids must be unique
  const Title = compact ? "h3" : "h2";

  const runCheck = (
    now: { name: string; trade: string; city: string },
    source: "outreach" | "organic" = "organic"
  ) => {
    setSent(now);
    setCopiedReport(false);
    setAi("asking");
    if (typeof window !== "undefined") {
      const detail = { business: now.name, trade: now.trade, city: now.city, source };
      window.dispatchEvent(new CustomEvent("ai_audit_run", { detail }));
      (window as any).va?.("event", { name: "ai_audit_run", ...detail });
      (window as any).gtag?.("event", "ai_audit_run", detail);
    }
    fetch("/api/ask-gemini/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: now.name,
        trade: now.trade,
        city: now.city,
        source,
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((a: Answer) => setAi(a))
      .catch((status) => setAi(status === 429 ? "limit" : "failed"));
  };

  // Support personalized outreach links: /?biz=Olsen+Roofing&trade=roofer&city=Clovis,+CA&autorun=1#check
  useEffect(() => {
    if (compact || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qBiz = params.get("biz")?.trim() || params.get("business")?.trim() || "";
    const qTrade = params.get("trade")?.trim() || "";
    const qCity = params.get("city")?.trim() || "Clovis, CA";
    const autorun = params.get("autorun") === "1" || params.get("autorun") === "true";

    if (qBiz) setName(qBiz);
    if (qTrade) setTrade(qTrade);
    if (params.has("city") && qCity) setCity(qCity);

    if (qTrade && (autorun || (qBiz && window.location.hash === "#check"))) {
      document.getElementById("check")?.scrollIntoView({ behavior: "smooth", block: "center" });
      runCheck(
        { name: qBiz, trade: qTrade, city: qCity },
        autorun ? "outreach" : "organic"
      );
    }
  }, [compact]);

  // The form goes away while it asks, so focus moves to whatever comes back.
  useEffect(() => {
    if (ai && ai !== "asking") resultRef.current?.focus();
  }, [ai]);

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    runCheck(
      { name: name.trim(), trade: trade.trim(), city: city.trim() || "Clovis, CA" },
      "organic"
    );
  };

  const copyReportLink = () => {
    const params = new URLSearchParams({
      biz: sent.name,
      trade: sent.trade,
      city: sent.city,
      autorun: "1",
    });
    const shareUrl = `https://cloviswebdesign.com/?${params.toString()}#check`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedReport(true);
        setTimeout(() => setCopiedReport(false), 2500);
      });
    }
  };

  const asked = `${an(sent.trade)} ${sent.trade} in ${sent.city}`;
  const answer = typeof ai === "object" ? ai : null;
  const named = answer?.named ?? null;
  const missing = !!answer?.lookedFor && !named;
  // Top 3, or down to the visitor if Gemini named them further along.
  const shown = answer ? answer.places.slice(0, Math.max(3, answer.places.findIndex((p) => p.title === named) + 1)) : [];
  const names = list(answer?.places.slice(0, 3).map((p) => p.title) ?? []);
  const text = named
    ? `Hi Adam! Gemini named ${named} when I asked for ${asked}. Is our website ready for the people it sends?`
    : `Hi Adam! I asked Gemini for ${asked}. It named ${names}${missing ? `, not ${sent.name}` : ""}. Why does AI pick them, and what would it take to get on that list?`;
  const askAdam = `Hi Adam! Can you check whether Google's AI recommends ${sent.name} for ${asked}?`;
  const recheck = `Hi Adam! Could you re-ask Gemini for ${asked} next month and text me whether ${sent.name} shows up?`;

  return (
    <div className={`w-full overflow-hidden rounded-[16px] border border-[#151515]/15 bg-[#EDEDED] text-[#151515] shadow-sm ${compact ? "p-5 sm:p-6" : "p-6 sm:p-12"}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#151515]/12 pb-4">
        <div className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF4D1C]" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[.16em] text-[#151515]">
            LIVE GOOGLE MAPS + GEMINI DIAGNOSTIC
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-soft">
          Real-Time Citation Check
        </span>
      </div>

      {ai === null && (
        <form
          onSubmit={ask}
          {...({
            toolname: "audit_ai_visibility",
            tooldescription: "Check whether Google Maps and Google Gemini AI recommend a business for its industry and city.",
          } as Record<string, string>)}
        >
          {/* h2 as the #check section's own heading; h3 under the drawer's "Free AI check" h2. */}
          <Title className={`font-sans font-bold leading-[1.02] tracking-[-0.035em] text-[#151515] ${compact ? "text-3xl" : "h-section"}`}>
            Can AI find you?
          </Title>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Customers ask Google Maps and AI who to hire. Type your business and see whether it names you right now.
          </p>

          <div className={`mt-7 grid gap-4 ${compact ? "" : "sm:grid-cols-3"}`}>
            <label className="block" htmlFor={`${id}-name`}>
              <span className={labelClass}>Your business</span>
              <input id={`${id}-name`} name="businessName" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sierra View Dental or Valley Law" className={inputClass} />
            </label>
            <label className="block" htmlFor={`${id}-trade`}>
              <span className={labelClass}>What you do</span>
              <input id={`${id}-trade`} name="trade" type="text" required value={trade} onChange={(e) => setTrade(e.target.value)} placeholder="e.g. dentist, CPA, medspa, restaurant, contractor" className={inputClass} />
            </label>
            <label className="block" htmlFor={`${id}-city`}>
              <span className={labelClass}>Your city</span>
              <input id={`${id}-city`} name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Clovis, CA" className={inputClass} />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-[8px] bg-[#151515] py-4 font-sans text-lg font-semibold text-white transition hover:bg-[#FF4D1C]"
          >
            Ask Google's AI →
          </button>
          <p className="mt-3 text-center font-mono text-xs text-ink-soft">
            Free live check · Grounded in Google Maps · Takes a few seconds.
          </p>
        </form>
      )}

      <div aria-live="polite">
        {ai === "asking" && (
          <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-[260px]" : "min-h-[380px]"}`}>
            <div className="flex gap-2.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-3.5 w-3.5 animate-pulse rounded-full bg-[#FF4D1C]" style={{ animationDuration: "1.2s", animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
            <p className={`mt-7 ${smallLabel}`}>Asking Google's AI…</p>
            <p className={`mt-3 max-w-2xl font-sans font-bold leading-tight tracking-[-0.025em] text-[#151515] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              “I need {asked}. Who do you recommend?”
            </p>
          </div>
        )}

        {answer && (
          <div ref={resultRef} tabIndex={-1} className="text-center outline-none">
            <p className={smallLabel}>We asked Google's AI</p>
            <p className="mt-2 text-base text-ink-soft sm:text-lg">“{answer.question}”</p>

            <p
              className={`mt-6 font-sans font-bold leading-[0.95] tracking-[-0.035em] ${compact ? "text-4xl" : "text-[clamp(3rem,8vw,5.5rem)]"} ${named ? "text-[#00A843]" : missing ? "text-[#FF4D1C]" : "text-[#151515]"}`}
              style={rise(0)}
            >
              {named ? "Yes. It found you." : missing ? "No. It doesn't." : "Here's who it picks."}
            </p>

            <div className="mx-auto mt-8 max-w-lg" style={rise(250)}>
              <a
                href={reach(text)}
                className="flex items-center justify-center gap-2 rounded-[8px] bg-[#151515] px-6 py-4 font-sans text-lg font-semibold text-white transition hover:bg-[#FF4D1C]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                </svg>
                {named ? "Ask me if your site's ready for them" : "Ask me why AI picks them"}
              </a>
              <p className="mt-3 text-sm text-ink-soft">
                {onPhone() ? `Opens a text to my cell, already written · ${PHONE_DISPLAY}` : `Opens an email to me, already written · or call ${PHONE_DISPLAY}`}
              </p>
              {!named && (
                <a href={reach(recheck)} className="inline-flex min-h-12 items-center px-2 text-[13px] font-medium text-[#151515] underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]">
                  Not ready? Ask me to re-check next month
                </a>
              )}
            </div>

            <p className={`mt-10 ${smallLabel}`}>{missing ? "It sends your customers to" : "Gemini recommends"}</p>
            <ol className="mx-auto mt-4 max-w-lg space-y-3 text-left">
              {shown.map((p, i) => (
                <li
                  key={p.uri}
                  style={rise(450 + i * 150)}
                  className={`relative flex items-center gap-4 rounded-[12px] border px-5 py-4 ${
                    p.title === named ? "border-[#00A843] bg-white" : "border-[#151515]/15 bg-white"
                  }`}
                >
                  <span className="font-mono text-sm text-ink-soft">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    {/* The ::after stretches the link over the whole card, so the tap target is the card. */}
                    <a href={p.uri} target="_blank" rel="noopener noreferrer" className={`block font-sans font-bold leading-tight text-[#151515] after:absolute after:inset-0 after:rounded-[12px] hover:text-[#FF4D1C] ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
                      {p.title}
                    </a>
                    <span translate="no" style={MAPS_CREDIT}>
                      Google Maps
                    </span>
                  </span>
                  {p.title === named && <span className="rounded-[6px] bg-[#00A843] px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-white">You</span>}
                </li>
              ))}
            </ol>

            {/* Google's terms: the generated answer, then every Maps source right after it (collapsing is allowed). */}
            <details className="mx-auto mt-6 max-w-lg text-left">
              <summary className="cursor-pointer py-4 font-mono text-[11px] text-ink-soft hover:text-[#151515]">
                What Gemini said, with sources from{" "}
                <span translate="no" style={MAPS_CREDIT}>
                  Google Maps
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#151515]">{answer.answer}</p>
              <ul className="mt-3 space-y-1.5 border-t border-[#151515]/15 pt-3 text-[13px]">
                {answer.sources.map((s) => (
                  <li key={s.uri}>
                    <a href={s.uri} target="_blank" rel="noopener noreferrer" className="underline decoration-[#151515]/30 underline-offset-2 hover:text-[#FF4D1C]">
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
            <p className="mx-auto mt-6 max-w-lg font-mono text-[11px] leading-relaxed text-ink-soft">
              One question, asked just now. Google's AI Mode, the Gemini app, ChatGPT, and Claude check different directories and can answer differently.
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <button type="button" onClick={copyReportLink} className="min-h-12 px-2 text-[13px] font-medium text-[#151515] underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]">
                {copiedReport ? "Report link copied ✓" : "Copy link to this report"}
              </button>
              <span aria-hidden="true" className="text-ink-soft">·</span>
              <button type="button" onClick={() => setAi(null)} className="min-h-12 px-2 text-[13px] text-[#151515] underline decoration-[#151515]/30 underline-offset-4 hover:text-[#FF4D1C]">
                Try another business
              </button>
            </div>
          </div>
        )}

        {(ai === "failed" || ai === "limit") && (
          <div ref={resultRef} tabIndex={-1} className={`flex flex-col items-center justify-center text-center outline-none ${compact ? "min-h-[220px]" : "min-h-[300px]"}`}>
            <p className={`font-sans font-bold leading-tight text-[#151515] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              {ai === "limit" ? "That's 10 checks this hour." : "Google's AI didn't answer this time."}
            </p>
            <p className="mt-3 text-ink-soft">{ai === "limit" ? "I'll look it up for you." : "Give it another try in a minute."}</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              {ai === "limit" ? (
                <a href={reach(askAdam)} className="rounded-[8px] bg-[#151515] px-6 py-3.5 font-sans font-semibold text-white transition hover:bg-[#FF4D1C]">
                  Ask me to check for you
                </a>
              ) : (
                <>
                  <button type="button" onClick={() => setAi(null)} className="rounded-[8px] bg-[#151515] px-6 py-3.5 font-sans font-semibold text-white transition hover:bg-[#FF4D1C]">
                    Try again
                  </button>
                  <a href={reach(askAdam)} className="inline-flex min-h-12 items-center px-2 text-[15px] font-medium text-[#151515] underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]">
                    Or ask me
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useId, useRef, useState } from "react";
import { PHONE_DISPLAY, mailTo, smsTo } from "../lib/data";
import { buildAuditUrl, parseAuditSearch } from "../lib/outreach-analytics";

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
  "mt-1 w-full rounded-xl border border-[#141311]/15 bg-white px-3.5 py-2.5 font-sans text-[15px] text-[#141311] outline-none transition placeholder:text-[#4A4742] focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20";
const labelClass = "font-sans text-[12px] font-semibold text-[#4A4742]";
const smallLabel = "font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[#4A4742]";

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
  ): Promise<string> => {
    setSent(now);
    setCopiedReport(false);
    setAi("asking");
    if (typeof window !== "undefined") {
      const detail = { business: now.name, trade: now.trade, city: now.city, source };
      window.dispatchEvent(new CustomEvent("ai_audit_run", { detail }));
    }
    return fetch("/api/ask-gemini/", {
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
      .then((a: Answer) => {
        setAi(a);
        return JSON.stringify(a);
      })
      .catch((status) => {
        setAi(status === 429 ? "limit" : "failed");
        return status === 429 ? "Rate limit reached (10 checks per hour)." : "Gemini lookup failed.";
      });
  };

  // Support personalized outreach links: /?biz=Olsen+Roofing&trade=roofer&city=Clovis,+CA&autorun=1#check
  useEffect(() => {
    if (compact || typeof window === "undefined") return;
    const parsed = parseAuditSearch(window.location.search, window.location.hash);

    if (parsed.biz) setName(parsed.biz);
    if (parsed.trade) setTrade(parsed.trade);
    if (parsed.hasCity) setCity(parsed.city);

    if (parsed.shouldAutorun) {
      document.getElementById("check")?.scrollIntoView({ behavior: "smooth", block: "center" });
      runCheck(
        { name: parsed.biz, trade: parsed.trade, city: parsed.city },
        parsed.autorun ? "outreach" : "organic"
      );
    }
  }, [compact]);

  // The form goes away while it asks, so focus moves to whatever comes back.
  useEffect(() => {
    if (ai && ai !== "asking") resultRef.current?.focus();
  }, [ai]);

  const ask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nativeEvt = e.nativeEvent as SubmitEvent & {
      agentInvoked?: boolean;
      respondWith?: (p: Promise<unknown>) => void;
    };
    const trimmedName = name.trim();
    const trimmedTrade = trade.trim();
    const trimmedCity = city.trim() || "Clovis, CA";

    if (!trimmedName || !trimmedTrade) {
      if (nativeEvt?.agentInvoked && typeof nativeEvt.respondWith === "function") {
        const missingFields: string[] = [];
        if (!trimmedName) missingFields.push("businessName (required)");
        if (!trimmedTrade) missingFields.push("trade (required)");
        nativeEvt.respondWith(Promise.resolve(`Validation failed: ${missingFields.join(", ")}`));
      }
      return;
    }

    const resultPromise = runCheck(
      { name: trimmedName, trade: trimmedTrade, city: trimmedCity },
      "organic"
    );
    if (nativeEvt?.agentInvoked && typeof nativeEvt.respondWith === "function") {
      nativeEvt.respondWith(resultPromise);
    }
  };

  const copyReportLink = () => {
    const shareUrl = buildAuditUrl(sent.name, sent.trade, sent.city);
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
    <div className={`w-full overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] text-[#141311] ${compact ? "p-4 sm:p-5" : "p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(20,19,17,0.08)]"}`}>
      {ai === null && (
        <form
          onSubmit={ask}
          {...({
            toolname: "audit_ai_visibility",
            tooldescription: "Check whether Google Maps and Google Gemini AI recommend a business for its industry and city.",
            toolautosubmit: "",
          } as Record<string, string>)}
        >
          <div className={compact ? "" : "lg:grid lg:grid-cols-12 lg:items-end lg:gap-8"}>
            <div className={compact ? "" : "lg:col-span-4"}>
              {/* h2 as the #check section's own heading; h3 under the drawer's "Free AI check" h2. */}
              <Title className={`font-sans font-semibold leading-[1.02] tracking-[-0.035em] text-[#141311] ${compact ? "text-2xl" : "text-[clamp(1.75rem,3vw,2.4rem)]"}`}>
                Can AI find you?
              </Title>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#4A4742]">
                Customers ask Google Maps and AI who to hire. Type your business and see whether it names you right now.
              </p>
            </div>

            <div className={compact ? "mt-4 space-y-3" : "mt-5 grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:mt-0 lg:grid-cols-12 lg:items-end"}>
              <label className={compact ? "block" : "block lg:col-span-4"} htmlFor={`${id}-name`}>
                <span className={labelClass}>Your business</span>
                <input
                  id={`${id}-name`}
                  name="businessName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sierra View Dental"
                  {...({ toolparamdescription: "e.g. Sierra View Dental, Olsen Roofing" } as Record<string, string>)}
                  className={inputClass}
                />
              </label>
              <label className={compact ? "block" : "block lg:col-span-3"} htmlFor={`${id}-trade`}>
                <span className={labelClass}>What you do</span>
                <input
                  id={`${id}-trade`}
                  name="trade"
                  type="text"
                  required
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  placeholder="e.g. dentist, CPA, roofer"
                  {...({ toolparamdescription: "e.g. dentist, CPA, roofer" } as Record<string, string>)}
                  className={inputClass}
                />
              </label>
              <label className={compact ? "block" : "block lg:col-span-2"} htmlFor={`${id}-city`}>
                <span className={labelClass}>Your city</span>
                <input
                  id={`${id}-city`}
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Clovis, CA"
                  {...({ toolparamdescription: "e.g. Clovis, CA" } as Record<string, string>)}
                  className={inputClass}
                />
              </label>
              <div className={compact ? "pt-1" : "sm:col-span-2 lg:col-span-3"}>
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-full bg-[#002FA7] px-5 py-2.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-[#141311]"
                >
                  Ask Google's AI →
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div aria-live="polite">
        {ai === "asking" && (
          <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-[260px]" : "min-h-[340px]"}`}>
            <div className="flex gap-2.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-3 w-3 animate-pulse rounded-full bg-[#002FA7]" style={{ animationDuration: "1.2s", animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
            <p className={`mt-7 ${smallLabel}`}>Asking Google's AI…</p>
            <p className={`mt-3 max-w-2xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#141311] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              “I need {asked}. Who do you recommend?”
            </p>
          </div>
        )}

        {answer && (
          <div ref={resultRef} tabIndex={-1} className="text-center outline-none">
            <p className={smallLabel}>We asked Google's AI</p>
            <p className="mt-2 text-base text-[#4A4742] sm:text-lg">“{answer.question}”</p>

            <p
              className={`mt-6 font-sans font-semibold leading-[0.95] tracking-[-0.035em] ${compact ? "text-4xl" : "text-[clamp(3rem,8vw,5.5rem)]"} ${named ? "text-[#0B6E3F]" : missing ? "text-[#C83E14]" : "text-[#141311]"}`}
              style={rise(0)}
            >
              {named ? "Yes. It found you." : missing ? "No. It doesn't." : "Here's who it picks."}
            </p>

            <div className="mx-auto mt-8 max-w-lg" style={rise(250)}>
              <a
                href={reach(text)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#002FA7] px-6 py-4 font-sans text-lg font-semibold text-white transition hover:bg-[#141311]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                </svg>
                {named ? "Ask me if your site's ready for them" : "Ask me why AI picks them"}
              </a>
              <p className="mt-3 text-sm text-[#4A4742]">
                {onPhone() ? `Opens a text to my cell, already written · ${PHONE_DISPLAY}` : `Opens an email to me, already written · or call ${PHONE_DISPLAY}`}
              </p>
              {!named && (
                <a href={reach(recheck)} className="inline-flex min-h-12 items-center px-2 text-[13px] font-semibold text-[#141311] underline decoration-[#C83E14] decoration-2 underline-offset-4 hover:text-[#C83E14]">
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
                  className={`relative flex items-center gap-4 rounded-xl border px-5 py-4 ${
                    p.title === named ? "border-[#0B6E3F] bg-white" : "border-[#141311]/15 bg-white"
                  }`}
                >
                  <span className="font-mono text-sm font-semibold text-[#4A4742]">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <a href={p.uri} target="_blank" rel="noopener noreferrer" className={`block font-sans font-semibold leading-tight text-[#141311] after:absolute after:inset-0 hover:text-[#002FA7] ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
                      {p.title}
                    </a>
                    <span translate="no" style={MAPS_CREDIT}>
                      Google Maps
                    </span>
                  </span>
                  {p.title === named && <span className="rounded-full bg-[#0B6E3F] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase text-white">You</span>}
                </li>
              ))}
            </ol>

            {/* Google's terms: the generated answer, then every Maps source right after it (collapsing is allowed). */}
            <details className="mx-auto mt-6 max-w-lg text-left">
              <summary className="cursor-pointer py-4 font-mono text-[11px] font-semibold text-[#4A4742] hover:text-[#141311]">
                What Gemini said, with sources from{" "}
                <span translate="no" style={MAPS_CREDIT}>
                  Google Maps
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#141311]">{answer.answer}</p>
              <ul className="mt-3 space-y-1.5 border-t border-[#141311]/15 pt-3 text-[13px]">
                {answer.sources.map((s) => (
                  <li key={s.uri}>
                    <a href={s.uri} target="_blank" rel="noopener noreferrer" className="underline decoration-[#141311] underline-offset-2 hover:text-[#002FA7]">
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
            <p className="mx-auto mt-6 max-w-lg font-mono text-[11px] leading-relaxed text-[#4A4742]">
              One question, asked just now. Google's AI Mode, the Gemini app, ChatGPT, and Claude check different directories and can answer differently.
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <button type="button" onClick={copyReportLink} className="min-h-12 px-2 text-[13px] font-semibold text-[#141311] underline decoration-[#C83E14] decoration-2 underline-offset-4 hover:text-[#C83E14]">
                {copiedReport ? "Report link copied ✓" : "Copy link to this report"}
              </button>
              <span aria-hidden="true" className="text-[#4A4742]">·</span>
              <button type="button" onClick={() => setAi(null)} className="min-h-12 px-2 text-[13px] font-semibold text-[#141311] underline decoration-[#141311] underline-offset-4 hover:text-[#002FA7]">
                Try another business
              </button>
            </div>
          </div>
        )}

        {(ai === "failed" || ai === "limit") && (
          <div ref={resultRef} tabIndex={-1} className={`flex flex-col items-center justify-center text-center outline-none ${compact ? "min-h-[220px]" : "min-h-[300px]"}`}>
            <p className={`font-sans font-semibold leading-tight text-[#141311] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              {ai === "limit" ? "That's 10 checks this hour." : "Google's AI didn't answer this time."}
            </p>
            <p className="mt-3 text-[#4A4742]">{ai === "limit" ? "I'll look it up for you." : "Give it another try in a minute."}</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              {ai === "limit" ? (
                <a href={reach(askAdam)} className="rounded-full bg-[#002FA7] px-6 py-3.5 font-sans font-semibold text-white transition hover:bg-[#141311]">
                  Ask me to check for you
                </a>
              ) : (
                <>
                  <button type="button" onClick={() => setAi(null)} className="rounded-full bg-[#002FA7] px-6 py-3.5 font-sans font-semibold text-white transition hover:bg-[#141311]">
                    Try again
                  </button>
                  <a href={reach(askAdam)} className="min-h-12 inline-flex items-center px-2 text-sm font-semibold text-[#141311] underline decoration-[#141311] underline-offset-4 hover:text-[#C83E14]">
                    or ask me to check
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

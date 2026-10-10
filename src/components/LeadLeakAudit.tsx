import { useEffect, useId, useRef, useState } from "react";
import { mailLink, PHONE_DISPLAY, PHONE_TEL } from "../lib/data";

type Link = { title: string; uri: string };
type Answer = { question: string; answer: string; places: Link[]; sources: Link[]; named: string | null; lookedFor: boolean };

const an = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const sms = (body: string) => `sms:${PHONE_TEL}?&body=${encodeURIComponent(body)}`;
// Settles in on an exponential ease-out; no overshoot (DESIGN.md: no bouncy easing).
const rise = (delayMs: number) => ({ animation: `rise .7s cubic-bezier(.16,1,.3,1) ${delayMs}ms both` });
// Google Maps attribution as Google specifies it: exact text, 12–16px, gray, never wrapped or translated.
const MAPS_CREDIT = { fontFamily: "Roboto, sans-serif", fontWeight: 400, fontSize: 12, color: "#5e5e5e", whiteSpace: "nowrap" } as const;

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-ink/20 bg-paper/80 px-4 py-3.5 font-sans text-base outline-none transition placeholder:text-ink-soft focus:border-persimmon-deep focus:bg-cream focus:ring-1 focus:ring-persimmon-deep";
const labelClass = "font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft";
const smallLabel = "font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft";

export function LeadLeakAudit({ compact = false }: { compact?: boolean }) {
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [city, setCity] = useState("Clovis, CA");
  const [sent, setSent] = useState({ name: "", trade: "", city: "" });
  const [ai, setAi] = useState<Answer | "asking" | "failed" | "limit" | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const id = useId(); // this form renders twice (page + phone drawer), so ids must be unique

  // The form goes away while it asks, so focus moves to whatever comes back.
  useEffect(() => {
    if (ai && ai !== "asking") resultRef.current?.focus();
  }, [ai]);

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    const now = { name: name.trim(), trade: trade.trim(), city: city.trim() || "Clovis, CA" };
    setSent(now);
    setAi("asking");
    fetch("/api/ask-gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: now.name, trade: now.trade, city: now.city }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((a: Answer) => setAi(a))
      .catch((status) => setAi(status === 429 ? "limit" : "failed"));
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
  const recheck = `Hi Adam! Could you re-ask Gemini for ${asked} next month and text me whether ${sent.name} shows up?`;

  return (
    <div className={`w-full overflow-hidden rounded-[32px] border border-ink/15 bg-cream/95 text-ink shadow-[0_30px_70px_-25px_rgba(30,43,35,0.2)] ${compact ? "p-5 sm:p-6" : "p-6 sm:p-12"}`}>
      {ai === null && (
        <form onSubmit={ask}>
          <h3 className={`font-display font-[420] leading-[0.95] text-ink ${compact ? "text-4xl" : "h-section"}`}>Can AI find you?</h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
            Customers ask Google's AI who to call. Type your business and see whether it names you.
          </p>

          <div className={`mt-8 grid gap-4 ${compact ? "" : "sm:grid-cols-3"}`}>
            <label className="block" htmlFor={`${id}-name`}>
              <span className={labelClass}>Your business</span>
              <input id={`${id}-name`} type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Olsen Roofing" className={inputClass} />
            </label>
            <label className="block" htmlFor={`${id}-trade`}>
              <span className={labelClass}>What you do</span>
              <input id={`${id}-trade`} type="text" required value={trade} onChange={(e) => setTrade(e.target.value)} placeholder="e.g. roofer, dentist" className={inputClass} />
            </label>
            <label className="block" htmlFor={`${id}-city`}>
              <span className={labelClass}>Your town</span>
              <input id={`${id}-city`} type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Clovis, CA" className={inputClass} />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-persimmon-deep py-5 font-display text-xl font-medium text-cream shadow-md transition hover:bg-ink hover:shadow-lg"
          >
            Ask Google's AI
          </button>
          <p className="mt-3 text-center text-sm text-ink-soft">Free. Takes a few seconds.</p>
        </form>
      )}

      <div aria-live="polite">
        {ai === "asking" && (
          <div className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-[260px]" : "min-h-[380px]"}`}>
            <div className="flex gap-2.5" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-4 w-4 animate-pulse rounded-full bg-persimmon" style={{ animationDuration: "1.2s", animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
            <p className={`mt-7 ${smallLabel}`}>Asking Google's AI…</p>
            <p className={`font-display mt-3 max-w-2xl leading-tight text-ink ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              “I need {asked}. Who do you recommend?”
            </p>
          </div>
        )}

        {answer && (
          <div ref={resultRef} tabIndex={-1} className="text-center outline-none">
            <p className={smallLabel}>We asked Google's AI</p>
            <p className="mt-2 text-base text-ink/75 sm:text-lg">“{answer.question}”</p>

            <p
              className={`font-display mt-6 font-[420] leading-[0.9] ${compact ? "text-5xl" : "text-[clamp(3.25rem,10vw,6.5rem)]"} ${named ? "text-leaf" : missing ? "text-persimmon" : "text-ink"}`}
              style={rise(0)}
            >
              {named ? "Yes. It found you." : missing ? "No. It doesn't." : "Here's who it picks."}
            </p>

            <p className={`mt-10 ${smallLabel}`}>{missing ? "It sends your customers to" : "Gemini recommends"}</p>
            <ol className="mx-auto mt-4 max-w-lg space-y-3 text-left">
              {shown.map((p, i) => (
                <li
                  key={p.uri}
                  style={rise(350 + i * 150)}
                  className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 ${p.title === named ? "border-leaf bg-leaf/10" : "border-ink/10 bg-paper"}`}
                >
                  <span className="font-mono text-sm text-ink-soft">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    {/* The ::after stretches the link over the whole card, so the tap target is the card. */}
                    <a href={p.uri} target="_blank" rel="noopener noreferrer" className={`font-display block leading-tight text-ink after:absolute after:inset-0 after:rounded-2xl hover:text-persimmon-deep ${compact ? "text-xl" : "text-2xl sm:text-3xl"}`}>
                      {p.title}
                    </a>
                    <span translate="no" style={MAPS_CREDIT}>
                      Google Maps
                    </span>
                  </span>
                  {p.title === named && <span className="rounded-full bg-leaf px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-cream">You</span>}
                </li>
              ))}
            </ol>

            <div className="mx-auto mt-10 max-w-lg" style={rise(350 + shown.length * 150)}>
              <a
                href={sms(text)}
                className="flex items-center justify-center gap-2 rounded-full bg-persimmon-deep px-6 py-5 font-display text-xl font-medium text-cream shadow-md transition hover:bg-ink hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                </svg>
                {named ? "Ask me if your site's ready for them" : "Ask me why AI picks them"}
              </a>
              <p className="mt-3 text-sm text-ink-soft">
                Opens a text to my cell, already written{" "}· <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
              </p>
              <a href={mailLink(`Google AI check: ${sent.name}`, text)} className="inline-flex min-h-12 items-center px-2 text-[13px] underline decoration-ink/30 underline-offset-4 hover:text-persimmon-deep">
                On a computer? Email it instead
              </a>
              {!named && (
                <a href={sms(recheck)} className="inline-flex min-h-12 items-center px-2 text-[13px] underline decoration-persimmon decoration-2 underline-offset-4 hover:text-persimmon-deep">
                  Not ready? Ask me to re-check next month
                </a>
              )}
            </div>

            {/* Google's terms: the generated answer, then every Maps source right after it (collapsing is allowed). */}
            <details className="mx-auto mt-6 max-w-lg text-left">
              <summary className="cursor-pointer py-4 font-mono text-[11px] text-ink-soft hover:text-ink">
                What Gemini said, with sources from{" "}
                <span translate="no" style={MAPS_CREDIT}>
                  Google Maps
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/85">{answer.answer}</p>
              <ul className="mt-3 space-y-1.5 border-t border-ink/10 pt-3 text-[13px]">
                {answer.sources.map((s) => (
                  <li key={s.uri}>
                    <a href={s.uri} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/30 underline-offset-2 hover:text-persimmon-deep">
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
              One question, asked just now. Google's AI Mode, the Gemini app and other AI apps can answer differently, and answers change.
            </p>
            <button type="button" onClick={() => setAi(null)} className="mt-1 min-h-12 px-2 text-[13px] underline decoration-ink/30 underline-offset-4 hover:text-persimmon-deep">
              Try another business
            </button>
          </div>
        )}

        {(ai === "failed" || ai === "limit") && (
          <div ref={resultRef} tabIndex={-1} className={`flex flex-col items-center justify-center text-center outline-none ${compact ? "min-h-[220px]" : "min-h-[300px]"}`}>
            <p className={`font-display leading-tight ${compact ? "text-3xl" : "text-4xl sm:text-5xl"}`}>
              {ai === "limit" ? "That's 10 checks this hour." : "Google's AI didn't answer this time."}
            </p>
            <p className="mt-3 text-ink/70">{ai === "limit" ? "Text me and I'll look it up for you." : "Give it another try in a minute."}</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
              <button type="button" onClick={() => setAi(null)} className="rounded-full bg-persimmon-deep px-6 py-3.5 font-medium text-cream transition hover:bg-ink">
                Try again
              </button>
              <a href={sms(`Hi Adam! Can you check whether Google's AI recommends ${sent.name} for ${asked}?`)} className="inline-flex min-h-12 items-center px-2 text-[15px] underline decoration-persimmon decoration-2 underline-offset-4 hover:text-persimmon-deep">
                Or text me
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

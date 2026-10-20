import { useEffect, useMemo, useRef, useState } from "react";
import { EMAIL, mailTo, PHONE_DISPLAY, PHONE_TEL, smsTo } from "../lib/data";
import { SunMark } from "./Chrome";
import { useGlobalReveal } from "../lib/hooks";

const needs = ["Custom Website", "Search & AI Marketing", "Website + Marketing", "Free Visibility Audit"];
const whens = ["ASAP", "This month", "Just looking"];

const planToNeed: Record<string, string> = {
  "custom website build": needs[0],
  starter: needs[0],
  growth: needs[0],
  flagship: needs[2],
  "search & ai visibility setup": needs[1],
  "ongoing search & ai growth": needs[2],
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2.5 text-[14.5px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persimmon focus-visible:ring-offset-2 ${
        active ? "scale-[1.03] border-ink bg-ink text-cream" : "border-ink/20 bg-cream/70 hover:border-ink/50 hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}

export function Contact() {
  useGlobalReveal();
  const [name, setName] = useState("");
  const [reach, setReach] = useState("");
  const [trade, setTrade] = useState("");
  const [need, setNeed] = useState(needs[0]);
  const [when, setWhen] = useState(whens[0]);
  const [copied, setCopied] = useState(false);
  const [needReach, setNeedReach] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "fallback">("idle");
  const [isTouch, setIsTouch] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const reachInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    };
    checkTouch();
    const mq = window.matchMedia("(pointer: coarse)");
    mq.addEventListener?.("change", checkTouch);
    return () => mq.removeEventListener?.("change", checkTouch);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qPlan = params.get("plan")?.toLowerCase().trim() || "";
    const qTrade = params.get("trade")?.trim() || "";
    if (qPlan && planToNeed[qPlan]) setNeed(planToNeed[qPlan]);
    if (qTrade) setTrade((prev) => prev || qTrade);

    const onSelectPlan = (e: Event) => {
      const planName = String((e as CustomEvent).detail || "").toLowerCase();
      if (planToNeed[planName]) setNeed(planToNeed[planName]);
      setTimeout(() => nameInputRef.current?.focus({ preventScroll: true }), 350);
    };
    window.addEventListener("cwd:select-plan", onSelectPlan);
    return () => window.removeEventListener("cwd:select-plan", onSelectPlan);
  }, []);

  const message = useMemo(() => {
    const who = name.trim() ? `Hi, Adam! It's ${name.trim()}` : "Hi, Adam!";
    const what = trade.trim() ? ` — I run ${trade.trim()}` : "";
    const n = `I'm interested in ${need}`;
    const w = when === "ASAP" ? "hoping to get going ASAP" : when === "This month" ? "looking to start this month" : "exploring options right now";
    const how = reach.trim() ? ` Reach me at ${reach.trim()}.` : "";
    return `${who}${what ? what + "." : ""} ${n}, ${w}.${how} Can we talk?`;
  }, [name, trade, need, when, reach]);

  const smsHref = smsTo(message);
  const emailHref = mailTo(`Project inquiry: ${trade.trim() || name.trim() || need}`, message);

  function triggerFallback() {
    setStatus("fallback");
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message).then(() => setCopied(true)).catch(() => {});
    }
    window.location.href = emailHref;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (status === "submitting") return;

    if (isTouch) {
      window.location.href = smsHref;
      return;
    }

    if (!reach.trim()) {
      setNeedReach(true);
      reachInputRef.current?.focus();
      return;
    }

    setNeedReach(false);
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          trade: trade.trim(),
          reach: reach.trim(),
          need,
          when,
          message,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        triggerFallback();
      }
    } catch {
      triggerFallback();
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden rounded-b-[40px] px-5 py-14 md:rounded-b-[72px] md:px-8 md:py-20">
      <div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-persimmon/[0.04] to-paper" 
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit}
        {...({
          toolname: "contact_adam",
          tooldescription: "Send a project inquiry to Adam at Clovis Web Design for custom web design, Google Maps SEO, or AI search optimization.",
        } as Record<string, string>)}
        className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <h2 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-[420] leading-[0.9]">
            <span className="line-mask"><span>Start with</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">a text.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            No 20-page questionnaires, no sales pressure, and no deposit to see a website preview. Pick what you need below and I'll draft the first message for you.
          </p>

          <div className="reveal mt-10 space-y-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block" htmlFor="contact-name">
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">Your name</span>
                <input
                  id="contact-name"
                  name="name"
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah"
                  autoComplete="name"
                  className="mt-2 w-full border-b-2 border-ink/25 bg-transparent py-2 font-display text-2xl outline-none transition placeholder:text-ink-soft/70 focus:border-persimmon"
                />
              </label>
              <label className="block" htmlFor="contact-trade">
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">What you do</span>
                <input
                  id="contact-trade"
                  name="trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  placeholder="a law firm, medspa, shop, or clinic"
                  className="mt-2 w-full border-b-2 border-ink/25 bg-transparent py-2 font-display text-2xl outline-none transition placeholder:text-ink-soft/70 focus:border-persimmon"
                />
              </label>
              <label className="block sm:col-span-2" htmlFor="contact-reach">
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">Your phone or email</span>
                <input
                  id="contact-reach"
                  name="reach"
                  ref={reachInputRef}
                  value={reach}
                  onChange={(e) => {
                    setReach(e.target.value);
                    if (needReach && e.target.value.trim()) setNeedReach(false);
                  }}
                  placeholder="(559) 555-0123 or sarah@example.com"
                  autoComplete="email tel"
                  aria-invalid={needReach ? "true" : undefined}
                  aria-describedby={needReach ? "contact-reach-hint" : undefined}
                  className={`mt-2 w-full border-b-2 bg-transparent py-2 font-display text-2xl outline-none transition placeholder:text-ink-soft/70 focus:border-persimmon ${
                    needReach ? "border-persimmon" : "border-ink/25"
                  }`}
                />
                {needReach && (
                  <span id="contact-reach-hint" role="alert" className="mt-1.5 block text-sm font-medium text-persimmon-deep">
                    Add your phone or email above so I know where to reply — or click email below.
                  </span>
                )}
              </label>
            </div>
            <div>
              <div id="contact-needs-label" className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">What you need</div>
              <input type="hidden" name="need" value={need} />
              <div role="group" aria-labelledby="contact-needs-label" className="mt-3 flex flex-wrap gap-2">
                {needs.map((n) => (
                  <Chip key={n} active={need === n} onClick={() => setNeed(n)}>
                    {n}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div id="contact-whens-label" className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">When</div>
              <input type="hidden" name="when" value={when} />
              <div role="group" aria-labelledby="contact-whens-label" className="mt-3 flex flex-wrap gap-2">
                {whens.map((w) => (
                  <Chip key={w} active={when === w} onClick={() => setWhen(w)}>
                    {w}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="reveal mx-auto w-full max-w-[360px] rotate-[2deg] transition-transform duration-700 hover:rotate-0">
            <div className="rounded-[48px] bg-ink p-3 shadow-[0_60px_100px_-40px_rgba(30,43,35,.6)]">
              <div className="overflow-hidden rounded-[38px] bg-[#fbf8f2]">
                <div className="flex flex-col items-center border-b border-ink/10 bg-cream/80 px-4 pb-3 pt-8">
                  <SunMark className="h-12 w-12" />
                  <div className="mt-1 text-[13px] font-semibold">Adam · Clovis Web Design</div>
                  <div className="font-mono text-[11px] text-ink-soft">{PHONE_DISPLAY}</div>
                </div>
                <div className="flex min-h-[260px] flex-col justify-end gap-2 px-4 py-5">
                  <div
                    key={message}
                    className="max-w-[90%] self-end rounded-3xl rounded-br-md bg-persimmon-deep px-4 py-3 text-[14px] leading-snug text-cream shadow-md"
                    style={{ animation: "pop .35s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    {message}
                  </div>
                  <div className="self-end font-mono text-[11px] text-ink-soft">Preview · ready to send</div>
                </div>
                <div className="flex items-center gap-2 border-t border-ink/10 px-3 py-3">
                  <div className="flex-1 truncate rounded-full border border-ink/15 px-4 py-2 text-[13px] text-ink-soft">iMessage</div>
                  {isTouch ? (
                    <a href={smsHref} className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon-deep text-cream transition hover:scale-110" aria-label="Send text">
                      ↑
                    </a>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon-deep text-cream transition hover:scale-110 disabled:opacity-70"
                      aria-label="Send message"
                    >
                      ↑
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-3">
            {status === "success" ? (
              <div className="w-full max-w-[360px] rounded-3xl border border-leaf/30 bg-leaf/10 p-5 text-center">
                <div className="font-display text-lg font-medium text-ink">Message sent!</div>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  I received your note and will get back to you shortly. You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold underline decoration-persimmon underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : status === "fallback" ? (
              <div className="w-full max-w-[360px] rounded-3xl border border-persimmon/30 bg-persimmon/10 p-5 text-center">
                <div className="font-display text-lg font-medium text-ink">Opening email draft...</div>
                <p className="mt-1 text-sm text-ink/80 leading-relaxed">
                  {copied ? "Your message has been copied to your clipboard." : "Your email app is opening with your message drafted."} You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold underline decoration-persimmon underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : isTouch ? (
              <a href={smsHref} data-magnetic="0.2" className="flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-ink py-4 text-lg text-cream transition-colors hover:bg-persimmon-deep">
                Send this text →
              </a>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                data-magnetic="0.2"
                className="flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-ink py-4 text-lg text-cream transition-colors hover:bg-persimmon-deep disabled:opacity-70"
              >
                {status === "submitting" ? "Sending..." : "Send this message →"}
              </button>
            )}
            <p className="text-center text-[15px] text-ink-soft">
              or{" "}
              <a href={`tel:${PHONE_TEL}`} className="inline-flex min-h-12 items-center text-ink underline decoration-persimmon decoration-2 underline-offset-4">
                call {PHONE_DISPLAY}
              </a>{" "}
              <span aria-hidden="true">·{" "}</span>
              <a href={emailHref} className="inline-flex min-h-12 items-center text-ink underline decoration-persimmon decoration-2 underline-offset-4">
                email {EMAIL}
              </a>{" "}
              <span aria-hidden="true">·{" "}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(message).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }).catch(() => {});
                }}
                className="inline-flex min-h-12 items-center text-ink underline decoration-persimmon decoration-2 underline-offset-4"
              >
                {copied ? "copied!" : "copy message"}
              </button>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}

const footerTitle = "font-display wonk text-lg normal-case italic tracking-normal text-ink";

export function Footer() {
  return (
    <footer className="relative z-0 -mt-[40px] overflow-hidden bg-gradient-to-b from-citrus to-persimmon/85 px-5 pb-28 pt-[120px] text-ink sm:pb-8 md:-mt-[72px] md:px-8 md:pt-[160px]">
      <div data-footer-inner className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-display wonk max-w-md text-3xl italic leading-tight">Custom websites, search &amp; AI marketing that bring in customers.</p>
          </div>
          <div className="font-mono text-[12px] uppercase leading-7 tracking-[.14em]">
            <div className={footerTitle}>Services</div>
            <a href="/#who" className="block hover:underline">All 4 Services</a>
            <a href="/services/local-seo-fresno/" className="block hover:underline">Search, Maps &amp; AI</a>
            <a href="/services/medical-web-design/" className="block hover:underline">Medical Web Design</a>
            <a href="/services/contractor-websites/" className="block hover:underline">Contractor Sites</a>
          </div>
          <div className="font-mono text-[12px] uppercase leading-7 tracking-[.14em]">
            <div className={footerTitle}>Explore</div>
            <a href="/#check" className="block hover:underline">Can AI Find You?</a>
            <a href="/#work" className="block hover:underline">Client Results</a>
            <a href="/#process" className="block hover:underline">Process</a>
            <a href="/#pricing" className="block hover:underline">How We Work</a>
          </div>
          <div className="font-mono text-[12px] uppercase leading-7 tracking-[.14em]">
            <div className={footerTitle}>Reach</div>
            <a href={smsTo("Hi Adam, I'm visiting your website and have a question.")} className="block hover:underline">Text {PHONE_DISPLAY}</a>
            <a href={`tel:${PHONE_TEL}`} className="block hover:underline">Call {PHONE_DISPLAY}</a>
            <a href={mailTo("Website & marketing question")} className="block normal-case tracking-normal [overflow-wrap:anywhere] hover:underline">{EMAIL}</a>
            <span className="block">Clovis, California</span>
            <span className="block">Serving CA &amp; the US</span>
          </div>
        </div>
        <div className="font-display wonk mt-16 select-none text-center text-[clamp(3.5rem,15.5vw,15rem)] font-[450] italic leading-[0.8] tracking-[-0.04em]">
          Clovis<span className="not-italic">·</span>web
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink/20 pt-6 font-mono text-[11px] uppercase tracking-[.14em] md:flex-row">
          <span>© {new Date().getFullYear()} Clovis Web Design</span>
          <span>Built in Clovis, CA · Serving Fresno, the Central Valley &amp; the US</span>
          <a href="#top" className="hover:underline">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

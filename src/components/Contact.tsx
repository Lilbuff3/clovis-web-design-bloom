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
      className={`rounded-[8px] border px-4 py-2.5 font-sans text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D1C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] ${
        active
          ? "border-white bg-white text-[#070707]"
          : "border-white/15 bg-[#1E1E1E] text-white/85 hover:border-white/40 hover:text-white"
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
  const [customChannels, setCustomChannels] = useState<string[]>([]);
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
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === "object" && "plan" in detail) {
        const planName = String(detail.plan || "").toLowerCase();
        if (planToNeed[planName]) setNeed(planToNeed[planName]);
        if (Array.isArray(detail.channels)) {
          setCustomChannels(detail.channels.map(String));
        }
      } else {
        const planName = String(detail || "").toLowerCase();
        if (planToNeed[planName]) setNeed(planToNeed[planName]);
      }
      setTimeout(() => nameInputRef.current?.focus({ preventScroll: true }), 350);
    };
    window.addEventListener("cwd:select-plan", onSelectPlan);
    return () => window.removeEventListener("cwd:select-plan", onSelectPlan);
  }, []);

  const message = useMemo(() => {
    const who = name.trim() ? `Hi, Adam! It's ${name.trim()}` : "Hi, Adam!";
    const what = trade.trim() ? ` — I run ${trade.trim()}` : "";
    const channelNote =
      customChannels.length > 0 ? ` (${customChannels.slice(0, 3).join(", ")}${customChannels.length > 3 ? ` +${customChannels.length - 3} more` : ""})` : "";
    const n = `I'm interested in ${need}${channelNote}`;
    const w = when === "ASAP" ? "hoping to get going ASAP" : when === "This month" ? "looking to start this month" : "exploring options right now";
    const how = reach.trim() ? ` Reach me at ${reach.trim()}.` : "";
    return `${who}${what ? what + "." : ""} ${n}, ${w}.${how} Can we talk?`;
  }, [name, trade, need, when, reach, customChannels]);

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

  const fieldInputClass =
    "mt-2 w-full rounded-[8px] border border-white/15 bg-[#151515] px-4 py-3 font-sans text-lg text-white outline-none transition placeholder:text-white/40 focus:border-[#FF4D1C]";

  return (
    <section id="contact" className="relative overflow-hidden bg-[#151515] px-5 py-16 text-white md:px-8 md:py-24">
      <form
        onSubmit={handleSubmit}
        {...({
          toolname: "contact_adam",
          tooldescription: "Send a project inquiry to Adam at Clovis Web Design for custom web design, Google Maps SEO, or AI search optimization.",
        } as Record<string, string>)}
        className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-12 lg:items-center lg:gap-14"
      >
        <div className="lg:col-span-7">
          <h2 className="font-sans text-[clamp(2.75rem,7vw,5.75rem)] font-bold leading-[0.94] tracking-[-0.04em] text-white">
            <span className="line-mask"><span>Start with</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="font-display italic font-normal text-[#FF4D1C]">a text.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            No 20-page questionnaires, no sales pressure, and no deposit to see a website preview. Pick what you need below and I'll draft the first message for you.
          </p>

          <div className="reveal mt-8 space-y-6 rounded-[16px] border border-white/12 bg-[#1E1E1E] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block" htmlFor="contact-name">
                <span className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">Your name</span>
                <input
                  id="contact-name"
                  name="name"
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah"
                  autoComplete="name"
                  className={fieldInputClass}
                />
              </label>
              <label className="block" htmlFor="contact-trade">
                <span className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">What you do</span>
                <input
                  id="contact-trade"
                  name="trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  placeholder="a law firm, medspa, shop, or clinic"
                  className={fieldInputClass}
                />
              </label>
              <label className="block sm:col-span-2" htmlFor="contact-reach">
                <span className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">Your phone or email</span>
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
                  autoComplete="email"
                  aria-invalid={needReach ? "true" : undefined}
                  aria-describedby={needReach ? "contact-reach-hint" : undefined}
                  className={`mt-2 w-full rounded-[8px] border bg-[#151515] px-4 py-3 font-sans text-lg text-white outline-none transition placeholder:text-white/40 focus:border-[#FF4D1C] ${
                    needReach ? "border-[#FF4D1C]" : "border-white/15"
                  }`}
                />
                {needReach && (
                  <span id="contact-reach-hint" role="alert" className="mt-1.5 block text-sm font-medium text-[#FF4D1C]">
                    Add your phone or email above so I know where to reply — or click email below.
                  </span>
                )}
              </label>
            </div>
            <div>
              <div id="contact-needs-label" className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">What you need</div>
              <input type="hidden" name="need" value={need} />
              <div role="group" aria-labelledby="contact-needs-label" className="mt-2.5 flex flex-wrap gap-2">
                {needs.map((n) => (
                  <Chip key={n} active={need === n} onClick={() => setNeed(n)}>
                    {n}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div id="contact-whens-label" className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">When</div>
              <input type="hidden" name="when" value={when} />
              <div role="group" aria-labelledby="contact-whens-label" className="mt-2.5 flex flex-wrap gap-2">
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
          <div className="reveal mx-auto w-full max-w-[380px]">
            <div className="overflow-hidden rounded-[16px] border border-white/15 bg-[#1E1E1E] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/12 bg-[#151515] px-5 py-4">
                <SunMark className="h-9 w-9 shrink-0" />
                <div>
                  <div className="font-sans text-sm font-bold text-white">Adam · Clovis Web Design</div>
                  <div className="font-mono text-[11px] text-[#00FF08]">{PHONE_DISPLAY} · Direct Line</div>
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col justify-end gap-2 bg-[#1E1E1E] px-5 py-6">
                <div
                  key={message}
                  className="max-w-[92%] self-end rounded-[12px] rounded-br-[4px] bg-white px-4 py-3.5 text-[14.5px] font-medium leading-snug text-[#070707] shadow-md"
                  style={{ animation: "pop .35s cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  {message}
                </div>
                <div className="self-end font-mono text-[11px] text-white/60">Preview · ready to send</div>
              </div>
              <div className="flex items-center gap-2 border-t border-white/12 bg-[#151515] px-4 py-3">
                <div className="flex-1 truncate rounded-[8px] border border-white/15 bg-[#1E1E1E] px-3.5 py-2 text-[13px] text-white/70">
                  iMessage / Direct Text
                </div>
                {isTouch ? (
                  <a
                    href={smsHref}
                    className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#FF4D1C] font-bold text-white transition hover:bg-white hover:text-[#070707]"
                    aria-label="Send text"
                  >
                    ↑
                  </a>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#FF4D1C] font-bold text-white transition hover:bg-white hover:text-[#070707] disabled:opacity-70"
                    aria-label="Send message"
                  >
                    ↑
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            {status === "success" ? (
              <div className="w-full max-w-[380px] rounded-[16px] border border-[#00FF08]/40 bg-[#1E1E1E] p-5 text-center">
                <div className="font-sans text-lg font-bold text-[#00FF08]">Message sent!</div>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  I received your note and will get back to you shortly. You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold text-white underline decoration-[#FF4D1C] underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : status === "fallback" ? (
              <div className="w-full max-w-[380px] rounded-[16px] border border-[#FF4D1C]/40 bg-[#1E1E1E] p-5 text-center">
                <div className="font-sans text-lg font-bold text-white">Opening email draft...</div>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  {copied ? "Your message has been copied to your clipboard." : "Your email app is opening with your message drafted."} You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold text-white underline decoration-[#FF4D1C] underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : isTouch ? (
              <a
                href={smsHref}
                data-magnetic="0.2"
                className="flex w-full max-w-[380px] items-center justify-center gap-2 rounded-[8px] bg-white py-4 font-sans text-base font-semibold text-[#070707] transition-colors hover:bg-[#FF4D1C] hover:text-white"
              >
                Send this text →
              </a>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                data-magnetic="0.2"
                className="flex w-full max-w-[380px] items-center justify-center gap-2 rounded-[8px] bg-white py-4 font-sans text-base font-semibold text-[#070707] transition-colors hover:bg-[#FF4D1C] hover:text-white disabled:opacity-70"
              >
                {status === "submitting" ? "Sending..." : "Send this message →"}
              </button>
            )}
            <p className="text-center text-[14px] text-white/75">
              or{" "}
              <a href={`tel:${PHONE_TEL}`} className="inline-flex min-h-12 items-center text-white underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]">
                call {PHONE_DISPLAY}
              </a>{" "}
              <span aria-hidden="true">·{" "}</span>
              <a href={emailHref} className="inline-flex min-h-12 items-center text-white underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]">
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
                className="inline-flex min-h-12 items-center text-white underline decoration-[#FF4D1C] decoration-2 underline-offset-4 hover:text-[#FF4D1C]"
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

const footerTitle = "font-mono text-xs font-semibold uppercase tracking-[.16em] text-white mb-3";

export function Footer() {
  return (
    <footer className="relative z-0 border-t border-white/12 bg-[#0D0D0D] px-5 pb-28 pt-16 text-white sm:pb-12 md:px-8 md:pt-20">
      <div data-footer-inner className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="font-sans text-xl font-bold tracking-[-0.03em] text-white">
              Clovis Web Design
            </div>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/75">
              Sub-second custom websites, Google Maps 3-Pack SEO, and AI search optimization engineered to bring in high-intent customers.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-[8px] border border-white/12 bg-[#1E1E1E] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#00FF08]">
              <span className="h-2 w-2 rounded-full bg-[#00FF08]" aria-hidden="true" />
              Direct Senior Engineering
            </div>
          </div>

          <div className="font-sans text-[14px] leading-8 text-white/80">
            <div className={footerTitle}>Services</div>
            <a href="/services/" className="block hover:text-white hover:underline">All 5 Services</a>
            <a href="/packages/" className="block hover:text-white hover:underline">Modular Packages</a>
            <a href="/services/local-seo-fresno/" className="block hover:text-white hover:underline">Search, Maps &amp; AI</a>
            <a href="/services/medical-web-design/" className="block hover:text-white hover:underline">Medical Web Design</a>
            <a href="/services/contractor-websites/" className="block hover:text-white hover:underline">Contractor Sites</a>
          </div>

          <div className="font-sans text-[14px] leading-8 text-white/80">
            <div className={footerTitle}>Case Studies</div>
            <a href="/case-studies/kidney-specialist-fresno/" className="block hover:text-white hover:underline">Kidney Specialist Inc.</a>
            <a href="/case-studies/dumpster-rental-fresno/" className="block hover:text-white hover:underline">Big Bros Dumpster</a>
            <a href="/#work" className="block hover:text-white hover:underline">All Client Results</a>
            <a href="/#check" className="block hover:text-white hover:underline">Live AI Visibility Check</a>
          </div>

          <div className="font-sans text-[14px] leading-8 text-white/80">
            <div className={footerTitle}>Explore</div>
            <a href="/#who" className="block hover:text-white hover:underline">Capabilities</a>
            <a href="/#process" className="block hover:text-white hover:underline">4-Stage Process</a>
            <a href="/#pricing" className="block hover:text-white hover:underline">Package Builder</a>
            <a href="/#faq" className="block hover:text-white hover:underline">Common Questions</a>
          </div>

          <div className="font-sans text-[14px] leading-8 text-white/80">
            <div className={footerTitle}>Reach</div>
            <a href={smsTo("Hi Adam, I'm visiting your website and have a question.")} className="block hover:text-white hover:underline">Text {PHONE_DISPLAY}</a>
            <a href={`tel:${PHONE_TEL}`} className="block hover:text-white hover:underline">Call {PHONE_DISPLAY}</a>
            <a href={mailTo("Website & marketing question")} className="block [overflow-wrap:anywhere] hover:text-white hover:underline">{EMAIL}</a>
            <span className="block text-white/60">Clovis, California</span>
            <span className="block text-white/60">Serving CA &amp; the US</span>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/12 pt-6 font-mono text-[11px] uppercase tracking-[.14em] text-white/75 md:flex-row">
          <span>© {new Date().getFullYear()} Clovis Web Design</span>
          <span>Built in Clovis, CA · Serving Fresno, the Central Valley &amp; the US</span>
          <a href="#top" className="text-white hover:text-[#FF4D1C] hover:underline">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

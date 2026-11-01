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
      className={`rounded-full px-4 py-2 font-sans text-[13.5px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002FA7] ${
        active
          ? "bg-[#141311] text-white"
          : "bg-[#EAE6DF] text-[#141311] hover:bg-[#DFDBD2]"
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
    "mt-1 w-full rounded-xl border border-[#141311]/15 bg-white px-3.5 py-2.5 font-sans text-[15px] text-[#141311] outline-none transition placeholder:text-[#4A4742] focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/20";

  return (
    <section id="contact" className="relative overflow-hidden border-t border-[#141311]/12 bg-[#EAE6DF] px-5 py-10 text-[#141311] md:px-8 md:py-12">
      <form
        onSubmit={handleSubmit}
        {...({
          toolname: "contact_adam",
          tooldescription: "Send a project inquiry to Adam at Clovis Web Design for custom web design, Google Maps SEO, or AI search optimization.",
        } as Record<string, string>)}
        className="relative mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-12 lg:items-center"
      >
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#141311]">
              Start with a text.
            </h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[#4A4742]">
              No 20-page questionnaires and no deposit to see a website preview. Pick what you need below.
            </p>
          </div>

          <div className="mt-5 space-y-4 rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] p-5 shadow-[0_24px_60px_-24px_rgba(20,19,17,0.08)] sm:p-6">
            <div className="grid gap-3.5 sm:grid-cols-3">
              <label className="block" htmlFor="contact-name">
                <span className="font-sans text-[12px] font-semibold text-[#4A4742]">Your name</span>
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
                <span className="font-sans text-[12px] font-semibold text-[#4A4742]">What you do</span>
                <input
                  id="contact-trade"
                  name="trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  placeholder="law firm, medspa, contractor"
                  className={fieldInputClass}
                />
              </label>
              <label className="block" htmlFor="contact-reach">
                <span className="font-sans text-[12px] font-semibold text-[#4A4742]">Phone or email</span>
                <input
                  id="contact-reach"
                  name="reach"
                  ref={reachInputRef}
                  value={reach}
                  onChange={(e) => {
                    setReach(e.target.value);
                    if (needReach && e.target.value.trim()) setNeedReach(false);
                  }}
                  placeholder="(559) 555-0123"
                  autoComplete="email"
                  aria-invalid={needReach ? "true" : undefined}
                  aria-describedby={needReach ? "contact-reach-hint" : undefined}
                  className={`mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 font-sans text-[15px] text-[#141311] outline-none transition placeholder:text-[#4A4742] focus:border-[#002FA7] ${
                    needReach ? "border-[#C83E14]" : "border-[#141311]/15"
                  }`}
                />
                {needReach && (
                  <span id="contact-reach-hint" role="alert" className="mt-1 block text-xs font-semibold text-[#C83E14]">
                    Add your phone or email above so I know where to reply — or click email below.
                  </span>
                )}
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-12">
              <div className="sm:col-span-7">
                <div id="contact-needs-label" className="font-sans text-[12px] font-semibold text-[#4A4742]">What you need</div>
                <input type="hidden" name="need" value={need} />
                <div role="group" aria-labelledby="contact-needs-label" className="mt-2 flex flex-wrap gap-1.5">
                  {needs.map((n) => (
                    <Chip key={n} active={need === n} onClick={() => setNeed(n)}>
                      {n}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-5">
                <div id="contact-whens-label" className="font-sans text-[12px] font-semibold text-[#4A4742]">When</div>
                <input type="hidden" name="when" value={when} />
                <div role="group" aria-labelledby="contact-whens-label" className="mt-2 flex flex-wrap gap-1.5">
                  {whens.map((w) => (
                    <Chip key={w} active={when === w} onClick={() => setWhen(w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mx-auto w-full max-w-[390px]">
            <div className="overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] shadow-[0_24px_60px_-24px_rgba(20,19,17,0.12)]">
              <div className="flex items-center gap-3 border-b border-[#141311]/10 bg-[#EAE6DF]/70 px-4 py-3">
                <SunMark className="h-7 w-7 shrink-0" />
                <div>
                  <div className="font-sans text-sm font-semibold text-[#141311]">Adam · Clovis Web Design</div>
                  <div className="font-mono text-[11px] font-medium text-[#0B6E3F]">{PHONE_DISPLAY} · Direct Line</div>
                </div>
              </div>
              <div className="flex min-h-[140px] flex-col justify-end gap-1.5 bg-white px-4 py-4">
                <div
                  key={message}
                  className="max-w-[94%] self-end rounded-2xl rounded-br-sm bg-[#002FA7] px-4 py-3 text-[13.5px] font-medium leading-snug text-white"
                  style={{ animation: "pop .35s cubic-bezier(0.16, 1, 0.3, 1)" }}
                >
                  {message}
                </div>
                <div className="self-end text-[11.5px] text-[#4A4742]">Preview · ready to send</div>
              </div>
              <div className="flex items-center gap-2 border-t border-[#141311]/10 bg-[#EAE6DF]/60 px-4 py-2.5">
                <div className="flex-1 truncate rounded-full bg-[#F6F4EF] px-3.5 py-1.5 text-[12px] text-[#4A4742]">
                  iMessage / Direct Text
                </div>
                {isTouch ? (
                  <a
                    href={smsHref}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002FA7] font-bold text-white transition hover:bg-[#141311]"
                    aria-label="Send text"
                  >
                    ↑
                  </a>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002FA7] font-bold text-white transition hover:bg-[#141311] disabled:opacity-70"
                    aria-label="Send message"
                  >
                    ↑
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-col items-center gap-1.5">
            {status === "success" ? (
              <div className="w-full max-w-[390px] rounded-2xl border border-[#0B6E3F] bg-[#F6F4EF] p-4 text-center">
                <div className="font-sans text-base font-semibold text-[#0B6E3F]">Message sent!</div>
                <p className="mt-1 text-xs leading-relaxed text-[#4A4742]">
                  I received your note and will get back to you shortly. You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold text-[#141311] underline decoration-[#C83E14] underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : status === "fallback" ? (
              <div className="w-full max-w-[390px] rounded-2xl border border-[#C83E14] bg-[#F6F4EF] p-4 text-center">
                <div className="font-sans text-base font-semibold text-[#141311]">Opening email draft...</div>
                <p className="mt-1 text-xs leading-relaxed text-[#4A4742]">
                  {copied ? "Your message has been copied to your clipboard." : "Your email app is opening with your message drafted."} You can also call or text me directly at{" "}
                  <a href={`tel:${PHONE_TEL}`} className="font-semibold text-[#141311] underline decoration-[#C83E14] underline-offset-2">
                    {PHONE_DISPLAY}
                  </a>.
                </p>
              </div>
            ) : isTouch ? (
              <a
                href={smsHref}
                data-magnetic="0.2"
                className="flex w-full max-w-[390px] items-center justify-center gap-2 rounded-full bg-[#002FA7] py-3 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-[#141311]"
              >
                Send this text →
              </a>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                data-magnetic="0.2"
                className="flex w-full max-w-[390px] items-center justify-center gap-2 rounded-full bg-[#002FA7] py-3 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-[#141311] disabled:opacity-70"
              >
                {status === "submitting" ? "Sending..." : "Send this message →"}
              </button>
            )}
            <p className="text-center text-[13px] text-[#4A4742]">
              or{" "}
              <a href={`tel:${PHONE_TEL}`} className="inline-flex min-h-9 items-center font-semibold text-[#141311] hover:text-[#002FA7] hover:underline">
                call {PHONE_DISPLAY}
              </a>{" "}
              <span aria-hidden="true">·{" "}</span>
              <a href={emailHref} className="inline-flex min-h-9 items-center font-semibold text-[#141311] hover:text-[#002FA7] hover:underline">
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
                className="inline-flex min-h-9 items-center font-semibold text-[#141311] hover:text-[#002FA7] hover:underline"
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

const footerTitle = "font-sans text-[12px] font-semibold text-[#141311] mb-2";

export function Footer() {
  return (
    <footer className="relative z-0 border-t border-[#141311]/12 bg-[#DFDBD2]/60 px-5 pb-20 pt-8 text-[#141311] sm:pb-8 md:px-8 md:pt-10">
      <div data-footer-inner className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <SunMark className="h-5 w-5" />
              <div className="font-sans text-lg font-semibold tracking-[-0.03em] text-[#141311]">
                Clovis Web Design
              </div>
            </div>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-[#4A4742]">
              Sub-second custom websites, Google Maps 3-Pack SEO, and AI search optimization engineered to bring in high-intent customers.
            </p>
          </div>

          <div className="font-sans text-[13px] leading-6 text-[#4A4742]">
            <div className={footerTitle}>Services</div>
            <a href="/services/" className="block hover:text-[#002FA7]">All 5 Services</a>
            <a href="/packages/" className="block hover:text-[#002FA7]">Modular Packages</a>
            <a href="/services/local-seo-fresno/" className="block hover:text-[#002FA7]">Search, Maps &amp; AI</a>
            <a href="/services/medical-web-design/" className="block hover:text-[#002FA7]">Medical Web Design</a>
            <a href="/services/contractor-websites/" className="block hover:text-[#002FA7]">Contractor Sites</a>
          </div>

          <div className="font-sans text-[13px] leading-6 text-[#4A4742]">
            <div className={footerTitle}>Case Studies</div>
            <a href="/case-studies/kidney-specialist-fresno/" className="block hover:text-[#002FA7]">Kidney Specialist Inc.</a>
            <a href="/case-studies/dumpster-rental-fresno/" className="block hover:text-[#002FA7]">Big Bros Dumpster</a>
            <a href="/#work" className="block hover:text-[#002FA7]">All Client Results</a>
            <a href="/#check" className="block hover:text-[#002FA7]">Live AI Visibility Check</a>
          </div>

          <div className="font-sans text-[13px] leading-6 text-[#4A4742]">
            <div className={footerTitle}>Explore</div>
            <a href="/#who" className="block hover:text-[#002FA7]">Capabilities</a>
            <a href="/#process" className="block hover:text-[#002FA7]">4-Stage Process</a>
            <a href="/#pricing" className="block hover:text-[#002FA7]">Package Builder</a>
            <a href="/#faq" className="block hover:text-[#002FA7]">Common Questions</a>
          </div>

          <div className="font-sans text-[13px] leading-6 text-[#4A4742]">
            <div className={footerTitle}>Reach</div>
            <a href={smsTo("Hi Adam, I'm visiting your website and have a question.")} className="block font-semibold text-[#141311] hover:text-[#002FA7]">Text {PHONE_DISPLAY}</a>
            <a href={`tel:${PHONE_TEL}`} className="block font-semibold text-[#141311] hover:text-[#002FA7]">Call {PHONE_DISPLAY}</a>
            <a href={mailTo("Website & marketing question")} className="block [overflow-wrap:anywhere] hover:text-[#002FA7]">{EMAIL}</a>
            <span className="block text-[#4A4742]">Clovis, CA · Serving the US</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#141311]/10 pt-5 text-[12px] text-[#4A4742] md:flex-row">
          <span>© {new Date().getFullYear()} Clovis Web Design</span>
          <span>Built in Clovis, CA · Serving Fresno, the Central Valley &amp; the US</span>
          <a href="#top" className="font-medium text-[#141311] hover:text-[#002FA7]">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

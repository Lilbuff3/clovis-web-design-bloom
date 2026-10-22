import { useEffect, useId, useRef, useState } from "react";
import { faqs, modularSteps, plans, smsTo } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

const customChannels = [
  {
    id: "seo-pages",
    title: "SEO & High-Intent Market Pages",
    tag: "Search & Maps",
    impact: "Dedicated service and city pages engineered to rank in the Google Maps 3-Pack and organic results without paying per click.",
  },
  {
    id: "ai-citation",
    title: "AI Answer & Citation Architecture",
    tag: "ChatGPT, Gemini, Claude & Siri",
    impact: "Four-directory profile alignment, connected JSON-LD schema, and fact-dense Q&A blocks built to win AI recommendations.",
  },
  {
    id: "paid-landing",
    title: "Paid Search & Conversion Landing Pages",
    tag: "High-ROI Ad Capture",
    impact: "Sub-second (<0.4s) campaign landing pages with instant tap-to-call and text routing that cut wasted ad spend.",
  },
  {
    id: "review-sms",
    title: "Automated Review & SMS Follow-Up",
    tag: "Retention & Velocity",
    impact: "Automated post-service review requests and instant missed-call text-back flows that compound local trust and repeat business.",
  },
  {
    id: "ga4-attribution",
    title: "Custom GA4 AI & Call Attribution",
    tag: "Real ROI Reporting",
    impact: "Custom Google Analytics 4 channels separating ChatGPT, Gemini, Perplexity, and Maps referrals from generic web traffic.",
  },
  {
    id: "bilingual-es",
    title: "Bilingual English / Español (/es/)",
    tag: "Full Market Coverage",
    impact: "Native human-written Spanish architecture with proper hreflang routing to capture bilingual buyers across California and the US.",
  },
];

export function Grower() {
  useGlobalReveal();
  const video = useRef<HTMLVideoElement>(null);
  // This island hydrates as the section scrolls into view, so the video only downloads then.
  // It plays once (about 3s, under WCAG's 5s limit for motion without a pause button) and holds on the
  // last frame. Visitors who ask for reduced motion keep the still.
  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <section id="grower" className="relative overflow-hidden bg-[#151515] px-5 py-16 text-white md:px-8 md:py-24">
      <span id="about" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="reveal relative lg:col-span-5">
          <div className="clip-reveal relative aspect-video overflow-hidden rounded-[16px] border border-white/12 bg-[#1E1E1E] shadow-2xl">
            <video
              ref={video}
              src="/images/studio-desk.mp4"
              poster="/images/studio-desk.webp"
              muted
              playsInline
              preload="none"
              aria-label="Animation: an empty desk fills up with code and website plans on two screens"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#070707]/40 via-transparent to-[#FF4D1C]/10" aria-hidden="true" />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-[16px] border border-white/12 bg-[#1E1E1E] px-5 py-4 text-white">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[.16em] text-white/70">Engineering Studio</div>
              <div className="mt-0.5 font-sans text-base font-semibold text-white">Clovis, California</div>
            </div>
            <div className="text-right font-mono text-[11px] leading-relaxed text-[#00FF08]">
              36.82° N / 119.70° W
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-[16px] border border-white/12 bg-[#1E1E1E] p-4">
              <div className="font-mono text-[11px] uppercase tracking-[.12em] text-white/70">Access</div>
              <div className="mt-1 font-sans text-lg font-bold text-white">1-on-1</div>
              <div className="mt-0.5 text-xs text-white/75">Zero account reps</div>
            </div>
            <div className="rounded-[16px] border border-white/12 bg-[#1E1E1E] p-4">
              <div className="font-mono text-[11px] uppercase tracking-[.12em] text-white/70">Mobile Load</div>
              <div className="mt-1 font-sans text-lg font-bold text-[#00FF08]">&lt;0.4s</div>
              <div className="mt-0.5 text-xs text-white/75">100/100 PageSpeed</div>
            </div>
            <div className="rounded-[16px] border border-white/12 bg-[#1E1E1E] p-4">
              <div className="font-mono text-[11px] uppercase tracking-[.12em] text-white/70">Ownership</div>
              <div className="mt-1 font-sans text-lg font-bold text-white">100%</div>
              <div className="mt-0.5 text-xs text-white/75">Code &amp; domain</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <h2 className="h-section font-sans font-bold tracking-[-0.035em] text-white">
            <span className="line-mask"><span>One senior engineer.</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>Start to finish.</span></span>
          </h2>
          <div className="reveal mt-8 max-w-2xl space-y-5 text-[17.5px] leading-relaxed text-white/85">
            <p>
              I'm <strong className="font-semibold text-white">Adam</strong>. Based in Clovis, California, I partner with growth-minded businesses across California and the US — and I engineer every layer myself from discovery to launch. You never get sold by a senior strategist only to be handed off to a junior account coordinator or template shop.
            </p>
            <p>
              From our first 15-minute call, I shape your positioning, write every word of buyer copy, hand-code static pages that open in under 0.4 seconds on mobile, align your business across Google Search, Google Maps, Bing, Apple Maps, and Yelp so AI assistants cite you, and wire your analytics so every call, text, and AI lead is attributed.
            </p>
            <div className="rounded-[16px] border border-white/12 bg-[#1E1E1E] p-5 text-[15.5px] text-white/85">
              <strong className="font-semibold text-white">Agencies and creative directors:</strong> I also provide white-label engineering from your Figma files in Astro, React, and TypeScript — shipped on deadline under your brand with 100/100 Core Web Vitals.
            </div>
          </div>
          <blockquote className="reveal font-display wonk relative mt-9 max-w-2xl border-l-2 border-[#FF4D1C] pl-6 text-[clamp(1.55rem,2.6vw,2.2rem)] italic leading-[1.2] text-white">
            “You don't rent your website from an agency. You own the code, the domain, and your marketing accounts from day one.”
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={smsTo("Hi Adam, I read about how you work and I'd like to talk to you directly about my business.")}
              data-magnetic
              className="inline-flex items-center gap-2 rounded-[8px] bg-white px-6 py-3.5 font-sans font-semibold text-[#070707] transition-colors hover:bg-[#FF4D1C] hover:text-white"
            >
              Text me directly →
            </a>
            <a
              href="/services/"
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-[#1E1E1E] px-5 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:border-white/50"
            >
              Explore all 5 services →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stand() {
  useGlobalReveal();
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0].name);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    customChannels[0].title,
    customChannels[1].title,
  ]);

  const toggleChannel = (title: string) => {
    setSelectedChannels((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const dispatchScope = (planName: string, channels: string[]) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cwd:select-plan", {
          detail: { plan: planName, channels },
        })
      );
    }
  };

  return (
    <section id="stand" className="relative overflow-hidden bg-white px-5 py-16 text-[#151515] md:px-8 md:py-24">
      <span id="pricing" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="h-section font-sans font-bold tracking-[-0.035em] text-[#151515]">
            <span className="line-mask"><span>Modular growth packages,</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>scoped around your ROI.</span></span>
          </h2>
          <p className="reveal mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Every engagement is scoped to your goals, your market competition, and the return it can generate. Choose your foundation below, toggle the channels you need right now, and scale month-to-month without agency lock-in.
          </p>
        </div>

        {/* Branded-style 3-Step Modular Architecture Overview */}
        <ol className="reveal mt-10 grid gap-4 md:grid-cols-3">
          {modularSteps.map((m) => (
            <li key={m.step} className="flex flex-col rounded-[16px] border border-[#151515]/12 bg-[#EDEDED] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-[6px] bg-[#151515] px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[.14em] text-white">
                  Step {m.step}
                </span>
                <span className="font-mono text-xs uppercase tracking-[.12em] text-ink-soft">Modular Architecture</span>
              </div>
              <h3 className="mt-4 font-sans text-xl font-bold tracking-[-0.02em] text-[#151515]">{m.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
            </li>
          ))}
        </ol>

        {/* STEP 01: Choose Your Foundation */}
        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#151515]/15 pb-4">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-[#FF4D1C]">Step 01 · Base Engagement</div>
              <h3 className="mt-1 font-sans text-2xl font-bold tracking-[-0.025em] text-[#151515] md:text-3xl">
                Choose Your Foundation
              </h3>
            </div>
            <p className="text-sm text-ink-soft">Click any foundation to select it in your live scope builder below.</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {plans.map((pl) => {
              const isSelected = selectedPlan === pl.name;
              return (
                <div key={pl.code} className="flex flex-col">
                  <div
                    onClick={() => setSelectedPlan(pl.name)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPlan(pl.name);
                      }
                    }}
                    className={`relative flex flex-1 cursor-pointer flex-col rounded-[16px] border p-7 transition-all duration-200 ${
                      isSelected
                        ? "border-[#151515] bg-[#151515] text-white shadow-xl"
                        : "border-[#151515]/15 bg-[#EDEDED] text-[#151515] hover:border-[#151515]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className={`font-mono text-[11px] uppercase tracking-[.14em] ${isSelected ? "text-white/75" : "text-ink-soft"}`}>
                        {pl.kind}
                      </div>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#00FF08]/15 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[.1em] text-[#00FF08]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF08]" aria-hidden="true" />
                          Selected Foundation
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-[6px] border border-[#151515]/20 bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.1em] text-[#151515]">
                          Select {pl.code}
                        </span>
                      )}
                    </div>

                    <div className={`mt-4 font-sans text-2xl font-bold tracking-[-0.025em] lg:text-3xl ${isSelected ? "text-white" : "text-[#151515]"}`}>
                      {pl.name}
                    </div>
                    <div className={`mt-3 font-display text-xl italic ${isSelected ? "text-[#00FF08]" : "text-[#151515]"}`}>
                      {pl.price}
                    </div>
                    <div className={`mt-1.5 font-mono text-[11px] uppercase tracking-[.12em] ${isSelected ? "text-white/70" : "text-ink-soft"}`}>
                      {pl.time} · {pl.terms}
                    </div>

                    <div className={`my-5 border-t ${isSelected ? "border-white/15" : "border-[#151515]/15"}`} />

                    <ul className="space-y-2.5 text-[14.5px] leading-snug">
                      {pl.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span className={`mt-[2px] font-bold ${isSelected ? "text-[#00FF08]" : "text-[#00A843]"}`}>✓</span>
                          <span className={isSelected ? "text-white/90" : "text-[#151515]"}>{it}</span>
                        </li>
                      ))}
                    </ul>

                    <p className={`mt-auto pt-6 text-[13.5px] leading-snug ${isSelected ? "text-white/75" : "text-ink-soft"}`}>
                      <span className={`font-semibold ${isSelected ? "text-white" : "text-[#151515]"}`}>Best for: </span>
                      {pl.for}
                    </p>

                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(pl.name);
                        dispatchScope(pl.name, selectedChannels);
                      }}
                      className={`mt-6 flex items-center justify-center gap-2 rounded-[8px] py-3.5 font-sans text-sm font-semibold transition ${
                        isSelected
                          ? "bg-white text-[#070707] hover:bg-[#FF4D1C] hover:text-white"
                          : "bg-[#151515] text-white hover:bg-[#FF4D1C]"
                      }`}
                    >
                      {pl.cta ?? `Ask about ${pl.name}`} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 02: Customize Your Channels */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#151515]/15 pb-4">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-[.14em] text-[#FF4D1C]">Step 02 · Modular Add-Ons</div>
              <h3 className="mt-1 font-sans text-2xl font-bold tracking-[-0.025em] text-[#151515] md:text-3xl">
                Customize Your Channels
              </h3>
            </div>
            <p className="text-sm text-ink-soft">Toggle the priority growth channels you want included in your custom scope.</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customChannels.map((ch) => {
              const active = selectedChannels.includes(ch.title);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => toggleChannel(ch.title)}
                  aria-pressed={active}
                  className={`flex flex-col justify-between rounded-[16px] border p-5 text-left transition-all ${
                    active
                      ? "border-[#151515] bg-[#151515] text-white shadow-md"
                      : "border-[#151515]/15 bg-[#EDEDED] text-[#151515] hover:border-[#151515]/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-mono text-[11px] uppercase tracking-[.12em] ${active ? "text-[#00FF08]" : "text-ink-soft"}`}>
                        {ch.tag}
                      </span>
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] font-mono text-xs font-bold ${
                          active ? "bg-[#00FF08] text-[#070707]" : "border border-[#151515]/25 bg-white text-[#151515]"
                        }`}
                      >
                        {active ? "✓" : "+"}
                      </span>
                    </div>
                    <div className={`mt-3 font-sans text-lg font-bold tracking-[-0.015em] ${active ? "text-white" : "text-[#151515]"}`}>
                      {ch.title}
                    </div>
                    <p className={`mt-2 text-[13.5px] leading-relaxed ${active ? "text-white/80" : "text-ink-soft"}`}>
                      {ch.impact}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 03: Scale As You Grow — Live Scope Summary Bar */}
        <div className="mt-12 rounded-[16px] border border-[#151515] bg-[#151515] p-7 text-white shadow-2xl md:p-9">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-[6px] bg-[#FF4D1C] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[.12em] text-white">
                  Step 03 · Scale As You Grow
                </span>
                <span className="font-mono text-xs uppercase tracking-[.12em] text-white/70">
                  Live Scope Configuration
                </span>
              </div>

              <div className="mt-4 font-sans text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                Foundation: <span className="text-[#00FF08]">{selectedPlan}</span>
              </div>

              <div className="mt-4">
                <div className="font-mono text-[11px] uppercase tracking-[.14em] text-white/70">
                  Active Custom Channels ({selectedChannels.length} selected):
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedChannels.length > 0 ? (
                    selectedChannels.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/15 bg-[#1E1E1E] px-3 py-1.5 text-xs font-medium text-white"
                      >
                        <span className="text-[#00FF08]">●</span> {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-white/70">
                      Core foundation deliverables selected — toggle any optional channels above to add them.
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-5 font-mono text-xs leading-relaxed text-white/75">
                Working phone preview before you pay a dollar · 100% code &amp; domain ownership · Zero lock-in
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
              <a
                href="#contact"
                onClick={() => dispatchScope(selectedPlan, selectedChannels)}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-4 text-center font-sans text-base font-semibold text-[#070707] transition hover:bg-[#FF4D1C] hover:text-white"
              >
                Lock in this scope &amp; start with a text →
              </a>
              <a
                href="/packages/"
                className="flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-white/20 bg-[#1E1E1E] px-5 py-3 text-center font-mono text-xs uppercase tracking-[.12em] text-white transition hover:border-white/50"
              >
                Compare full package deliverables →
              </a>
            </div>
          </div>
        </div>

        {/* Risk-Reversal & ROI Guarantee */}
        <div className="reveal mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#151515]/12 bg-[#EDEDED] p-7">
            <h3 className="font-sans text-xl font-bold tracking-[-0.02em] text-[#151515] md:text-2xl">
              See the website preview before you pay.
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">
              For website builds, we talk for 15 minutes and I build a working preview with your real copy that you can open on your phone. If you don't like how it looks and reads, walk away and owe nothing.
            </p>
          </div>
          <div className="rounded-[16px] border border-[#151515]/12 bg-[#EDEDED] p-7">
            <h3 className="font-sans text-xl font-bold tracking-[-0.02em] text-[#151515] md:text-2xl">
              Scoped to pay for itself.
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">
              Your scope is tied directly to what a new customer is worth to you and what it takes to win in your market. If I don't see a clear way for a new site or search campaign to earn back its cost, I'll tell you upfront on our first call.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  useGlobalReveal();
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" className="relative bg-white px-5 py-16 text-[#151515] md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="h-section font-sans font-bold tracking-[-0.035em] text-[#151515]">
              <span className="line-mask"><span>What people ask</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>before they text.</span></span>
            </h2>
            <p className="reveal mt-5 text-lg leading-relaxed text-ink-soft">
              Didn't see your question? Text it. You'll get a straight answer, even if it's “you don't need a new website yet.”
            </p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="divide-y divide-[#151515]/15 rounded-[16px] border border-[#151515]/15 bg-[#EDEDED]/50 px-6">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const btnId = `${id}-q${i}`;
              const panelId = `${id}-a${i}`;
              return (
                <div key={f.q}>
                  <button
                    id={btnId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className={`font-sans text-xl font-bold leading-snug tracking-[-0.015em] transition md:text-2xl ${isOpen ? "text-[#FF4D1C]" : "text-[#151515] group-hover:translate-x-1"}`}>
                      {f.q}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border text-xl font-bold transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-[#FF4D1C] bg-[#FF4D1C] text-white"
                          : "border-[#151515]/20 bg-white text-[#151515] group-hover:border-[#151515]"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {/* inert: a closed answer is only squashed to zero height, so without it screen readers still read it. */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    inert={!isOpen}
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-[16.5px] leading-relaxed text-ink-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const About = Grower;
export const Pricing = Stand;

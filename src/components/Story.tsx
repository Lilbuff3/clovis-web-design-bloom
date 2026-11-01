import { useEffect, useId, useRef, useState } from "react";
import { faqs, modularChannels, modularSteps, plans, smsTo } from "../lib/data";

export function Grower() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <section
      id="grower"
      className="relative flex flex-col justify-between overflow-hidden border-b border-[#141311]/12 p-6 text-[#141311] md:p-8 lg:col-span-6 lg:border-r lg:border-b-0"
    >
      <span id="about" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div>
        <h2 className="font-sans text-[clamp(1.65rem,2.6vw,2.3rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
          One senior engineer. Start to finish.
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-12 sm:items-center">
          <div className="sm:col-span-5">
            <div className="overflow-hidden rounded-xl border border-[#141311]/12 bg-[#F6F4EF] shadow-sm">
              <div className="clip-reveal relative aspect-video overflow-hidden">
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
              </div>
              <div className="grid grid-cols-3 divide-x divide-[#141311]/10 border-t border-[#141311]/10 text-center">
                <div className="p-2">
                  <div className="text-[11px] font-medium text-[#4A4742]">Access</div>
                  <div className="font-sans text-xs font-semibold text-[#141311]">1-on-1</div>
                </div>
                <div className="p-2">
                  <div className="text-[11px] font-medium text-[#4A4742]">Load</div>
                  <div className="font-sans text-xs font-semibold text-[#0B6E3F]">&lt;0.4s</div>
                </div>
                <div className="p-2">
                  <div className="text-[11px] font-medium text-[#4A4742]">Code</div>
                  <div className="font-sans text-xs font-semibold text-[#002FA7]">100% Yours</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-[14.5px] leading-relaxed text-[#141311] sm:col-span-7">
            <p>
              I'm <strong className="font-semibold text-[#002FA7]">Adam</strong>. Based in Clovis, California, I partner with growth-minded businesses across California and the US — engineering every layer myself from discovery to launch.
            </p>
            <p className="text-[#4A4742]">
              I shape your positioning, write buyer copy, hand-code &lt;0.4s static pages, align your business across Google Maps, Bing, Apple Maps, and Yelp so AI assistants cite you, and wire GA4 call/text attribution.
            </p>
          </div>
        </div>

        <p className="mt-4 border-t border-[#141311]/10 pt-3.5 text-[13.5px] leading-relaxed text-[#4A4742]">
          <strong className="font-semibold text-[#141311]">Agencies &amp; creative directors:</strong> I also engineer white-label builds from your Figma files in Astro, React, and TypeScript under your brand with 100/100 Core Web Vitals.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#141311]/10 pt-4">
        <span className="text-[13px] font-medium text-[#4A4742]">
          “You own the code, the domain, and your accounts from day one.”
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={smsTo("Hi Adam, I read about how you work and I'd like to talk to you directly about my business.")}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#141311] px-4 py-2 font-sans text-[13px] font-semibold text-[#F6F4EF] transition-colors hover:bg-[#002FA7]"
          >
            Text me directly →
          </a>
          <a
            href="/services/"
            className="inline-flex items-center gap-1 rounded-full bg-[#F6F4EF] px-3.5 py-2 font-sans text-[13px] font-semibold text-[#141311] transition-colors hover:bg-[#DFDBD2]"
          >
            5 Services →
          </a>
        </div>
      </div>
    </section>
  );
}

export function Stand() {
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0].name);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    modularChannels[0].title,
    modularChannels[1].title,
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
    <section
      id="stand"
      className="relative overflow-hidden border-t border-[#141311]/12 bg-[#DFDBD2]/45 px-5 py-10 text-[#141311] md:px-8 md:py-12"
    >
      <span id="pricing" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        {/* Calm Header + 3-Step Modular Strip */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(1.85rem,3.3vw,2.85rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
              Modular growth packages, scoped around your ROI.
            </h2>
          </div>

          <ol className="grid grid-cols-3 divide-x divide-[#141311]/10 overflow-hidden rounded-xl border border-[#141311]/12 bg-[#F6F4EF] lg:max-w-md">
            {modularSteps.map((m) => (
              <li key={m.step} className="px-3.5 py-2.5">
                <span className="font-mono text-[11px] font-semibold text-[#002FA7]">
                  Step {m.step}
                </span>
                <h3 className="mt-0.5 font-sans text-xs font-semibold leading-tight text-[#141311]">{m.title}</h3>
                <p className="sr-only">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Single-Viewport 12-Column Scope Configurator */}
        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          {/* LEFT 7 COLS: Step 01 · Choose Your Foundation (3 Cards) */}
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-7">
            {plans.map((pl) => {
              const isSelected = selectedPlan === pl.name;
              return (
                <article
                  key={pl.code}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    setSelectedPlan(pl.name);
                  }}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                    isSelected
                      ? "border-[#002FA7] bg-[#002FA7] text-[#F6F4EF] shadow-[0_20px_50px_-18px_rgba(0,47,167,0.4)]"
                      : "border-[#141311]/12 bg-[#F6F4EF] text-[#141311] hover:border-[#141311]/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`font-mono text-[11px] ${isSelected ? "text-[#DCE6FF]" : "text-ink-soft"}`}>
                        {pl.code}
                      </span>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`Select ${pl.name} foundation`}
                        onClick={() => setSelectedPlan(pl.name)}
                        className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                          isSelected
                            ? "bg-[#F6F4EF] text-[#141311]"
                            : "bg-[#EAE6DF] text-[#4A4742] hover:bg-[#141311] hover:text-[#F6F4EF]"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>

                    <h3 className={`mt-2.5 font-sans text-lg font-semibold leading-tight tracking-[-0.025em] ${isSelected ? "text-[#F6F4EF]" : "text-[#141311]"}`}>
                      {pl.name}
                    </h3>
                    <div className={`mt-1 font-mono text-[11px] font-medium ${isSelected ? "text-[#DCE6FF]" : "text-[#C83E14]"}`}>
                      {pl.price} · {pl.time}
                    </div>

                    <div className={`my-3 border-t ${isSelected ? "border-[#F6F4EF]/20" : "border-[#141311]/10"}`} />

                    <ul className="space-y-1.5 text-[12.5px] leading-snug">
                      {pl.items.map((it) => (
                        <li key={it} className="flex gap-1.5">
                          <span className={`font-bold ${isSelected ? "text-[#34D399]" : "text-[#0B6E3F]"}`}>✓</span>
                          <span className={isSelected ? "text-[#F6F4EF]/95" : "text-[#141311]"}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-2">
                    <p className={`mb-3 text-[11.5px] leading-snug ${isSelected ? "text-[#DCE6FF]" : "text-ink-soft"}`}>
                      <span className={`font-semibold ${isSelected ? "text-white" : "text-[#141311]"}`}>Best for: </span>
                      {pl.for}
                    </p>
                    <a
                      href="#contact"
                      onClick={() => {
                        setSelectedPlan(pl.name);
                        dispatchScope(pl.name, selectedChannels);
                      }}
                      className={`flex items-center justify-center gap-1 rounded-full py-2 font-sans text-xs font-semibold transition ${
                        isSelected
                          ? "bg-[#F6F4EF] text-[#141311] hover:bg-[#141311] hover:text-[#F6F4EF]"
                          : "bg-[#141311] text-[#F6F4EF] hover:bg-[#002FA7]"
                      }`}
                    >
                      {pl.cta ?? `Select ${pl.name}`} →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* RIGHT 5 COLS: Step 02 (6 Channel Toggles) + Step 03 (Live Scope Summary) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] p-5 text-[#141311] shadow-[0_24px_60px_-24px_rgba(20,19,17,0.08)] lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#141311]/10 pb-3">
                <span className="font-sans text-[13.5px] font-semibold text-[#141311]">
                  Step 02 · Toggle priority channels ({selectedChannels.length})
                </span>
                <a href="/packages/" className="text-[12.5px] font-semibold text-[#002FA7] hover:underline">
                  Full specs →
                </a>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {modularChannels.map((ch) => {
                  const active = selectedChannels.includes(ch.title);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.title)}
                      aria-pressed={active}
                      title={ch.impact}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        active
                          ? "border-[#141311] bg-[#141311] text-[#F6F4EF]"
                          : "border-[#141311]/10 bg-[#EAE6DF]/60 text-[#141311] hover:bg-[#EAE6DF]"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-sans text-[12.5px] font-semibold leading-tight">
                          {ch.title}
                        </div>
                        <div className={`text-[11px] ${active ? "text-[#DCE6FF]" : "text-ink-soft"}`}>
                          {ch.tag}
                        </div>
                      </div>
                      <span
                        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          active ? "bg-[#0B6E3F] text-[#F6F4EF]" : "bg-[#F6F4EF] text-[#141311]"
                        }`}
                      >
                        {active ? "✓" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-[#141311]/10 pt-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[12px] font-semibold text-ink-soft">
                    Step 03 · Active scope
                  </span>
                  <span className="font-sans text-sm font-semibold text-[#002FA7]">{selectedPlan}</span>
                </div>
                <div className="mt-2.5 grid gap-3 border-t border-[#141311]/10 pt-2.5 text-[12px] leading-snug text-ink-soft sm:grid-cols-2 sm:divide-x sm:divide-[#141311]/10">
                  <div>
                    <strong className="font-semibold text-[#141311]">Phone preview first: </strong>
                    See your working site on your phone before you pay a dollar.
                  </div>
                  <div className="sm:pl-3">
                    <strong className="font-semibold text-[#141311]">Scoped for ROI: </strong>
                    Tied to customer value; zero long-term contracts.
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              onClick={() => dispatchScope(selectedPlan, selectedChannels)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#002FA7] px-5 py-3 text-center font-sans text-[14.5px] font-semibold text-[#F6F4EF] transition hover:bg-[#141311]"
            >
              Lock in this scope &amp; start with a text →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section
      id="faq"
      className="relative flex flex-col justify-between p-6 text-[#141311] md:p-8 lg:col-span-6"
    >
      <div>
        <h2 className="font-sans text-[clamp(1.65rem,2.6vw,2.3rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
          What people ask before they text.
        </h2>

        <div className="mt-5 divide-y divide-[#141311]/10 overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] px-5 shadow-[0_20px_50px_-24px_rgba(20,19,17,0.08)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${id}-q${i}`;
            const panelId = `${id}-a${i}`;
            return (
              <div key={f.q}>
                <button
                  id={btnId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 py-3.5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className={`font-sans text-[15px] font-semibold leading-snug tracking-[-0.015em] transition ${isOpen ? "text-[#002FA7]" : "text-[#141311] group-hover:text-[#002FA7]"}`}>
                    {f.q}
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                      isOpen
                        ? "rotate-45 bg-[#141311] text-[#F6F4EF]"
                        : "bg-[#EAE6DF] text-[#141311] group-hover:bg-[#141311] group-hover:text-[#F6F4EF]"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  inert={!isOpen}
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-3.5 text-[13.5px] leading-relaxed text-ink-soft">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { services } from "../lib/data";

const PANE_STYLES = [
  {
    code: "01",
    shortLabel: "Brand & Copy",
    accentBg: "bg-[#002FA7]",
    accentText: "text-[#002FA7]",
    solidBadge: "bg-[#002FA7] text-[#F6F4EF]",
  },
  {
    code: "02",
    shortLabel: "Custom Web (<0.4s)",
    accentBg: "bg-[#C83E14]",
    accentText: "text-[#C83E14]",
    solidBadge: "bg-[#C83E14] text-[#F6F4EF]",
  },
  {
    code: "03",
    shortLabel: "Google Maps SEO",
    accentBg: "bg-[#B87D1E]",
    accentText: "text-[#B87D1E]",
    solidBadge: "bg-[#B87D1E] text-[#F6F4EF]",
  },
  {
    code: "04",
    shortLabel: "AI Search (GEO)",
    accentBg: "bg-[#0B6E3F]",
    accentText: "text-[#0B6E3F]",
    solidBadge: "bg-[#0B6E3F] text-[#F6F4EF]",
  },
  {
    code: "05",
    shortLabel: "GA4 Attribution",
    accentBg: "bg-[#4E151B]",
    accentText: "text-[#4E151B]",
    solidBadge: "bg-[#4E151B] text-[#F6F4EF]",
  },
];

export function LifecycleExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mt-6">
      <div className="grid overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] shadow-[0_24px_60px_-24px_rgba(20,19,17,0.08)] lg:grid-cols-12">
        {/* Left: Smooth 5-Stage Architectural Selector (Accessible Tablist) */}
        <div
          role="tablist"
          aria-label="Growth Lifecycle Stages"
          className="flex flex-col justify-between gap-1.5 border-b border-[#141311]/10 bg-[#EAE6DF]/70 p-4 lg:col-span-5 lg:border-r lg:border-b-0 lg:p-5"
        >
          {services.map((s, idx) => {
            const isSelected = idx === activeIndex;
            const st = PANE_STYLES[idx] ?? PANE_STYLES[0];
            return (
              <button
                key={s.code}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`lifecycle-panel-${s.code}`}
                id={`lifecycle-tab-${s.code}`}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                  isSelected
                    ? `${st.solidBadge} shadow-[0_12px_28px_-10px_rgba(20,19,17,0.22)]`
                    : "bg-transparent text-[#141311] hover:bg-[#F6F4EF]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[12px] font-semibold ${
                      isSelected ? "text-[#F6F4EF]/80" : "text-[#4A4742]"
                    }`}
                  >
                    {s.code}
                  </span>
                  <div>
                    <div className="font-sans text-[15px] font-semibold leading-snug tracking-[-0.02em]">
                      {s.title}
                    </div>
                    <div
                      className={`text-[12px] ${
                        isSelected ? "text-[#F6F4EF]/85" : "text-[#4A4742]"
                      }`}
                    >
                      {st.shortLabel}
                    </div>
                  </div>
                </div>
                <span className="font-sans text-sm font-medium" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: All 5 Stage Specification Sheets Pre-Rendered in Static DOM (Zero SEO/GEO Loss) */}
        <div className="bg-[#F6F4EF] lg:col-span-7">
          {services.map((svc, idx) => {
            const isSelected = idx === activeIndex;
            const st = PANE_STYLES[idx] ?? PANE_STYLES[0];
            return (
              <div
                key={svc.code}
                id={`lifecycle-panel-${svc.code}`}
                role="tabpanel"
                aria-labelledby={`lifecycle-tab-${svc.code}`}
                className={
                  isSelected
                    ? "flex h-full flex-col justify-between p-6 md:p-8"
                    : "hidden"
                }
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-medium text-[#4A4742]">
                    <span className="font-mono uppercase tracking-[.08em]">
                      {svc.stageLabel}
                    </span>
                    <span>{svc.who}</span>
                  </div>

                  <h3 className="mt-2 font-sans text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#141311]">
                    {svc.title}
                  </h3>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#4A4742]">
                    {svc.what}
                  </p>

                  {/* Clean Deliverable List */}
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {svc.deliverables.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-lg bg-[#EAE6DF]/65 px-3 py-2 text-[13.5px] font-medium text-[#141311]"
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.accentBg}`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#141311]/10 pt-4">
                  <p className="text-[14px] leading-relaxed text-[#4A4742]">
                    <strong className="font-semibold text-[#141311]">Why it matters: </strong>
                    {svc.whyItMatters}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={svc.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#141311] px-5 py-2.5 font-sans text-[13.5px] font-semibold text-[#F6F4EF] transition-colors hover:bg-[#002FA7]"
                    >
                      {svc.cta} <span aria-hidden="true">→</span>
                    </a>
                    <span className="text-[12.5px] text-[#4A4742]">
                      Available standalone or bundled
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

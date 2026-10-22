import { useState } from "react";
import { services } from "../lib/data";

const ORBIT_NODES = [
  { cx: 210, cy: 92, shortLabel: "BRAND" },
  { cx: 322, cy: 174, shortLabel: "WEB" },
  { cx: 279, cy: 305, shortLabel: "MAPS SEO" },
  { cx: 141, cy: 305, shortLabel: "AI GEO" },
  { cx: 98, cy: 174, shortLabel: "ATTRIBUTION" },
];

export function LifecycleExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = services[activeIndex] ?? services[0];

  return (
    <div className="mt-12">
      {/* Top 5-Stage Interactive Switcher Bar */}
      <div
        role="tablist"
        aria-label="Growth Lifecycle Stages"
        className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5"
      >
        {services.map((s, idx) => {
          const isSelected = idx === activeIndex;
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
              className={`group flex flex-col justify-between rounded-[16px] border p-4 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#FF4D1C] bg-[#1E1E1E] shadow-[0_0_0_1px_#FF4D1C]"
                  : "border-white/12 bg-[#1E1E1E]/60 hover:border-white/30 hover:bg-[#1E1E1E]"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[.12em] text-white/75">
                  {s.stageLabel}
                </span>
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    isSelected ? "bg-[#00FF08] shadow-[0_0_8px_#00FF08]" : "bg-white/25 group-hover:bg-white/50"
                  }`}
                />
              </div>
              <span className="mt-3 font-sans text-[16px] font-medium leading-snug tracking-[-0.02em] text-white">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Orbital Diagram + Active Stage Detail Card */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left: 5-Circle Geometric Orbital SVG */}
        <div className="flex flex-col justify-between rounded-[16px] border border-white/12 bg-[#1E1E1E] p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-[11px] uppercase tracking-[.12em] text-white/75">
              INTERACTIVE LIFECYCLE TOPOLOGY
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-[#00FF08]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF08]" />
              STAGE {active.code} ACTIVE
            </span>
          </div>

          <div className="my-auto flex items-center justify-center py-4">
            <svg
              viewBox="0 0 420 420"
              className="h-auto w-full max-w-[360px] select-none"
              aria-label="Five-stage digital growth orbital diagram"
            >
              {/* Coordinate Crosshairs & Outer Reference Ring */}
              <line x1="24" y1="210" x2="396" y2="210" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <line x1="210" y1="24" x2="210" y2="396" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <circle
                cx="210"
                cy="210"
                r="176"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
              <circle
                cx="210"
                cy="210"
                r="118"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1"
              />

              {/* Spoke Lines from Center Nexus to Each Node */}
              {ORBIT_NODES.map((node, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <line
                    key={`spoke-${idx}`}
                    x1="210"
                    y1="210"
                    x2={node.cx}
                    y2={node.cy}
                    stroke={isSelected ? "#FF4D1C" : "rgba(255,255,255,0.12)"}
                    strokeWidth={isSelected ? "1.75" : "1"}
                    strokeDasharray={isSelected ? "none" : "3 3"}
                  />
                );
              })}

              {/* 5 Interlocking Geometric Orbital Circles */}
              {ORBIT_NODES.map((node, idx) => {
                const s = services[idx];
                const isSelected = idx === activeIndex;
                return (
                  <g
                    key={s.code}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${s.stageLabel}: ${s.title}`}
                    onClick={() => setActiveIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveIndex(idx);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    {/* Outer Orbital Venn Circle */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="64"
                      fill={isSelected ? "rgba(255, 77, 28, 0.12)" : "rgba(255, 255, 255, 0.02)"}
                      stroke={isSelected ? "#FF4D1C" : "rgba(255, 255, 255, 0.18)"}
                      strokeWidth={isSelected ? "2.25" : "1.1"}
                    />
                    {isSelected && (
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="72"
                        fill="none"
                        stroke="#FF4D1C"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.65"
                      />
                    )}
                    {/* Node Center Pill */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="20"
                      fill={isSelected ? "#FF4D1C" : "#151515"}
                      stroke={isSelected ? "#FF4D1C" : "rgba(255,255,255,0.35)"}
                      strokeWidth="1.5"
                    />
                    {isSelected && (
                      <circle cx={node.cx + 15} cy={node.cy - 15} r="4.5" fill="#00FF08" />
                    )}
                    <text
                      x={node.cx}
                      y={node.cy + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontFamily="var(--font-mono), monospace"
                      fontWeight="600"
                    >
                      {s.code}
                    </text>
                    <text
                      x={node.cx}
                      y={node.cy + 36}
                      textAnchor="middle"
                      fill={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.72)"}
                      fontSize="11"
                      fontFamily="var(--font-mono), monospace"
                      letterSpacing="0.08em"
                    >
                      {node.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* Central Full-Lifecycle Core Nexus */}
              <circle
                cx="210"
                cy="210"
                r="44"
                fill="#151515"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.5"
              />
              <circle cx="210" cy="186" r="3.5" fill="#00FF08" />
              <text
                x="210"
                y="207"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontFamily="var(--font-mono), monospace"
                fontWeight="600"
                letterSpacing="0.08em"
              >
                5-STAGE
              </text>
              <text
                x="210"
                y="222"
                textAnchor="middle"
                fill="rgba(255,255,255,0.75)"
                fontSize="11"
                fontFamily="var(--font-mono), monospace"
                letterSpacing="0.06em"
              >
                ENGINE
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[11px] uppercase tracking-[.08em] text-white/75">
            <span>CLICK ANY RING TO INSPECT</span>
            <span>STANDALONE OR UNIFIED</span>
          </div>
        </div>

        {/* Right: Active Stage Detail Card */}
        <div
          id={`lifecycle-panel-${active.code}`}
          role="tabpanel"
          aria-labelledby={`lifecycle-tab-${active.code}`}
          className="flex flex-col justify-between rounded-[16px] border border-white/12 bg-[#1E1E1E] p-7 md:p-9 lg:col-span-7"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-[#151515] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.12em] text-white">
                <span className="h-2 w-2 rounded-full bg-[#FF4D1C]" />
                {active.stageLabel}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[.1em] text-white/75">
                {active.who}
              </span>
            </div>

            <h3 className="mt-5 font-sans text-[clamp(1.75rem,3vw,2.65rem)] font-medium leading-[1.02] tracking-[-0.04em] text-white">
              {active.title}
            </h3>

            <p className="mt-4 text-[17px] leading-relaxed text-white/85">
              {active.what}
            </p>

            {/* Concrete Deliverable Pill Grid */}
            <div className="mt-6">
              <div className="font-mono text-[11px] uppercase tracking-[.12em] text-white/75">
                INCLUDED STAGE DELIVERABLES
              </div>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {active.deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-[8px] border border-white/10 bg-[#151515] px-3.5 py-2.5 text-[14px] leading-snug text-white/90"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF08]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-white/12 pt-6">
            <div className="rounded-[12px] border border-white/10 bg-[#151515] p-4 text-[15px] leading-relaxed text-white/85">
              <strong className="font-semibold text-white">Why it matters: </strong>
              {active.whyItMatters}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <a
                href={active.href}
                className="inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[.1em] text-[#151515] transition hover:bg-[#FF4D1C] hover:text-[#151515]"
              >
                {active.cta} <span aria-hidden="true">→</span>
              </a>
              <span className="font-mono text-[11px] uppercase tracking-[.1em] text-white/75">
                AVAILABLE STANDALONE OR BUNDLED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete 5-Pillar Architectural Summary Matrix (SSR First-Byte & Quick Comparison) */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {services.map((s, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <a
              key={s.code}
              href={s.href}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`group flex flex-col justify-between rounded-[16px] border p-5 transition-all duration-200 ${
                isSelected
                  ? "border-white/30 bg-[#1E1E1E]"
                  : "border-white/10 bg-[#1E1E1E]/50 hover:border-white/25 hover:bg-[#1E1E1E]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[.12em] text-white/75">
                    STAGE {s.code}
                  </span>
                  <span className="font-mono text-[11px] text-[#FF4D1C] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
                <h4 className="mt-2.5 font-sans text-[17px] font-medium leading-snug tracking-[-0.02em] text-white">
                  {s.title}
                </h4>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/75">
                  {s.what}
                </p>
              </div>
              <p className="mt-4 border-t border-white/10 pt-3 text-[13px] leading-relaxed text-white/80">
                <strong className="font-semibold text-white">Why it matters: </strong>
                {s.whyItMatters}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

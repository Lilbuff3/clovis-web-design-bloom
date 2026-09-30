import { useState } from "react";
import { compare, seasons } from "../lib/data";
import { useSectionProgress, useGlobalReveal } from "../lib/hooks";

const milestones = [
  {
    step: "01",
    name: "Discovery",
    when: "Day 1",
    description: "45-minute interview & local Google Maps audit",
    badge: "Strategic Intake",
  },
  {
    step: "02",
    name: "Copy & Design",
    when: "Days 2–3",
    description: "Done-for-you copywriting & mobile layout proof",
    badge: "No Blank Forms",
  },
  {
    step: "03",
    name: "Custom Build",
    when: "Days 3–5",
    description: "Semantic hand-written code & 100/100 speed tuning",
    badge: "Zero Bloat",
  },
  {
    step: "04",
    name: "Launch",
    when: "Day 6+",
    description: "Domain live, Google index verified & keys handed over",
    badge: "100% Client-Owned",
  },
];

function MilestoneStepper({ p, active }: { p: number; active: number }) {
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[.2em]">
          <span className="font-semibold text-persimmon">Milestone Stepper</span>
          <span className="text-ink/60">Phase {active + 1} of 4</span>
        </div>
        <div className="mt-4 font-display wonk text-4xl text-ink">
          {milestones[active].name}
        </div>
      </div>

      {/* Stepper track */}
      <div className="my-6 space-y-4">
        {milestones.map((m, i) => {
          const isDone = active > i || (i === 3 && p >= 0.95);
          const isActive = active === i && !isDone;
          return (
            <div key={m.step} className="relative flex items-start gap-4">
              {/* Connecting line between nodes */}
              {i < milestones.length - 1 && (
                <div
                  className="absolute left-4 top-8 -bottom-4 w-0.5 bg-ink/10"
                  aria-hidden="true"
                >
                  <div
                    className="w-full bg-leaf transition-all duration-300"
                    style={{
                      height: `${Math.min(1, Math.max(0, p * 4 - i)) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Node indicator */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold transition-all duration-300 ${
                  isDone
                    ? "bg-leaf text-cream shadow-sm"
                    : isActive
                    ? "bg-persimmon text-cream shadow-md ring-4 ring-persimmon/20"
                    : "border-2 border-ink/20 bg-cream text-ink/40"
                }`}
              >
                {isDone ? "✓" : m.step}
              </div>

              {/* Node details */}
              <div className="flex-1 pb-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`font-mono text-xs uppercase tracking-wider font-medium ${
                      isActive ? "text-persimmon font-bold" : isDone ? "text-ink" : "text-ink/50"
                    }`}
                  >
                    {m.name}
                  </span>
                  <span className="font-mono text-[10px] text-ink/50">{m.when}</span>
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink/75">{m.description}</p>
                {isActive && (
                  <span className="mt-2 inline-block rounded-full bg-persimmon/10 px-2.5 py-0.5 font-mono text-[10px] uppercase font-semibold text-persimmon">
                    {m.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="border-t border-ink/10 pt-4">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-ink/60">Milestone Progress</span>
          <span className="font-semibold text-ink">{Math.round(p * 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full bg-persimmon transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, p * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function Season() {
  useGlobalReveal();
  const [ref, p] = useSectionProgress<HTMLDivElement>();
  const active = Math.min(3, Math.floor(p * 4));
  return (
    <section id="season" className="relative px-5 py-14 md:px-8 md:py-20">
      <span id="process" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">03 — The Process</div>
          <h2 className="font-display mt-5 text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>From discovery</span></span>
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                to launch in <em className="wonk text-persimmon">six days.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Every site goes through the same four stages in the same order, so nothing gets made up on the day it should've been decided. Day counts are for the
            one-page build; multi-page sites run three to four weeks, and anything with booking or compliance runs longer.
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24 flex h-[calc(100vh-8rem)] flex-col">
              <div className="relative flex-1 overflow-hidden rounded-[40px] border border-ink/10 bg-cream p-7 shadow-xl">
                <MilestoneStepper p={p} active={active} />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {seasons.map((s, i) => (
                  <div key={s.key} className="text-center">
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div className="h-full bg-leaf transition-all duration-300" style={{ width: `${Math.min(1, Math.max(0, p * 4 - i)) * 100}%` }} />
                    </div>
                    <div className={`mt-2 font-mono text-[10px] uppercase tracking-widest ${i === active ? "text-ink" : "text-ink/40"}`}>{s.when}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7 lg:space-y-12 lg:py-4">
            {seasons.map((s, i) => (
              <div
                key={s.key}
                className={`reveal rounded-[32px] border p-7 transition-all duration-500 md:p-10 ${
                  i === active ? "border-ink/15 bg-paper shadow-[0_30px_60px_-40px_rgba(30,43,35,.45)]" : "border-ink/10 bg-paper/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display wonk text-2xl italic text-persimmon">
                    {String(i + 1).padStart(2, "0")} · {s.name}
                  </span>
                  <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-cream">{s.when}</span>
                </div>
                <h3 className="font-display mt-5 text-3xl font-[450] leading-tight md:text-4xl">{s.title}</h3>
                <p className="mt-4 text-[17px] leading-relaxed text-ink/80">{s.body}</p>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-[.2em] text-ink/50">What you get</div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {s.gets.map((g) => (
                    <li key={g} className="flex gap-2.5 rounded-2xl bg-cream p-3 text-[14.5px] leading-snug">
                      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-leaf" style={{ boxShadow: "inset 0 0 0 4px #DBE5CF" }} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Compare() {
  useGlobalReveal();
  const [mine, setMine] = useState(true);
  return (
    <section id="compare" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-leaf">04 — How We Compare</div>
            <h2 className="font-display mt-5 text-[clamp(2.4rem,5.5vw,5rem)] font-[420] leading-[0.95]">
              <span className="line-mask"><span>Traditional agency,</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  or <em className="wonk text-leaf">dedicated builder?</em>
                </span>
              </span>
            </h2>
          </div>
          <button
            onClick={() => setMine((m) => !m)}
            data-magnetic="0.15" className="reveal group relative flex h-16 w-[300px] items-center rounded-full bg-ink p-1.5 text-[15px] font-medium"
            aria-pressed={mine}
          >
            <span
              className="absolute top-1.5 h-13 w-[calc(50%-6px)] rounded-full bg-citrus transition-all duration-500"
              style={{ left: mine ? "calc(50% + 0px)" : "6px", height: "calc(100% - 12px)", transitionTimingFunction: "cubic-bezier(.6,-0.3,.3,1.4)" }}
            />
            <span className={`relative z-10 flex-1 text-center transition ${!mine ? "text-ink" : "text-cream/70"}`}>Typical agency</span>
            <span className={`relative z-10 flex-1 text-center transition ${mine ? "text-ink" : "text-cream/70"}`}>With Adam</span>
          </button>
        </div>

        <div className="mt-14 divide-y divide-ink/15 border-y border-ink/15">
          {compare.map((row, i) => {
            const [head, body] = mine ? row.me : row.them;
            return (
              <div key={row.q} className="grid gap-4 py-7 md:grid-cols-12 md:gap-8">
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="font-mono text-xs text-ink/40">0{i + 1}</span>
                  <span className="text-lg font-medium">{row.q}</span>
                </div>
                <div key={String(mine)} className="md:col-span-8" style={{ animation: `rise .6s cubic-bezier(.2,.8,.2,1) ${i * 70}ms both` }}>
                  <div className={`font-display wonk text-3xl italic md:text-4xl ${mine ? "text-leaf" : "text-ink/45 line-through decoration-persimmon/60 decoration-2"}`}>
                    {head}
                  </div>
                  <p className={`mt-2 max-w-2xl text-[16px] leading-relaxed ${mine ? "text-ink/85" : "text-ink/55"}`}>{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const Process = Season;

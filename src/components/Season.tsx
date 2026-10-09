import { useState } from "react";
import { compare, steps } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Season() {
  useGlobalReveal();
  return (
    <section id="season" className="relative px-5 py-14 md:px-8 md:py-20">
      <span id="process" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="font-display h-section">
            <span className="line-mask"><span>From discovery</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>to launch in six days.</span></span>
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Every site goes through the same four stages in the same order, so nothing gets made up on the day it should've been decided. Day counts are for the
            one-page build; multi-page sites run three to four weeks, and anything with booking or compliance runs longer.
          </p>
        </div>

        {/* Each step's top rule joins the next on wide screens, so the four read as one timeline. */}
        <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.name} className="reveal relative border-t border-ink/20 pt-6 sm:pr-8" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-persimmon" aria-hidden="true" />
              <h3 className="font-display text-3xl font-[450] leading-tight">{s.name}</h3>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-[.16em] text-ink-soft">{s.when}</div>
              <p className="mt-3 text-[16px] leading-relaxed text-ink/80">{s.body}</p>
            </li>
          ))}
        </ol>
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
          <h2 className="font-display h-section">
            <span className="line-mask"><span>Traditional agency,</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>or dedicated builder?</span></span>
          </h2>
          <button
            onClick={() => setMine((m) => !m)}
            data-magnetic="0.15" className="reveal group relative flex h-16 w-[300px] items-center rounded-full bg-ink p-1.5 text-[15px] font-medium"
            aria-pressed={mine}
          >
            <span
              className="absolute top-1.5 h-13 w-[calc(50%-6px)] rounded-full bg-citrus transition-all duration-500"
              style={{ left: mine ? "calc(50% + 0px)" : "6px", height: "calc(100% - 12px)", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
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
                  <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
                  <span className="text-lg font-medium">{row.q}</span>
                </div>
                <div key={String(mine)} className="md:col-span-8" style={{ animation: `rise .6s cubic-bezier(.2,.8,.2,1) ${i * 70}ms both` }}>
                  <div className={`font-display wonk text-3xl italic md:text-4xl ${mine ? "text-leaf" : "text-ink/60 line-through decoration-persimmon/60 decoration-2"}`}>
                    {head}
                  </div>
                  <p className={`mt-2 max-w-2xl text-[16px] leading-relaxed ${mine ? "text-ink/85" : "text-ink-soft"}`}>{body}</p>
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

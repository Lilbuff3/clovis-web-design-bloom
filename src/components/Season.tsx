import { useState } from "react";
import { compare, seasons } from "../lib/data";
import { useSectionProgress } from "../lib/hooks";

function Leaf({ x, y, flip, show, scale = 1 }: { x: number; y: number; flip?: boolean; show: boolean; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <g style={{ transform: show ? "scale(1)" : "scale(0)", transformOrigin: "0 0", transition: "transform .8s cubic-bezier(.3,1.6,.5,1)" }}>
        <path d="M0 0 C 18 -26, 58 -30, 78 -14 C 58 6, 22 12, 0 0 Z" fill="#2E6A4C" />
        <path d="M0 0 C 26 -10, 50 -14, 76 -14" stroke="#DBE5CF" strokeWidth="1.5" fill="none" opacity=".6" />
      </g>
    </g>
  );
}

function Fruit({ x, y, show, delay = 0 }: { x: number; y: number; show: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g style={{ transform: show ? "scale(1)" : "scale(0)", transformOrigin: "0 0", transition: `transform .9s cubic-bezier(.3,1.7,.5,1) ${delay}ms` }}>
        <circle r="17" fill="#EE5A2F" />
        <circle r="5" cx="-6" cy="-6" fill="#FFB43B" opacity=".7" />
        <path d="M0 -17 c3 -6 8 -7 12 -6 -2 5 -7 7 -12 6z" fill="#2E6A4C" />
      </g>
    </g>
  );
}

function Plant({ p }: { p: number }) {
  const stem = Math.min(1, p / 0.8);
  return (
    <svg viewBox="0 0 320 520" className="h-full w-full">
      {/* sun rises */}
      <circle cx="238" cy={150 - p * 60} r={40 + p * 16} fill="#FFB43B" opacity={0.25 + p * 0.55} />
      {/* soil */}
      <ellipse cx="160" cy="480" rx="120" ry="18" fill="#C9A77A" opacity=".45" />
      <path d="M95 470 h130 l-14 44 h-102 z" fill="#D9774E" />
      <rect x="88" y="458" width="144" height="18" rx="6" fill="#E58A5F" />
      {/* seed */}
      <ellipse cx="160" cy="458" rx="10" ry="7" fill="#7A5A3A" style={{ opacity: p < 0.05 ? 1 : 0.2, transition: "opacity .6s" }} />
      {/* stem */}
      <path
        d="M160 458 C 150 400, 175 350, 158 290 S 150 180, 165 90"
        fill="none"
        stroke="#2E6A4C"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - stem}
      />
      <Leaf x={162} y={400} show={p > 0.12} scale={0.8} />
      <Leaf x={160} y={380} flip show={p > 0.2} scale={0.75} />
      <Leaf x={160} y={310} show={p > 0.35} />
      <Leaf x={158} y={285} flip show={p > 0.42} />
      <Leaf x={154} y={210} show={p > 0.56} scale={0.95} />
      <Leaf x={156} y={190} flip show={p > 0.62} scale={0.9} />
      <Leaf x={162} y={130} show={p > 0.72} scale={0.8} />
      <Leaf x={164} y={112} flip show={p > 0.76} scale={0.7} />
      <Fruit x={228} y={300} show={p > 0.84} />
      <Fruit x={92} y={262} show={p > 0.86} delay={120} />
      <Fruit x={214} y={206} show={p > 0.9} delay={240} />
      <Fruit x={104} y={170} show={p > 0.93} delay={360} />
    </svg>
  );
}

export function Season() {
  const [ref, p] = useSectionProgress<HTMLDivElement>();
  const active = Math.min(3, Math.floor(p * 4));
  return (
    <section id="season" className="relative px-5 py-24 md:px-8 md:py-36">
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
              <div className="relative flex-1 overflow-hidden rounded-[40px] bg-sky/60">
                <div className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-[.2em] text-ink/60">
                  Stage {active + 1} of 4
                </div>
                <div className="absolute right-6 top-4 font-display wonk text-6xl italic text-ink/90">{seasons[active].name}</div>
                <div className="absolute inset-x-6 bottom-0 top-16">
                  <Plant p={p} />
                </div>
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

          <div className="space-y-6 lg:col-span-7 lg:space-y-[18vh] lg:py-[8vh]">
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
  const [mine, setMine] = useState(true);
  return (
    <section id="compare" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
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

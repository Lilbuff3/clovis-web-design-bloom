import { useState } from "react";
import { cases, SMS_LINK } from "../lib/data";
import { useCountUp } from "../lib/hooks";

type Y = { value: number; prefix?: string; suffix?: string; label: string; decimals?: number; display?: string };

function Yield({ y, i }: { y: Y; i: number }) {
  const [ref, v] = useCountUp(y.value, 1500 + i * 150);
  const shown = y.display && v >= y.value * 0.999 ? y.display : v.toFixed(y.decimals ?? 0);
  return (
    <div className="border-t border-ink/15 pt-4">
      <div className="font-display text-5xl font-[400] tabular-nums md:text-6xl">
        <span ref={ref}>
          {y.prefix}
          {shown}
        </span>
        <span className="text-persimmon">{y.suffix}</span>
      </div>
      <div className="mt-2 text-sm leading-snug text-ink/70">{y.label}</div>
    </div>
  );
}

function CaseSpread({ c, flip }: { c: (typeof cases)[number]; flip: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
        <div
          className="reveal relative mx-auto max-w-xl"
          data-hover
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
          }}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ perspective: 1000 }}
        >
          <div
            className={`arch clip-reveal relative aspect-[4/5] overflow-hidden ${c.tint} shadow-[0_50px_80px_-40px_rgba(30,43,35,.5)] transition-transform duration-300 ease-out`}
            style={{ transform: `rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg)` }}
          >
            <img
              src={c.img}
              alt={`${c.client} project artwork`}
              className="h-full w-full object-cover transition-transform duration-700"
              style={{ transform: `scale(1.08) translate(${tilt.x * -14}px, ${tilt.y * -14}px)` }}
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream">
              <span className="font-mono text-[11px] uppercase tracking-[.18em]">{c.place}</span>
              <span className="rounded-full bg-cream px-3 py-1 font-mono text-[11px] text-ink">PageSpeed 100</span>
            </div>
          </div>
          {/* Crate label sticker */}
          <div
            data-speed="0.35"
            className={`absolute -top-5 ${flip ? "-left-3 md:-left-8 -rotate-6" : "-right-3 md:-right-8 rotate-6"} w-44 rounded-2xl border-2 border-ink bg-cream p-3 shadow-xl transition-transform duration-500 hover:rotate-0`}
          >
            <div className="flex items-center justify-between border-b border-dashed border-ink/40 pb-1.5 font-mono text-[9px] uppercase tracking-[.2em]">
              <span>Crate</span>
              <span>Nº {c.no}</span>
            </div>
            <div className="font-display wonk mt-1.5 text-lg italic leading-tight">{c.client}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[.15em] text-ink/60">
              Grown {c.year} · Central Valley
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
        <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-ink/60">
          {c.trade} · {c.year}
        </div>
        <h3 className="reveal font-display mt-3 text-[clamp(2rem,3.6vw,3.3rem)] font-[420] leading-[1.02]" style={{ ["--d" as string]: "80ms" }}>
          {c.headline}
        </h3>

        <div className="reveal mt-8 grid gap-6 sm:grid-cols-2" style={{ ["--d" as string]: "160ms" }}>
          <div className="rounded-3xl bg-cream p-5">
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-persimmon">The weeds</div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{c.problem}</p>
          </div>
          <div className="rounded-3xl bg-cream p-5">
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-leaf">What I planted</div>
            <ol className="mt-2 space-y-1.5 text-[15px]">
              {c.planted.map((p, i) => (
                <li key={p} className="flex gap-2">
                  <span className="font-mono text-xs text-ink/40">0{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[.2em] text-ink/60">What grew</div>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-6">
          {c.yields.map((y, i) => (
            <Yield key={y.label} y={y} i={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {c.stack.map((s) => (
            <span key={s} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[11px]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Harvest() {
  return (
    <section id="harvest" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">02 — This season's harvest</div>
            <h2 className="font-display mt-5 text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
              <span className="line-mask"><span>Two crates,</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  <em className="wonk text-leaf">both still ripe.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className="reveal max-w-sm text-lg leading-relaxed text-ink/80">
            Two practices, both live. Don't take my word for the speed — open either site on your phone, out in the parking lot, and time it yourself.
          </p>
        </div>

        <div className="mt-20 space-y-32">
          {cases.map((c, i) => (
            <CaseSpread key={c.no} c={c} flip={i % 2 === 1} />
          ))}
        </div>

        {/* Crate 03 */}
        <div className="reveal relative mt-32 overflow-hidden rounded-[40px] bg-leaf text-cream">
          <div className="grid items-center md:grid-cols-2">
            <div className="p-8 md:p-14">
              <div className="font-mono text-[11px] uppercase tracking-[.2em] text-citrus">Crate Nº 03 — reserved</div>
              <h3 className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-[400] leading-[0.95]">
                This spot's <em className="wonk text-citrus">yours</em>, if you want it.
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/80">
                The $500 launch price holds for the first five Central Valley businesses. After that, it's $750 — still honest, just less of a steal.
              </p>
              <a href={SMS_LINK} data-magnetic className="mt-8 inline-flex items-center gap-3 rounded-full bg-citrus px-6 py-4 font-medium text-ink transition hover:bg-cream">
                Claim a spot by text <span aria-hidden>→</span>
              </a>
            </div>
            <div className="clip-reveal relative h-80 md:h-full md:min-h-[480px]">
              <img src="/images/seedling.jpg" alt="A seedling sprouting in a terracotta pot on a sunny windowsill" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

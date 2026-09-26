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
  const [viewMode, setViewMode] = useState<"web" | "photo">("web");

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
        <div
          className="relative mx-auto max-w-xl"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
          }}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ perspective: 1000 }}
        >
          {/* Crate label sticker pinned cleanly above the browser frame */}
          <div className={`mb-3.5 flex ${flip ? "justify-start pl-2 sm:pl-4" : "justify-end pr-2 sm:pr-4"}`}>
            <div
              className={`w-44 rounded-2xl border-2 border-ink bg-cream p-3 shadow-lg transition-transform duration-300 hover:rotate-0 ${
                flip ? "-rotate-2" : "rotate-2"
              }`}
            >
              <div className="flex items-center justify-between border-b border-dashed border-ink/40 pb-1.5 font-mono text-[9px] uppercase tracking-[.2em]">
                <span>Project</span>
                <span>Nº {c.no}</span>
              </div>
              <div className="font-display wonk mt-1 text-base italic leading-tight text-ink">{c.client}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[.15em] text-ink/60">
                Built {c.year} · Central Valley
              </div>
            </div>
          </div>

          {/* Hand-Grown Browser Showcase Window */}
          <div
            className="rounded-[28px] md:rounded-[36px] border-2 border-ink bg-cream p-2.5 md:p-3.5 shadow-[0_30px_70px_-25px_rgba(30,43,35,0.45)] transition-transform duration-300 ease-out"
            style={{ transform: `rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 6}deg)` }}
          >
            {/* Browser top chrome */}
            <div className="mb-2.5 flex items-center justify-between px-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-persimmon shadow-inner" />
                <span className="h-2.5 w-2.5 rounded-full bg-citrus shadow-inner" />
                <span className="h-2.5 w-2.5 rounded-full bg-leaf shadow-inner" />
              </div>

              {/* Address bar pill */}
              <div className="mx-2 flex flex-1 max-w-[280px] items-center justify-between rounded-full border border-ink/15 bg-paper/80 px-3 py-1 font-mono text-[11px] text-ink/80 shadow-inner">
                <span className="truncate flex items-center gap-1">
                  <span className="text-[10px] opacity-60">🔒</span>
                  <span>{c.urlDisplay}</span>
                </span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 text-[10px] font-semibold text-persimmon hover:underline flex-shrink-0"
                >
                  Live ↗
                </a>
              </div>

              {/* PageSpeed 100 pill */}
              <div className="flex items-center gap-1 rounded-full bg-leaf/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-leaf">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
                <span>100</span>
              </div>
            </div>

            {/* Display Stage - 16:9 aspect-video matches exact 1280x720 preview dimensions */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[20px] md:rounded-[24px] border border-ink/10 bg-paper">
              {viewMode === "web" ? (
                <div className="relative h-full w-full overflow-hidden group">
                  <img
                    src={c.previewImg}
                    alt={`${c.client} hand-built website`}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 rounded-full bg-ink/90 px-3 py-1.5 font-mono text-[11px] font-medium text-cream shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                  >
                    Open live website ↗
                  </a>
                </div>
              ) : (
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={c.photoImg}
                    alt={`${c.client} on-site photography`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-cream">
                    <span className="font-mono text-[11px] uppercase tracking-wider">{c.place}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom inspection pill toggle */}
            <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-ink/15 px-2 pt-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode("web")}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    viewMode === "web"
                      ? "bg-ink font-medium text-cream shadow-sm"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  🖥️ Live Website
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("photo")}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    viewMode === "photo"
                      ? "bg-ink font-medium text-cream shadow-sm"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  📸 On-Site Photo
                </button>
              </div>
              <span className="hidden sm:inline-block font-mono text-[10px] text-ink/50 uppercase tracking-wider">
                {c.place}
              </span>
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
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-persimmon">The Challenge</div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{c.problem}</p>
          </div>
          <div className="rounded-3xl bg-cream p-5">
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-leaf">What Was Built</div>
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

        <div className="mt-8 font-mono text-[10px] uppercase tracking-[.2em] text-ink/60">Key Results</div>
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
            <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">02 — Client Work</div>
            <h2 className="font-display mt-5 text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
              <span className="line-mask"><span>Real businesses.</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  <em className="wonk text-leaf">Measured results.</em>
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

        {/* Project 03 */}
        <div className="reveal relative mt-32 overflow-hidden rounded-[40px] bg-leaf text-cream">
          <div className="grid items-center md:grid-cols-2">
            <div className="p-8 md:p-14">
              <div className="font-mono text-[11px] uppercase tracking-[.2em] text-citrus">Project Nº 03 — Next in line</div>
              <h3 className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-[400] leading-[0.95]">
                This spot's <em className="wonk text-citrus">yours</em>, if you want it.
              </h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/80">
                The $500 launch price holds for the first five Central Valley businesses. After that, it's $750 — still less than half what traditional agencies charge for a generic template.
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

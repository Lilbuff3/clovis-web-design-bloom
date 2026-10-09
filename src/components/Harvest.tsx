import { useState } from "react";
import { cases, SMS_LINK } from "../lib/data";
import { useCountUp, useGlobalReveal } from "../lib/hooks";

type Y = { value: number; prefix?: string; suffix?: string; label: string };

function Yield({ y, i }: { y: Y; i: number }) {
  const [ref, v] = useCountUp(y.value, 1500 + i * 150);
  const shown = v.toFixed(0);
  return (
    <div className="border-t border-ink/15 pt-4">
      <div className="font-display text-4xl font-[400] tabular-nums sm:text-5xl md:text-6xl">
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
    <article className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
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
          <div className={`mb-3.5 flex ${flip ? "justify-start pl-2 sm:pl-4" : "justify-end pr-2 sm:pr-4"}`}>
            <span className="rounded-full border border-ink/15 bg-cream/95 px-4 py-1.5 font-sans text-xs font-semibold text-ink shadow-sm">{c.client}</span>
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
              <div className="mx-2 max-w-[280px] flex-1 truncate rounded-full border border-ink/15 bg-paper/80 px-3 py-1 font-mono text-[11px] text-ink/80 shadow-inner">
                {c.urlDisplay}
              </div>

              {/* PageSpeed 100 pill */}
              <div className="flex items-center gap-1 rounded-full bg-leaf/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-leaf">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
                <span>100</span>
              </div>
            </div>

            {/* Display Stage - 16:9 aspect-video matches exact 1280x720 preview dimensions */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[20px] md:rounded-[24px] border border-ink/10 bg-paper">
              {/* Web preview buffer */}
              <div
                aria-hidden={viewMode !== "web"}
                className={`absolute inset-0 h-full w-full overflow-hidden group transition-opacity duration-300 ${
                  viewMode === "web" ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={c.previewImg}
                  alt={`${c.client} hand-built website`}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={viewMode === "web" ? 0 : -1}
                  className="absolute bottom-3 right-3 rounded-full bg-ink/90 px-3 py-1.5 font-mono text-[11px] font-medium text-cream shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                >
                  Open live website ↗
                </a>
              </div>

              {/* On-site photo buffer */}
              <div
                aria-hidden={viewMode !== "photo"}
                className={`absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300 ${
                  viewMode === "photo" ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={c.photoImg}
                  alt={`${c.client} on-site photography`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-cream">
                  <span className="font-mono text-[11px] uppercase tracking-wider">{c.place}</span>
                </div>
              </div>
            </div>

            {/* Bottom inspection pill toggle */}
            <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-ink/15 px-2 pt-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Project view mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "web"}
                  onClick={() => setViewMode("web")}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    viewMode === "web"
                      ? "bg-ink font-medium text-cream shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Live website
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === "photo"}
                  onClick={() => setViewMode("photo")}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    viewMode === "photo"
                      ? "bg-ink font-medium text-cream shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  On-site photo
                </button>
              </div>
              <span className="hidden sm:inline-block font-mono text-[11px] text-ink-soft uppercase tracking-wider">
                {c.place}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
        <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-ink-soft">
          {c.trade} · {c.year}
        </div>
        <h3 className="reveal font-display mt-3 text-[clamp(2rem,3.6vw,3.3rem)] font-[420] leading-[1.02]" style={{ ["--d" as string]: "80ms" }}>
          {c.headline}
        </h3>

        <div className="reveal mt-8 grid gap-6 sm:grid-cols-2" style={{ ["--d" as string]: "160ms" }}>
          <div className="rounded-3xl bg-cream p-5">
            <div className="font-mono text-[11px] uppercase tracking-[.2em] text-persimmon-deep">The Challenge</div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{c.problem}</p>
          </div>
          <div className="rounded-3xl bg-cream p-5">
            <div className="font-mono text-[11px] uppercase tracking-[.2em] text-leaf">What Was Built</div>
            <ol className="mt-2 space-y-1.5 text-[15px]">
              {c.planted.map((p, i) => (
                <li key={p} className="flex gap-2">
                  <span className="font-mono text-xs text-ink-soft">0{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 font-mono text-[11px] uppercase tracking-[.2em] text-ink-soft">Key Results</div>
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

        {c.quote && (
          <figure className="mt-8 border-l-2 border-persimmon/60 pl-5">
            <blockquote className="font-display text-[19px] font-[380] leading-[1.45] text-ink/90 md:text-[21px]">“{c.quote.text}”</blockquote>
            <figcaption className="mt-3 text-sm text-ink/70">
              <span className="font-medium text-ink">{c.quote.name}</span> · {c.quote.role}
            </figcaption>
          </figure>
        )}
      </div>
    </article>
  );
}

export function ClientWork() {
  useGlobalReveal();
  return (
    <section id="harvest" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <span id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
              <span className="line-mask"><span>Real businesses.</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  <em className="wonk text-leaf">Measurable results.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className="reveal max-w-sm text-lg leading-relaxed text-ink/80">
            Two businesses, both live. One reason they get calls: each site shows up fast for a new customer on two bars of signal. Owners rarely see their own site that way. They check it at home on <span className="whitespace-nowrap">Wi-Fi</span>, with a copy already saved on their phone.
          </p>
        </div>

        <div className="mt-14 space-y-16 md:space-y-20">
          {cases.map((c, i) => (
            <CaseSpread key={c.no} c={c} flip={i % 2 === 1} />
          ))}
        </div>

        {/* The next spot. What it includes is on the price tags below. */}
        <div className="reveal relative mt-16 overflow-hidden rounded-[40px] bg-leaf p-8 text-cream md:mt-20 md:p-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h3 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-[400] leading-[0.95]">
              This spot's <em className="wonk text-citrus">yours</em>, if you want it.
            </h3>
            <a href={SMS_LINK} data-magnetic className="inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-citrus px-6 py-4 font-medium text-ink transition hover:bg-cream md:self-auto">
              Claim a spot by text <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Harvest = ClientWork;

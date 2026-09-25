import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion, usePageScroll } from "../lib/hooks";
import { onIntroDone } from "../lib/smooth";
import { studio, VIDEO_ORCHARD } from "../data/content";
import { AmbientVideo } from "./primitives";

function RotatingBadge() {
  return (
    <div className="relative h-28 w-28 md:h-36 md:w-36">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="font-mono" fontSize="15.5" letterSpacing="4.2" fill="#1E2B23">
          <textPath href="#circ">HAND-GROWN · NO PRESERVATIVES · LIVE IN A WEEK ·</textPath>
        </text>
      </svg>
      <div className="absolute inset-[28%] flex items-center justify-center rounded-full bg-persimmon text-cream shadow-lg">
        <span className="font-display wonk text-lg italic md:text-xl">$500</span>
      </div>
    </div>
  );
}

function ClovisClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: false }));
  const status =
    hour >= 7 && hour < 19
      ? "Adam's at the workbench"
      : hour >= 19 && hour < 23
        ? "Adam's winding down — text anyway"
        : "Adam's asleep — he'll text back at sunrise";
  return (
    <span>
      {time} in Clovis · {status}
    </span>
  );
}

/** Splits text into per-character spans for kinetic variable weight modulation */
function Kinetic({ text, className = "", start = 0 }: { text: string; className?: string; start?: number }) {
  return (
    <span className={`hero_word inline-block ${className}`} aria-hidden="true">
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="hero_char inline-block"
          style={{ "--c": start + i } as CSSProperties}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

function StudioTicketCard() {
  return (
    <div
      className="hero_card w-full max-w-[280px] bg-cream/90 backdrop-blur-md rounded-2xl border border-ink/15 p-4 shadow-[0_20px_40px_-20px_rgba(30,43,35,0.35)] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300"
      aria-label="Studio at a glance"
    >
      <div className="hero_card-head flex items-center justify-between border-b border-dashed border-ink/20 pb-2 font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">
        <span>Ticket № 001</span>
        <span>Clovis, CA</span>
      </div>
      <dl className="hero_card-list my-3 space-y-1.5 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-ink/65">Landing page</dt>
          <dd className="font-mono font-bold text-ink">$500</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/65">Live in</dt>
          <dd className="font-mono font-medium text-ink">1 week</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/65">Who owns code</dt>
          <dd className="font-mono font-medium text-ink">You</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/65">Hostage fees</dt>
          <dd className="font-mono font-medium text-persimmon font-semibold">None</dd>
        </div>
      </dl>
      <a
        href={studio.smsHref}
        className="hero_card-foot flex items-center justify-between border-t border-dashed border-ink/20 pt-2 text-persimmon hover:text-ink transition-colors"
        data-cursor="hover"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest font-semibold">Text</span>
        <span className="hero_card-phone font-mono text-[12px] font-bold">{studio.phoneDisplay}</span>
      </a>
    </div>
  );
}

export function Hero() {
  const { y } = usePageScroll();
  const [loaded, setLoaded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => onIntroDone(() => setLoaded(true)), []);
  const par = Math.min(y, 900);

  // Cursor-proximity variable-font modulation (wght 340 → 820, SOFT 100 → 0)
  useEffect(() => {
    const h = heading.current;
    if (!h || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const chars = Array.from(h.querySelectorAll<HTMLSpanElement>(".hero_char"));
    let mx = -9999,
      my = -9999,
      raf = 0;
    const radius = 260;

    const render = () => {
      raf = 0;
      for (const c of chars) {
        const r = c.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 1 - d / radius);
        const e = f * f * (3 - 2 * f); // smoothstep
        const isItalic =
          c.parentElement?.classList.contains("is-italic") ||
          c.classList.contains("is-italic");
        const base = isItalic ? 380 : 340;
        const targetWght = Math.round(base + e * 480);
        const targetSoft = Math.round(100 - e * 100);
        const targetWonk = isItalic ? 1 : 0;
        c.style.fontVariationSettings = `"wght" ${targetWght}, "SOFT" ${targetSoft}, "opsz" 144, "WONK" ${targetWonk}`;
      }
    };

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const leave = () => {
      mx = my = -9999;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const host = h.closest("section") || h;
    host.addEventListener("pointermove", move as EventListener);
    host.addEventListener("pointerleave", leave as EventListener);

    return () => {
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerleave", leave as EventListener);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" data-intro className={`section_hero relative min-h-[100svh] overflow-hidden bg-[#f8e6b8] ${loaded ? "is-ready" : ""}`}>
      {/* Illustration */}
      <div
        className="absolute inset-0 transition-transform duration-[2400ms] ease-[cubic-bezier(.2,.7,.1,1)]"
        style={{ transform: loaded ? "scale(1)" : "scale(1.22)" }}
      >
        <div className="absolute inset-0" style={{ transform: `translateY(${par * 0.25}px) scale(${1.04 + par * 0.00012})` }}>
          <img
            src="/images/hero.jpg"
            alt="Hand-painted citrus orchard rows leading to the Sierra Nevada foothills at sunrise"
            className="h-full w-full object-cover object-[30%_bottom] md:object-bottom"
          />
        </div>
      </div>

      {/* Halo for the painted sun */}
      <div
        className="pointer-events-none absolute hidden rounded-full md:block"
        style={{
          left: "18.6%",
          top: "calc(100% - 42%)",
          width: "22vw",
          height: "22vw",
          transform: `translate(-50%,-50%) translateY(${par * 0.1}px)`,
          background: "radial-gradient(circle, rgba(255,180,59,.45), rgba(255,180,59,0) 65%)",
          animation: "float 9s ease-in-out infinite",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper/80 to-transparent" />

      <div
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-10 pt-32 md:px-8 md:pt-36"
        style={{ transform: `translateY(${-par * 0.18}px)`, opacity: Math.max(0, 1 - par / 750) }}
      >
        <div
          className={`flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-ink/70 transition-all duration-1000 ${
            loaded ? "opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="rounded-full border border-ink/20 bg-cream/60 px-3 py-1.5 backdrop-blur">Nº 01 — Spring 2026 almanac</span>
          <span className="status_dot" aria-hidden="true" />
          <span className="hidden sm:inline">Taking new work · Fresno · Clovis · Madera · Central Valley</span>
        </div>

        {/* Kinetic Variable Headline */}
        <h1
          ref={heading}
          className={`font-display mt-6 text-[clamp(3.1rem,10.4vw,10.25rem)] font-[420] leading-[0.9] text-ink ${
            loaded ? "in" : ""
          }`}
        >
          <span className="sr-only">Web design, grown by hand in Clovis.</span>
          <span className="line-mask block" style={{ ["--d" as string]: "80ms" }}>
            <Kinetic text="Web design," start={0} />
          </span>
          <span className="line-mask block" style={{ ["--d" as string]: "200ms" }}>
            <span className="inline-flex items-center gap-[0.18em]">
              <Kinetic text="grown" className="is-italic wonk text-persimmon" start={12} />
              <span className="relative inline-block h-[0.72em] w-[1.7em] overflow-hidden rounded-full border-[3px] border-cream shadow-[0_12px_30px_-12px_rgba(30,43,35,.5)] align-middle mx-1">
                <AmbientVideo {...VIDEO_ORCHARD} className="h-full w-full object-cover" />
              </span>
              <Kinetic text="by" start={19} />
            </span>
          </span>
          <span className="line-mask block" style={{ ["--d" as string]: "320ms" }}>
            <span>
              <Kinetic text="hand " start={22} />
              <Kinetic text="in " className="is-italic wonk" start={27} />
              <Kinetic text="Clovis." start={30} />
            </span>
          </span>
        </h1>

        <div
          className={`mt-8 grid max-w-5xl gap-8 transition-all delay-500 duration-1000 md:grid-cols-[1.2fr_1fr] items-start ${
            loaded ? "opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div>
            <p className="text-lg leading-relaxed text-ink/85 md:text-xl">
              Fast, hand-made websites for Fresno &amp; Central Valley businesses — picked fresh, nothing artificial, yours to keep.{" "}
              <span className="bg-citrus/60 px-1 font-medium">You get my cell number, not a ticket queue.</span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={studio.smsHref}
                data-magnetic="0.3"
                className="group flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-6 text-cream transition-colors hover:bg-persimmon"
                data-cursor="label"
                data-cursor-label="Say hi"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon transition group-hover:bg-ink">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-medium">Text {studio.phoneDisplay}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-cream/60">the builder answers</span>
                </span>
              </a>
              <a
                href="#test"
                className="group flex items-center gap-2 py-3 text-[15px] font-medium underline decoration-persimmon decoration-2 underline-offset-4 text-ink hover:text-persimmon transition-colors"
              >
                run the four-second test
                <span className="transition group-hover:translate-y-1">↓</span>
              </a>
            </div>
          </div>

          {/* Studio Atelier Ticket Card */}
          <div className="hidden sm:flex justify-end">
            <StudioTicketCard />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 pt-12">
          <div className="hidden rounded-2xl border border-cream/40 bg-cream/75 px-4 py-3 font-mono text-[11px] uppercase tracking-[.14em] text-ink/80 backdrop-blur-md md:block shadow-sm">
            <ClovisClock />
          </div>

          <a
            href="#manifesto"
            className={`group absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[.25em] text-ink/70 transition-opacity delay-1000 duration-1000 md:flex ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-ink/20">
              <span
                className="absolute inset-x-0 top-0 h-1/2 bg-persimmon"
                style={{ animation: "scrollhint 1.8s cubic-bezier(.7,0,.3,1) infinite" }}
              />
            </span>
          </a>

          <div className="ml-auto animate-float">
            <RotatingBadge />
          </div>
        </div>
      </div>
    </section>
  );
}

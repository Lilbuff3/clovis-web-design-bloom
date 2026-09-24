import { useEffect, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, SMS_LINK, VIDEO_ORCHARD } from "../lib/data";

function RotatingBadge() {
  return (
    <div className="relative h-32 w-32 md:h-40 md:w-40">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="font-mono" fontSize="15.5" letterSpacing="4.2" fill="#1E2B23">
          <textPath href="#circ">HAND-GROWN · NO PRESERVATIVES · LIVE IN A WEEK ·</textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-persimmon text-cream shadow-lg">
        <span className="font-display wonk text-xl italic md:text-2xl">$500</span>
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
  const status = hour >= 7 && hour < 19 ? "Adam's at the workbench" : hour >= 19 && hour < 23 ? "Adam's winding down — text anyway" : "Adam's asleep — he'll text back at sunrise";
  return (
    <span>
      {time} in Clovis · {status}
    </span>
  );
}

export function Hero() {
  const { y } = usePageScroll();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);
  const par = Math.min(y, 900);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#f8e6b8]">
      {/* Illustration */}
      <div className="absolute inset-0" style={{ transform: `translateY(${par * 0.25}px) scale(${1.04 + par * 0.00012})` }}>
        <img src="/images/hero.jpg" alt="Hand-painted citrus orchard rows leading to the Sierra Nevada foothills at sunrise" className="h-full w-full object-cover object-[30%_bottom] md:object-bottom" />
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-10 pt-32 md:px-8 md:pt-36">
        <div className={`flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-ink/70 transition-all duration-1000 ${loaded ? "opacity-100" : "translate-y-3 opacity-0"}`}>
          <span className="rounded-full border border-ink/20 bg-cream/60 px-3 py-1.5 backdrop-blur">Nº 01 — Spring 2026 almanac</span>
          <span className="hidden sm:inline">Fresno · Clovis · Madera · the whole Valley</span>
        </div>

        <h1 className={`font-display mt-6 text-[clamp(3.1rem,10.4vw,10.25rem)] font-[420] leading-[0.9] text-ink ${loaded ? "in" : ""}`}>
          <span className="line-mask" style={{ ["--d" as string]: "80ms" }}>
            <span>Websites,</span>
          </span>
          <span className="line-mask" style={{ ["--d" as string]: "200ms" }}>
            <span className="flex items-center gap-[0.18em]">
              <em className="wonk font-[380] text-persimmon">grown</em>
              <span className="relative inline-block h-[0.72em] w-[1.7em] overflow-hidden rounded-full border-[3px] border-cream shadow-[0_12px_30px_-12px_rgba(30,43,35,.5)] align-middle">
                <video src={VIDEO_ORCHARD} autoPlay muted loop playsInline poster="/images/hero.jpg" className="h-full w-full object-cover" />
              </span>
              <span>by</span>
            </span>
          </span>
          <span className="line-mask" style={{ ["--d" as string]: "320ms" }}>
            <span>
              hand <em className="wonk font-[380]">in</em> Clovis.
            </span>
          </span>
        </h1>

        <div className={`mt-8 grid max-w-3xl gap-6 transition-all delay-500 duration-1000 md:grid-cols-[1.3fr_1fr] ${loaded ? "opacity-100" : "translate-y-6 opacity-0"}`}>
          <p className="text-lg leading-relaxed text-ink/85 md:text-xl">
            Fast, hand-made websites for Fresno &amp; Central Valley businesses — picked fresh, nothing artificial, yours to keep.{" "}
            <span className="bg-citrus/60 px-1">You get my cell number, not a ticket queue.</span>
          </p>
          <div className="flex flex-col items-start gap-3">
            <a href={SMS_LINK} className="group flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-6 text-cream transition hover:bg-persimmon">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon transition group-hover:bg-ink">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-medium">Text {PHONE_DISPLAY}</span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-cream/60">the builder answers</span>
              </span>
            </a>
            <a href="#test" className="group ml-2 flex items-center gap-2 text-[15px] font-medium underline decoration-persimmon decoration-2 underline-offset-4">
              or run the four-second test
              <span className="transition group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 pt-12">
          <div className="hidden rounded-2xl border border-cream/40 bg-cream/75 px-4 py-3 font-mono text-[11px] uppercase tracking-[.14em] text-ink/80 backdrop-blur-md md:block">
            <ClovisClock />
          </div>
          <div className="ml-auto animate-float">
            <RotatingBadge />
          </div>
        </div>
      </div>
    </section>
  );
}

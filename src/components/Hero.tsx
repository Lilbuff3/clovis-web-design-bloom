import { useEffect, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, PHONE_TEL, SMS_LINK } from "../lib/data";

function RotatingBadge() {
  return (
    <div className="relative h-36 w-36 md:h-44 md:w-44">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="99" fill="#FCF8F0" fillOpacity=".9" />
        <text className="font-mono" fontSize="16.5" fontWeight="500" letterSpacing="3.4" fill="#1E2B23">
          <textPath href="#circ">ONE PAGE · ONE PRICE · ONE WEEK · </textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-persimmon text-cream shadow-lg">
        <span className="font-display wonk text-base italic md:text-xl">$1,500</span>
      </div>
    </div>
  );
}

function ClovisClock() {
  // Set after mount: the page is built once, so a build-time clock never matches the browser's and breaks hydration.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span>Clovis, California</span>;
  const time = now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: false }));
  const status = hour >= 7 && hour < 19 ? "Adam's working" : hour >= 19 && hour < 23 ? "Adam's winding down — text anyway" : "Adam's asleep — he'll text back at sunrise";
  return (
    <span>
      {time} in Clovis · {status}
    </span>
  );
}

export function Hero() {
  const { y } = usePageScroll();
  const par = Math.min(y, 900);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#f8e6b8]">
      {/* Illustration */}
      <div
        className="absolute inset-0 transition-transform duration-[2400ms] ease-[cubic-bezier(.2,.7,.1,1)]"
        style={{ transform: "scale(1)" }}
      >
        <div className="absolute inset-0" style={{ transform: `translateY(${par * 0.25}px) scale(${1.04 + par * 0.00012})` }}>
          <img src="/images/hero.webp" alt="Hand-painted citrus orchard rows leading to the Sierra Nevada foothills at sunrise" className="h-full w-full object-cover object-[30%_bottom] md:object-bottom" />
          {/* Living Hero HTML5 Video Overlay (Auto-plays if hero-sunrise.mp4 is generated) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero.webp"
            className="absolute inset-0 h-full w-full object-cover object-[30%_bottom] opacity-90 transition-opacity duration-1000 md:object-bottom"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          >
            <source src="/videos/hero-sunrise.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper/80 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-10 pt-24 md:px-8 md:pt-36" style={{ transform: `translateY(${-par * 0.18}px)`, opacity: Math.max(0, 1 - par / 750) }}>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[13px] uppercase tracking-[.12em] text-ink opacity-100 md:text-sm">
          <span className="rounded-full border border-ink/20 bg-cream/90 px-3.5 py-2 font-semibold">CLOVIS, CA · (559) 575-3014</span>
          <span className="rounded-full border border-persimmon/30 bg-cream/90 px-3.5 py-2 font-bold text-persimmon-deep">$1,500 STARTER</span>
        </div>

        <h1 className="font-display in mt-4 text-[clamp(2.6rem,8.5vw,7.5rem)] font-[420] leading-[0.92] text-ink">
          <span className="line-mask in" style={{ ["--d" as string]: "80ms" }}>
            <span>Websites,</span>
          </span>
          <span className="line-mask in" style={{ ["--d" as string]: "200ms" }}>
            <span className="flex items-center gap-[0.18em]">
              <em className="wonk font-[380] text-persimmon">built</em>
              <span className="relative inline-block h-[0.72em] w-[1.7em] overflow-hidden rounded-full border-[3px] border-cream shadow-[0_12px_30px_-12px_rgba(30,43,35,.5)] align-middle">
                <img src="/images/hero.webp" alt="Clovis orchard rows at sunrise" className="h-full w-full object-cover" width="120" height="50" loading="eager" decoding="async" />
              </span>
              <span>by</span>
            </span>
          </span>
          <span className="line-mask in" style={{ ["--d" as string]: "320ms" }}>
            <span>
              hand <em className="wonk font-[380]">in</em> Clovis.
            </span>
          </span>
        </h1>

        <div className="mt-6 grid max-w-4xl gap-6 opacity-100 md:grid-cols-[1.4fr_1fr]">
          <p className="max-w-xl text-lg leading-relaxed text-ink md:text-xl">
            I build websites for Central Valley businesses that bring in customers. No templates. No monthly fees. No support tickets. An easy process, and my cell number when you need me.
          </p>
          <div className="flex flex-col items-start gap-5">
            <a href={SMS_LINK} data-magnetic="0.3" className="group relative flex items-center gap-3 rounded-full bg-ink py-2.5 pl-2.5 pr-7 text-cream transition-all duration-300 hover:bg-persimmon hover:shadow-[0_10px_30px_-10px_rgba(238,90,47,.5)]">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-persimmon transition group-hover:bg-ink">
                <span className="absolute inset-0 rounded-full animate-[pulse-ring_2.4s_cubic-bezier(0.45,0,0.55,1)_infinite]" />
                <svg viewBox="0 0 24 24" className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] text-cream/85">Tell me about your business:</span>
                <span className="block text-lg font-semibold">{PHONE_DISPLAY}</span>
                <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-widest text-cream/70">text me directly</span>
              </span>
            </a>
            <a href="#harvest" className="group flex items-center gap-2 rounded-full border border-ink/15 bg-cream/90 px-5 py-3 text-[17px] font-semibold text-ink transition hover:bg-cream">
              See client results
              <span className="transition group-hover:translate-y-1">↓</span>
            </a>
            <a href="#check" className="group flex items-center gap-2 rounded-full border border-ink/15 bg-cream/90 px-5 py-3 text-[17px] font-semibold text-ink transition hover:bg-cream">
              Can AI find you?
              <span className="transition group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 pt-8">
          <div className="hidden rounded-2xl border border-ink/10 bg-cream/90 px-5 py-3.5 font-mono text-sm uppercase tracking-[.1em] text-ink backdrop-blur-md md:block">
            <ClovisClock />
          </div>
          <a href="#test" className="group absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[.25em] text-ink/70 opacity-100 md:flex">
            Scroll
            <span className="relative block h-12 w-px overflow-hidden bg-ink/20">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-persimmon" style={{ animation: "scrollhint 1.8s cubic-bezier(.7,0,.3,1) infinite" }} />
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

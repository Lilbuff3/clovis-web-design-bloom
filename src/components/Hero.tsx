import { useEffect, useState } from "react";
import { PHONE_DISPLAY, smsTo } from "../lib/data";

function ClovisClock() {
  // Set after mount: the page is built once, so a build-time clock never matches the browser's and breaks hydration.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span>Clovis, California · Direct Senior Engineer</span>;
  const time = now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: false }));
  const status =
    hour >= 7 && hour < 19
      ? "I'm working"
      : hour >= 19 && hour < 23
        ? "I'm winding down — text anyway"
        : "I'm asleep — I'll text back at sunrise";
  return (
    <span>
      {time} in Clovis · {status}
    </span>
  );
}

interface MarqueeCard {
  tag: string;
  metric: string;
  sub: string;
  accent: "emerald" | "persimmon" | "white";
  bar?: string;
}

const col1Cards: MarqueeCard[] = [
  {
    tag: "Healthcare Case Study",
    metric: "+40% Physician Referrals",
    sub: "Kidney Specialist Inc. · Madera & Fresno",
    accent: "emerald",
    bar: "88%",
  },
  {
    tag: "Core Web Vitals",
    metric: "0.38s Mobile FCP",
    sub: "Beat AI crawler 1–3s timeouts",
    accent: "emerald",
    bar: "96%",
  },
  {
    tag: "Local Maps 3-Pack",
    metric: "#1 Google Maps 3-Pack",
    sub: '"dumpster rental Fresno" · Big Bros',
    accent: "persimmon",
  },
  {
    tag: "Lighthouse 13.5",
    metric: "100/100 PageSpeed",
    sub: "Zero bloat Astro + React static architecture",
    accent: "emerald",
    bar: "100%",
  },
];

const col2Cards: MarqueeCard[] = [
  {
    tag: "GEO Verification",
    metric: "AI Citation Verified",
    sub: "ChatGPT, Gemini, Claude & Siri 4-directory sync",
    accent: "persimmon",
  },
  {
    tag: "Commercial ROI",
    metric: "+4 Fleet Trucks Added",
    sub: "Direct customer calls & SMS dispatch",
    accent: "emerald",
    bar: "92%",
  },
  {
    tag: "Clinical Security",
    metric: "Zero Patient Data Held",
    sub: "HIPAA-safe clinical web architecture",
    accent: "white",
  },
  {
    tag: "Client Sovereignty",
    metric: "100% Code Ownership",
    sub: "GitHub, domain & analytics in your name",
    accent: "white",
  },
];

const col3Cards: MarqueeCard[] = [
  {
    tag: "Lead Attribution",
    metric: "GA4 AI Attribution",
    sub: "Track ChatGPT, Perplexity & Gemini leads",
    accent: "persimmon",
  },
  {
    tag: "Zero-Risk Build",
    metric: "$0 Before Preview",
    sub: "Working phone preview before you pay a dollar",
    accent: "emerald",
  },
  {
    tag: "Accessibility",
    metric: "WCAG 2.1 AA Verified",
    sub: "Full keyboard & screen reader compliance",
    accent: "white",
  },
  {
    tag: "Studio Model",
    metric: "Direct Senior Engineer",
    sub: "Zero junior account-manager handoffs",
    accent: "persimmon",
  },
];

function ProofCard({ card, duplicate }: { card: MarqueeCard; duplicate?: boolean }) {
  const dotColor =
    card.accent === "emerald"
      ? "bg-[#00FF08]"
      : card.accent === "persimmon"
        ? "bg-[#FF4D1C]"
        : "bg-white";

  return (
    <div
      aria-hidden={duplicate ? "true" : undefined}
      className="rounded-[16px] border border-white/10 bg-[#1E1E1E] p-4 text-left shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-white/70">
          {card.tag}
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      </div>
      <div className="mt-2.5 font-sans text-lg font-medium leading-tight tracking-[-0.03em] text-white sm:text-xl">
        {card.metric}
      </div>
      <p className="mt-1.5 text-[13px] leading-snug text-white/75">{card.sub}</p>
      {card.bar && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#00FF08]"
            style={{ width: card.bar }}
          />
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden bg-[#151515] text-white"
    >
      {/* Preloaded LCP asset at subtle architectural luminosity so T6.10 hero preload is consumed with explicit width/height */}
      <img
        src="/images/hero.webp"
        alt=""
        width={1693}
        height={929}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.03] mix-blend-luminosity"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-5 pt-20 pb-20 md:px-8 lg:grid-cols-12 lg:gap-8 lg:py-20">
        {/* Left Column: Status Bar, Tightly Tracked Display H1, Subcopy, and 8px CTA Row */}
        <div className="flex flex-col justify-between lg:col-span-6 lg:py-2 xl:col-span-6">
          <div className="inline-flex w-fit items-center gap-2.5 rounded-[8px] border border-white/12 bg-[#1E1E1E] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-white/90">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF08] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF08]" />
            </span>
            <ClovisClock />
          </div>

          <div className="mt-5 lg:mt-6">
            <h1 className="font-sans text-[clamp(2.1rem,4vw,3.85rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
              We unite world-class branding, sub-second web engineering, and proof-driven AI search.
            </h1>

            <p className="mt-4 max-w-xl text-[15.5px] leading-snug text-white/80 md:text-[17px] md:leading-relaxed">
              Full-lifecycle digital growth engineered in Clovis, California. You get{" "}
              <strong className="font-semibold text-white">agency-scale brand positioning</strong>,{" "}
              <strong className="font-semibold text-white">custom &lt;0.4s static websites</strong>, and{" "}
              <strong className="font-semibold text-white">four-directory AI search optimization</strong> — working directly with the senior engineer from day one. You own 100% of your code, and for websites, you see a working preview on your phone before you pay a dollar.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?")}
                data-magnetic="0.25"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-[8px] bg-white px-5 py-3.5 font-sans text-[15px] font-semibold text-[#070707] transition hover:bg-[#E03E10] hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-[#00FF08]" />
                Start with a text · {PHONE_DISPLAY}
              </a>

              <a
                href="#check"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-white/80 bg-transparent px-5 py-3.5 font-sans text-[15px] font-medium text-white transition hover:bg-white hover:text-[#070707]"
              >
                Can AI find you? <span aria-hidden="true">→</span>
              </a>

              <a
                href="#stand"
                className="inline-flex min-h-[48px] items-center justify-center rounded-[8px] border border-white/20 bg-[#1E1E1E] px-4 py-3.5 font-mono text-[12px] uppercase tracking-[.12em] text-white/90 transition hover:border-white/50 hover:text-white"
              >
                Build a package
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: 3-Column Vertical Marquee Grid */}
        <div className="relative h-[380px] overflow-hidden sm:h-[480px] lg:col-span-6 lg:h-[620px] xl:col-span-6">
          {/* Top and bottom obsidian fade masks */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#151515] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#151515] to-transparent"
            aria-hidden="true"
          />

          <div className="grid h-full grid-cols-2 gap-3.5 sm:grid-cols-3">
            {/* Column 1: Upward Marquee */}
            <div className="flex flex-col gap-3.5 pb-3.5 animate-marquee-up">
              {[...col1Cards, ...col1Cards].map((card, i) => (
                <ProofCard key={`col1-${i}`} card={card} duplicate={i >= col1Cards.length} />
              ))}
            </div>

            {/* Column 2: Downward Marquee */}
            <div className="flex flex-col gap-3.5 pb-3.5 animate-marquee-down">
              {[...col2Cards, ...col2Cards].map((card, i) => (
                <ProofCard key={`col2-${i}`} card={card} duplicate={i >= col2Cards.length} />
              ))}
            </div>

            {/* Column 3: Upward Marquee (sm and up) */}
            <div className="hidden flex-col gap-3.5 pb-3.5 animate-marquee-up sm:flex">
              {[...col3Cards, ...col3Cards].map((card, i) => (
                <ProofCard key={`col3-${i}`} card={card} duplicate={i >= col3Cards.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

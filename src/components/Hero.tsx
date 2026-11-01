import { useEffect, useRef, useState } from "react";
import { PHONE_DISPLAY, smsTo } from "../lib/data";

function ClovisClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span>Clovis, CA · Working directly with me</span>;
  const time = now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hour12: false }));
  const status =
    hour >= 7 && hour < 19
      ? "I'm working — texts come straight to me"
      : hour >= 19 && hour < 23
        ? "Winding down — text anytime"
        : "In Clovis — I'll reply at sunrise";
  return (
    <span>
      {time} in Clovis · {status}
    </span>
  );
}

const SHOWCASE_PANES = [
  {
    id: "kidney",
    domain: "kidneyspecialistinc.com",
    badge: "100/100",
    img: "/images/kidney-preview.webp",
    alt: "Kidney Specialist Inc. custom website engineered in Clovis",
    caption: "Kidney Specialist Inc. · +40% referrals",
  },
  {
    id: "bigbros",
    domain: "bigbrosdumpster.com",
    badge: "#1 Maps",
    img: "/images/big-bros-preview.webp",
    alt: "Big Bros Dumpster Rentals custom website engineered in Clovis",
    caption: "Big Bros Dumpster · #1 on Google",
  },
];

const PROOF_STRIP = [
  { metric: "0.38s", label: "Mobile load · 100/100 PageSpeed" },
  { metric: "+40%", label: "Referrals · Kidney Specialist Inc." },
  { metric: "#1 Maps", label: "+4 trucks · Big Bros Dumpster" },
  { metric: "100%", label: "Code & domain ownership" },
];

export function Hero() {
  const [frontIdx, setFrontIdx] = useState<number>(0);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const pointerTarget = useRef({ x: -0.1, y: 0.06, scroll: 0 });
  const springCurrent = useRef({ x: -0.1, y: 0.06, scroll: 0 });

  // Smooth damped-spring 3D glide on pointer move, gentle idle breathing, and scroll
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onScroll = () => {
      pointerTarget.current.scroll = Math.min(1, Math.max(0, window.scrollY / 700));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let rafId = 0;
    const tick = (t: number) => {
      const cur = springCurrent.current;
      const tgt = pointerTarget.current;
      const idleX = Math.sin(t * 0.0008) * 0.05;
      const idleY = Math.cos(t * 0.0006) * 0.04;

      cur.x += (tgt.x + idleX - cur.x) * 0.055;
      cur.y += (tgt.y + idleY - cur.y) * 0.055;
      cur.scroll += (tgt.scroll - cur.scroll) * 0.07;

      if (assemblyRef.current) {
        const rotY = -11 + cur.x * 13 - cur.scroll * 9;
        const rotX = 6 - cur.y * 8 + cur.scroll * 6;
        assemblyRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerTarget.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerTarget.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    pointerTarget.current.x = -0.1;
    pointerTarget.current.y = 0.06;
  };

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-[#EAE6DF] pt-28 pb-10 text-[#141311] md:pt-32 md:pb-12"
    >
      {/* Preloaded LCP asset at subtle daylight paper grain so T6.10 hero preload is consumed with explicit width/height */}
      <img
        src="/images/hero.webp"
        alt=""
        width={1693}
        height={929}
        fetchPriority="high"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.02] mix-blend-multiply"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT 7 COLUMNS: Calm, Uncluttered Studio Positioning */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 text-[13.5px] font-medium text-[#4A4742]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0B6E3F] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B6E3F]" />
              </span>
              <ClovisClock />
            </div>

            <h1 className="mt-5 max-w-[15.5ch] font-sans text-[clamp(2.5rem,4.7vw,4.35rem)] font-semibold leading-[0.97] tracking-[-0.04em] text-[#141311]">
              We unite brand positioning, sub-second websites, and AI search.
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#4A4742] md:text-[18px]">
              Work directly with the senior engineer in Clovis, California from day one. You own 100% of your code, and for websites, you see a working preview on your phone before you pay a dollar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?")}
                data-magnetic="0.2"
                className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-[#002FA7] px-7 py-3.5 font-sans text-[15px] font-semibold text-[#F6F4EF] shadow-[0_16px_34px_-10px_rgba(0,47,167,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#141311]"
              >
                <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                Start with a text · {PHONE_DISPLAY}
              </a>

              <a
                href="#check"
                className="inline-flex min-h-[50px] items-center gap-1.5 px-2 py-3 font-sans text-[15px] font-semibold text-[#141311] transition-colors hover:text-[#002FA7]"
              >
                Can AI find you? <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Smooth, Visual 3D Sunlit Architectural Glass Sculpture */}
          <div className="relative hidden min-h-[380px] items-center justify-center lg:col-span-5 lg:flex">
            {/* Soft Sunlit Caustic Glow Behind the 3D Glass */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 42% 48%, rgba(0, 47, 167, 0.22), rgba(200, 62, 20, 0.14) 52%, rgba(184, 125, 30, 0.10) 75%, transparent 100%)",
              }}
            />

            <div
              className="relative flex w-full items-center justify-center"
              style={{ perspective: "1400px" }}
            >
              <div
                ref={assemblyRef}
                className="relative h-[340px] w-full max-w-[430px]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(6deg) rotateY(-11deg)",
                }}
              >
                {/* Rear Plane (-54px Z): Warm Amber & Persimmon Architectural Colorfield Glass */}
                <div
                  aria-hidden="true"
                  style={{ transform: "translate3d(-24px, -20px, -54px)" }}
                  className="absolute inset-x-6 top-4 h-[265px] rounded-2xl border border-white/55 bg-gradient-to-br from-[#C83E14]/75 via-[#B87D1E]/65 to-[#EAE6DF]/70 shadow-[0_24px_50px_-15px_rgba(200,62,20,0.20)] backdrop-blur-md"
                />

                {/* Interactive Client Preview Glass Panes (+36px Front / -12px Middle) */}
                {SHOWCASE_PANES.map((pane, idx) => {
                  const isFront = idx === frontIdx;
                  return (
                    <div
                      key={pane.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect ${pane.caption}`}
                      onClick={() => setFrontIdx(isFront ? (idx + 1) % SHOWCASE_PANES.length : idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFrontIdx(isFront ? (idx + 1) % SHOWCASE_PANES.length : idx);
                        }
                      }}
                      style={{
                        transform: isFront
                          ? "translate3d(0px, 0px, 36px) scale(1)"
                          : "translate3d(26px, 20px, -12px) scale(0.95)",
                        transition:
                          "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, box-shadow 0.5s ease",
                        zIndex: isFront ? 30 : 20,
                      }}
                      className={`group absolute inset-x-2 top-3 cursor-pointer overflow-hidden rounded-2xl border border-white/90 p-3 backdrop-blur-xl ${
                        isFront
                          ? "bg-[#F6F4EF]/90 opacity-100 shadow-[0_32px_70px_-18px_rgba(20,19,17,0.20),inset_0_1px_0_rgba(255,255,255,0.95)]"
                          : "bg-[#DCE6FF]/75 opacity-80 shadow-[0_20px_45px_-15px_rgba(0,47,167,0.22)] hover:opacity-95"
                      }`}
                    >
                      <div className="flex items-center justify-between px-1.5 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#002FA7]" />
                          <span className="h-2 w-2 rounded-full bg-[#C83E14]" />
                          <span className="h-2 w-2 rounded-full bg-[#B87D1E]" />
                        </div>
                        <span className="font-mono text-[11px] font-medium text-[#4A4742]">
                          {pane.domain}
                        </span>
                        <span className="rounded-full bg-[#0B6E3F]/12 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#0B6E3F]">
                          {pane.badge}
                        </span>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-[#141311]/10 bg-[#EAE6DF]">
                        <img
                          src={pane.img}
                          alt={pane.alt}
                          width={1280}
                          height={720}
                          decoding="async"
                          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between px-1.5 pt-0.5 text-[12.5px]">
                        <span className="font-semibold text-[#141311]">
                          {pane.caption}
                        </span>
                        <span className="font-medium text-[#002FA7]">
                          {isFront ? "Click to switch ↻" : "Bring forward"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom of Viewport 1: Quiet Horizontal Proof Strip (Like Bakken & Bæck / Work & Co) */}
      <div className="relative z-10 mx-auto mt-10 w-full max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-6 border-t border-[#141311]/12 pt-6 sm:grid-cols-4">
          {PROOF_STRIP.map((item) => (
            <div key={item.metric}>
              <div className="font-sans text-xl font-semibold tabular-nums tracking-[-0.03em] text-[#141311] sm:text-2xl">
                {item.metric}
              </div>
              <div className="mt-0.5 text-[13px] text-[#4A4742]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

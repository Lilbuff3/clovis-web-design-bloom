import { useEffect, useRef, useState } from "react";

const END = 7200;

function Phone({ children, label, tone }: { children: React.ReactNode; label: string; tone: "slow" | "fast" }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-ink/70">
        <span className={`h-2 w-2 rounded-full ${tone === "fast" ? "bg-leaf" : "bg-ink/30"}`} />
        {label}
      </div>
      <div className="relative w-[250px] rounded-[42px] bg-ink p-[9px] shadow-[0_40px_80px_-30px_rgba(30,43,35,.55)] sm:w-[270px]">
        <div className="relative h-[500px] overflow-hidden rounded-[34px] bg-white sm:h-[540px]">
          <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-ink" />
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBar({ bars = 2 }: { bars?: number }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-ink">
      <span>9:41</span>
      <span className="flex items-end gap-[2px]">
        {[1, 2, 3, 4].map((b) => (
          <span key={b} className={`w-[3px] rounded-sm ${b <= bars ? "bg-ink" : "bg-ink/20"}`} style={{ height: 3 + b * 2 }} />
        ))}
        <span className="ml-1 font-mono text-[9px]">LTE</span>
      </span>
    </div>
  );
}

function SlowSite({ t }: { t: number }) {
  const skeleton = t > 1600;
  const header = t > 2700;
  const banner = t > 3300;
  const left = t > 4000;
  const done = t > 6800;
  return (
    <div className="relative h-full">
      <StatusBar bars={2} />
      <div className="mx-3 mt-3 truncate rounded-lg bg-ink/5 px-3 py-1.5 font-mono text-[10px] text-ink/50">olsenroofing-template.biz</div>
      {!skeleton && (
        <div className="flex h-[70%] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-ink/10 border-t-ink/40" />
        </div>
      )}
      {skeleton && (
        <div className="px-4 pt-3">
          {banner && (
            <div className="mb-3 rounded-lg bg-[#6b5cff] px-3 py-3 text-[11px] font-semibold text-white" style={{ animation: "pop .4s ease" }}>
              🎉 SPRING SALE! Subscribe to our newsletter!!
            </div>
          )}
          {header ? (
            <div className="mb-3 flex items-center justify-between">
              <div className="h-5 w-24 rounded bg-[#2b2b6b]" />
              <div className="space-y-1">
                <div className="h-[2px] w-5 bg-ink/60" />
                <div className="h-[2px] w-5 bg-ink/60" />
                <div className="h-[2px] w-5 bg-ink/60" />
              </div>
            </div>
          ) : (
            <div className="skeleton mb-3 h-5 w-full rounded" />
          )}
          <div className={`mb-3 h-36 rounded-xl ${done ? "bg-gradient-to-br from-[#2b2b6b] to-[#6b5cff]" : "skeleton"}`}>
            {done && <div className="p-4 text-lg font-bold leading-tight text-white">Welcome to Our Website!</div>}
          </div>
          <div className="skeleton mb-2 h-3 w-full rounded" />
          <div className="skeleton mb-2 h-3 w-5/6 rounded" />
          <div className="skeleton mb-2 h-3 w-4/6 rounded" />
          <div className="skeleton mt-4 h-20 w-full rounded-xl" />
        </div>
      )}
      {banner && !left && (
        <div className="absolute right-3 top-40 rounded-full bg-persimmon px-2.5 py-1 font-mono text-[10px] text-white shadow" style={{ animation: "pop .4s ease" }}>
          layout jumped ↕
        </div>
      )}
      {t > 2200 && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-ink/90 p-3 text-[10px] leading-snug text-white" style={{ animation: "pop .4s ease" }}>
          We use cookies 🍪 to improve your experience.
          <div className="mt-2 flex gap-2">
            <span className="rounded bg-white/20 px-2 py-1">Accept</span>
            <span className="rounded bg-white/10 px-2 py-1">Preferences</span>
          </div>
        </div>
      )}
      {left && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-paper/85 px-6 text-center backdrop-blur-[2px]" style={{ animation: "pop .5s ease" }}>
          <div className="text-5xl" style={{ animation: "wiggle 1s ease 2" }}>🚶</div>
          <div className="font-display wonk mt-3 text-3xl italic leading-tight">They left.</div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink/60">gave up at 4.0s</div>
          <div className="mt-4 text-[13px] leading-snug text-ink/70">…and called the next roofer on the list.</div>
          {done && <div className="mt-4 rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] text-ink/60">page finally loaded · 6.8s</div>}
        </div>
      )}
    </div>
  );
}

function FastSite({ t }: { t: number }) {
  const a = t > 250;
  const b = t > 450;
  const c = t > 700;
  const tapped = t > 1300;
  return (
    <div className="relative h-full bg-[#fbf6ea]">
      <StatusBar bars={2} />
      <div className="mx-3 mt-3 truncate rounded-lg bg-ink/5 px-3 py-1.5 font-mono text-[10px] text-ink/50">olsenroofing.com</div>
      {a && (
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-[15px] font-semibold">Olsen Roofing</span>
            <span className="rounded-full bg-leaf px-2.5 py-1 text-[10px] font-medium text-white">Clovis, CA</span>
          </div>
          <h4 className="font-display mt-5 text-[30px] font-medium leading-[1.02] text-ink">
            Roof leaking? <em className="wonk text-persimmon">We're 10 minutes away.</em>
          </h4>
          {b && (
            <p className="mt-3 text-[12.5px] leading-snug text-ink/70">
              Family-owned since 1998. Free same-day estimates across Clovis &amp; Fresno. Se habla español.
            </p>
          )}
          {c && (
            <>
              <div className={`mt-5 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold text-white transition ${tapped ? "scale-95 bg-leaf" : "bg-persimmon"}`}>
                📞 Call now — free estimate
              </div>
              <div className="mt-2 flex items-center justify-center rounded-2xl border border-ink/15 py-3 text-[13px] font-medium">💬 Or send a text</div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {["★ 4.9", "24/7", "Licensed"].map((x) => (
                  <div key={x} className="rounded-xl bg-white px-1 py-2.5 text-[11px] font-semibold shadow-sm">
                    {x}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {tapped && (
        <div className="absolute bottom-4 left-3 right-3 z-20 rounded-2xl bg-leaf p-3 text-white shadow-lg" style={{ animation: "pop .5s ease" }}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/70">1.3s · customer</div>
          <div className="font-display wonk text-xl italic">Tapped “Call now.” ✓</div>
        </div>
      )}
    </div>
  );
}

export function FourSeconds() {
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const raf = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  const run = () => {
    cancelAnimationFrame(raf.current);
    setRunning(true);
    setRan(true);
    const t0 = performance.now();
    const step = (now: number) => {
      const e = now - t0;
      setT(Math.min(e, END));
      if (e < END) raf.current = requestAnimationFrame(step);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoStarted.current) {
          autoStarted.current = true;
          setTimeout(run, 500);
        }
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.min(1, t / END);

  return (
    <section id="test" className="relative bg-paper px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">01 — The four-second rule</div>
            <h2 className="font-display mt-5 text-[clamp(2.6rem,5.6vw,5rem)] font-[420] leading-[0.95]">
              <span className="line-mask"><span>Forty feet away.</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>Phone in one hand.</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "240ms" }}>
                <span><em className="wonk text-persimmon">Four seconds.</em></span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-ink/80" style={{ ["--d" as string]: "200ms" }}>
              A local business doesn't need a “brand platform.” It needs to be found by someone standing on the sidewalk with two bars of signal —
              and understood before their thumb gives up. Everything I build is for those four seconds.
            </p>

            <div className="reveal mt-10 rounded-3xl border border-ink/10 bg-cream p-6" style={{ ["--d" as string]: "300ms" }}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[.18em] text-ink/60">Stopwatch</span>
                <span className={`font-mono text-[11px] uppercase tracking-[.18em] ${t > 4000 ? "text-persimmon" : "text-leaf"}`}>
                  {t === 0 ? "ready" : t < 4000 ? "within patience" : "patience expired"}
                </span>
              </div>
              <div className="font-display mt-2 text-7xl font-[380] tabular-nums md:text-8xl">
                {(t / 1000).toFixed(2)}
                <span className="text-4xl text-ink/40">s</span>
              </div>
              <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-leaf via-citrus to-persimmon" style={{ width: `${pct * 100}%` }} />
                <div className="absolute inset-y-[-4px] w-[2px] bg-ink" style={{ left: `${(4000 / END) * 100}%` }} />
              </div>
              <div className="relative mt-1.5 h-4 font-mono text-[10px] text-ink/50">
                <span className="absolute left-0">0s</span>
                <span className="absolute whitespace-nowrap" style={{ left: `${(4000 / END) * 100}%`, transform: "translateX(-50%)" }}>
                  ↑ 4s: most people bail
                </span>
                <span className="absolute right-0">7s</span>
              </div>
              <button
                onClick={run}
                disabled={running}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-cream transition hover:bg-persimmon disabled:opacity-50"
              >
                {running ? "Racing…" : ran ? "↻ Run the race again" : "▶ Start the race"}
              </button>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-7">
            <div className="relative flex flex-col items-center justify-center gap-10 rounded-[40px] bg-sage/70 px-4 py-12 sm:flex-row sm:items-start sm:gap-6 md:gap-10">
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-citrus/70 blur-2xl" />
              <Phone label="Typical template" tone="slow">
                <SlowSite t={t} />
              </Phone>
              <Phone label="Hand-grown" tone="fast">
                <FastSite t={t} />
              </Phone>
            </div>
            <p className="mt-4 text-center font-mono text-[11px] text-ink/50">
              Simulation on a mid-range phone, two bars of LTE. Try it for real: open either client site below on your phone.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-4">
          {[
            ["Largest Contentful Paint", "< 1.0s", "Google calls anything under 2.5s good."],
            ["Cumulative Layout Shift", "0.0", "Nothing jumps around while it loads."],
            ["Interaction to Next Paint", "< 50ms", "Buttons answer the moment you tap."],
            ["First page to live", "1 wk", "For a one-page site, start to finish."],
          ].map(([k, v, d], i) => (
            <div key={k} className="reveal group bg-cream p-6 transition hover:bg-citrus md:p-8" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <div className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/60">{k}</div>
              <div className="font-display mt-4 text-5xl font-[400] md:text-6xl">{v}</div>
              <div className="mt-3 text-sm text-ink/70">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

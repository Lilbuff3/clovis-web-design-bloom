import { useEffect, useRef, useState } from "react";

const END = 7200;

function Phone({ children, label, tone }: { children: React.ReactNode; label: string; tone: "slow" | "fast" }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.18em] text-[#141311]">
        <span className={`h-2 w-2 ${tone === "fast" ? "bg-[#002FA7]" : "bg-[#C83E14]"}`} />
        {label}
      </div>
      <div className="relative w-[250px] rounded-[42px] border-2 border-[#141311] bg-[#141311] p-[9px] sm:w-[270px]">
        <div className="relative h-[500px] overflow-hidden rounded-[34px] bg-white sm:h-[540px]">
          <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-[#141311]" />
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBar({ bars = 2 }: { bars?: number }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-[#141311]">
      <span>9:41</span>
      <span className="flex items-end gap-[2px]">
        {[1, 2, 3, 4].map((b) => (
          <span key={b} className={`w-[3px] rounded-sm ${b <= bars ? "bg-[#141311]" : "bg-[#DFDBD2]"}`} style={{ height: 3 + b * 2 }} />
        ))}
        <span className="ml-1 font-mono text-[11px]">LTE</span>
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
      <div className="mx-3 mt-3 truncate border border-[#141311] bg-[#EAE6DF] px-3 py-1.5 font-mono text-[11px] text-[#4A4742]">olsenroofing-template.biz</div>
      {!skeleton && (
        <div className="flex h-[70%] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#DFDBD2] border-t-[#141311]" />
        </div>
      )}
      {skeleton && (
        <div className="px-4 pt-3">
          {banner && (
            <div className="mb-3 bg-[#C83E14] px-3 py-3 text-[11px] font-semibold text-white" style={{ animation: "pop .4s ease" }}>
              🎉 SPRING SALE! Subscribe to our newsletter!!
            </div>
          )}
          {header ? (
            <div className="mb-3 flex items-center justify-between">
              <div className="h-5 w-24 bg-[#141311]" />
              <div className="space-y-1">
                <div className="h-[2px] w-5 bg-[#141311]" />
                <div className="h-[2px] w-5 bg-[#141311]" />
                <div className="h-[2px] w-5 bg-[#141311]" />
              </div>
            </div>
          ) : (
            <div className="skeleton mb-3 h-5 w-full" />
          )}
          <div className={`mb-3 h-36 ${done ? "bg-[#002FA7]" : "skeleton"}`}>
            {done && <div className="p-4 text-lg font-bold leading-tight text-white">Welcome to Our Website!</div>}
          </div>
          <div className="skeleton mb-2 h-3 w-full" />
          <div className="skeleton mb-2 h-3 w-5/6" />
          <div className="skeleton mb-2 h-3 w-4/6" />
          <div className="skeleton mt-4 h-20 w-full" />
        </div>
      )}
      {banner && !left && (
        <div className="absolute right-3 top-40 border border-[#141311] bg-[#C83E14] px-2.5 py-1 font-mono text-[11px] text-white" style={{ animation: "pop .4s ease" }}>
          layout jumped ↕
        </div>
      )}
      {t > 2200 && (
        <div className="absolute bottom-3 left-3 right-3 border border-[#141311] bg-[#141311] p-3 text-[11px] leading-snug text-white" style={{ animation: "pop .4s ease" }}>
          We use cookies 🍪 to improve your experience.
          <div className="mt-2 flex gap-2">
            <span className="border border-white px-2 py-1">Accept</span>
            <span className="border border-white px-2 py-1">Preferences</span>
          </div>
        </div>
      )}
      {left && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F6F4EF] px-6 text-center" style={{ animation: "pop .5s ease" }}>
          <div className="text-5xl" style={{ animation: "wiggle 1s ease 2" }}>🚶</div>
          <div className="font-sans mt-3 text-3xl font-bold tracking-[-0.03em] leading-tight text-[#141311]">They left.</div>
          <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[#C83E14]">gave up at 4.0s</div>
          <div className="mt-4 text-[13px] leading-snug text-[#4A4742]">…and called the next roofer on the list.</div>
          {done && <div className="mt-4 border border-[#141311] bg-[#DFDBD2] px-3 py-1 font-mono text-[11px] text-[#141311]">page finally loaded · 6.8s</div>}
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
    <div className="relative h-full bg-white">
      <StatusBar bars={2} />
      <div className="mx-3 mt-3 truncate border border-[#141311] bg-[#EAE6DF] px-3 py-1.5 font-mono text-[11px] text-[#141311]">olsenroofing.com</div>
      {a && (
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[15px] font-bold text-[#141311]">Olsen Roofing</span>
            <span className="bg-[#141311] px-2.5 py-1 text-[11px] font-semibold text-white">Clovis, CA</span>
          </div>
          <h4 className="font-sans mt-5 text-[28px] font-bold tracking-[-0.04em] leading-[1.02] text-[#141311]">
            Roof leaking? <span className="text-[#C83E14]">We're 10 minutes away.</span>
          </h4>
          {b && (
            <p className="mt-3 text-[12.5px] leading-snug text-[#4A4742]">
              Family-owned since 1998. Free same-day estimates across Clovis &amp; Fresno. Se habla español.
            </p>
          )}
          {c && (
            <>
              <div className={`mt-5 flex items-center justify-center gap-2 border-2 border-[#141311] py-3.5 text-[14px] font-semibold text-white transition ${tapped ? "scale-95 bg-[#141311]" : "bg-[#002FA7]"}`}>
                📞 Call now — free estimate
              </div>
              <div className="mt-2 flex items-center justify-center border-2 border-[#141311] py-3 text-[13px] font-semibold text-[#141311]">💬 Or send a text</div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {["★ 4.9", "24/7", "Licensed"].map((x) => (
                  <div key={x} className="border border-[#141311] bg-[#EAE6DF] px-1 py-2.5 text-[11px] font-bold text-[#141311]">
                    {x}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      {tapped && (
        <div className="absolute bottom-4 left-3 right-3 z-20 border-2 border-[#141311] bg-[#0B6E3F] p-3 text-white" style={{ animation: "pop .5s ease" }}>
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-white">1.3s · customer</div>
          <div className="font-sans text-xl font-bold">Tapped “Call now.” ✓</div>
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
    <section id="speed" className="relative border-t-2 border-[#141311] bg-[#EAE6DF] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.02] text-[#141311]">
              <span className="line-mask"><span>Forty feet away.</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>Phone in one hand.</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "240ms" }}>
                <span className="text-[#C83E14]">Four seconds.</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-[#4A4742]" style={{ ["--d" as string]: "200ms" }}>
              Your next customer is forty feet away, with four seconds of attention and two bars left on their phone. If your site isn't up in time, they go back and call the next business on the list. I build websites for this exact moment.
            </p>
            <p className="reveal mt-4 max-w-md text-lg leading-relaxed text-[#4A4742]" style={{ ["--d" as string]: "230ms" }}>
              <span className="font-semibold text-[#141311]">Your own site probably feels fast.</span> You check it at home on Wi-Fi, and your phone saved a copy last time. Customers open it for the first time, on two bars. Turn off your Wi-Fi and open it in a private tab. That's what your customers see.
            </p>

            <div className="reveal mt-10 border-2 border-[#141311] bg-[#F6F4EF] p-7" style={{ ["--d" as string]: "300ms" }}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[.18em] text-[#4A4742]">Stopwatch</span>
                <span className={`font-mono text-[11px] font-bold uppercase tracking-[.18em] ${t > 4000 ? "text-[#C83E14]" : "text-[#141311]"}`}>
                  {t === 0 ? "ready" : t < 4000 ? "within patience" : "patience expired"}
                </span>
              </div>
              <div className="font-sans mt-2 text-7xl font-bold tracking-[-0.04em] tabular-nums text-[#141311] md:text-8xl">
                {(t / 1000).toFixed(2)}
                <span className="text-4xl text-[#4A4742]">s</span>
              </div>
              <div className="relative mt-4 h-3 overflow-hidden border border-[#141311] bg-[#DFDBD2]">
                <div className="absolute inset-y-0 left-0 bg-[#002FA7]" style={{ width: `${pct * 100}%` }} />
                <div className="absolute inset-y-[-4px] w-[2px] bg-[#C83E14]" style={{ left: `${(4000 / END) * 100}%` }} />
              </div>
              <div className="relative mt-1.5 h-4 font-mono text-[11px] font-bold text-[#4A4742]">
                <span className="absolute left-0">0s</span>
                <span className="absolute whitespace-nowrap text-[#C83E14]" style={{ left: `${(4000 / END) * 100}%`, transform: "translateX(-50%)" }}>
                  ↑ 4s: most people bail
                </span>
                <span className="absolute right-0">7s</span>
              </div>
              <button
                onClick={run}
                disabled={running}
                className="mt-6 flex w-full items-center justify-center gap-2 border-2 border-[#141311] bg-[#002FA7] py-4 font-semibold text-white transition hover:bg-[#141311] disabled:opacity-50"
              >
                {running ? "Racing…" : ran ? "↻ Run the race again" : "▶ Start the race"}
              </button>
            </div>
          </div>

          <div ref={ref} className="lg:col-span-7" data-cursor={running ? "Racing" : "Race"} onClick={() => !running && run()}>
            <div className="relative flex flex-col items-center justify-center gap-10 border-2 border-[#141311] bg-[#F6F4EF] px-4 py-12 sm:flex-row sm:items-start sm:gap-6 md:gap-10">
              <Phone label="Typical template" tone="slow">
                <SlowSite t={t} />
              </Phone>
              <Phone label="Custom-built" tone="fast">
                <FastSite t={t} />
              </Phone>
            </div>
            <p className="mt-4 text-center font-mono text-[11px] font-semibold text-[#4A4742]">
              Simulation on a mid-range phone, two bars of LTE. Try it for real: turn off your Wi-Fi and open{" "}
              <a href="https://bigbrosdumpster.com" target="_blank" rel="noopener noreferrer" className="underline decoration-[#C83E14] underline-offset-2 hover:text-[#141311]">
                bigbrosdumpster.com
              </a>{" "}
              on your phone.
            </p>
          </div>
        </div>

        <div className="mt-14 md:mt-16 grid grid-cols-2 border-2 border-[#141311] bg-[#F6F4EF] md:grid-cols-4">
          {[
            ["Things that jump around", "0", "Buttons stay put while the page loads, so nobody taps the wrong one."],
            ["Plugins to update", "0", "Plain hand-written files. Nothing to patch, nothing that breaks on its own."],
            ["Middlemen on your leads", "0", "Calls and texts go straight to your phone."],
            ["First page live in", "1 wk", "For a one-page site, start to finish."],
          ].map(([k, v, d], i) => (
            <div key={k} className={`reveal p-6 md:p-7 ${i > 0 ? "border-t-2 md:border-l-2 md:border-t-0 border-[#141311]" : ""}`} style={{ ["--d" as string]: `${i * 90}ms` }}>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[.16em] text-[#4A4742]">{k}</div>
              <div className="font-sans mt-4 text-5xl font-bold tracking-[-0.04em] text-[#141311] md:text-6xl">{v}</div>
              <div className="mt-3 text-sm text-[#4A4742]">{d}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { getLenis, gsap, markIntroDone } from "../lib/smooth";

const KEY = "cwd-intro-seen";
const words = ["Designing", "Coding", "Optimizing", "Ready"];

export function Preloader() {
  const [skip] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === "1" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  const [gone, setGone] = useState(skip);
  const [count, setCount] = useState(0);
  const [loadMs] = useState(() => Math.max(1, Math.round(performance.now())));
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (skip) {
      markIntroDone();
      return;
    }
    const lenis = getLenis();
    lenis.stop();
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          lenis.start();
          setGone(true);
        },
      });
      tlRef.current = tl;
      tl.from(".pl-fade", { opacity: 0, y: 14, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0)
        .to(obj, { v: 100, duration: 1.35, ease: "power3.inOut", onUpdate: () => setCount(Math.round(obj.v)) }, 0.1)
        .fromTo(".pl-sun", { yPercent: 110 }, { yPercent: 0, duration: 1.35, ease: "power3.inOut" }, 0.1)
        .fromTo(".pl-rays", { rotate: -40, opacity: 0 }, { rotate: 0, opacity: 1, duration: 1.35, ease: "power3.out" }, 0.3)
        .to(".pl-word", { yPercent: -75, duration: 1.2, ease: "steps(3)" }, 0.15)
        .to(".pl-note", { opacity: 1, y: 0, duration: 0.4 }, 1.1)
        .add(() => markIntroDone(), 1.75)
        .to(".pl-content", { yPercent: -12, opacity: 0, duration: 0.7, ease: "power2.in" }, 1.6)
        .to(root.current, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 1.7)
        .fromTo(".pl-curve", { attr: { d: "M0 0 H100 V0 Q50 0 0 0 Z" } }, { attr: { d: "M0 0 H100 V0 Q50 100 0 0 Z" }, duration: 0.5, ease: "power2.in" }, 1.7)
        .to(".pl-curve", { attr: { d: "M0 0 H100 V0 Q50 0 0 0 Z" }, duration: 0.55, ease: "power2.out" }, 2.2);
    }, root);
    return () => ctx.revert();
  }, [skip]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] bg-paper text-ink"
      onClick={() => tlRef.current?.progress(0.62)}
      role="status"
      aria-label="Loading Clovis Web Design"
    >
      <div className="pl-content relative flex h-full flex-col justify-between p-5 md:p-10">
        <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[.2em]">
          <span className="pl-fade">Clovis Web Design</span>
          <span className="pl-fade text-right text-ink/60">
            Custom-built in
            <br />
            Clovis, California
          </span>
        </div>

        {/* Sunrise */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(64vw,420px)] -translate-x-1/2 -translate-y-1/2">
          <div className="relative aspect-[2/1] overflow-hidden">
            <svg viewBox="0 0 200 100" className="pl-rays absolute inset-0 h-full w-full origin-bottom" aria-hidden>
              {Array.from({ length: 11 }).map((_, i) => {
                const a = Math.PI * (i / 10);
                return (
                  <line
                    key={i}
                    x1={100 - Math.cos(a) * 62}
                    y1={100 - Math.sin(a) * 62}
                    x2={100 - Math.cos(a) * 92}
                    y2={100 - Math.sin(a) * 92}
                    stroke="#FFB43B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="pl-sun absolute bottom-0 left-1/2 aspect-square w-[54%] -translate-x-1/2 translate-y-1/2 rounded-full bg-persimmon">
              <span className="absolute left-[22%] top-[18%] h-[18%] w-[18%] rounded-full bg-citrus/70" />
            </div>
          </div>
          <div className="h-[3px] w-full rounded-full bg-ink" />
          <div className="mt-3 flex justify-between px-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="pl-fade h-3 w-3 rounded-full bg-leaf" style={{ opacity: 0.35 + (i % 3) * 0.25 }} />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="pl-fade h-[1.3em] overflow-hidden font-display wonk text-3xl italic md:text-4xl">
              <div className="pl-word">
                {words.map((w) => (
                  <div key={w} className="h-[1.3em]">
                    {w}
                    {w === "Ready" ? "." : "…"}
                  </div>
                ))}
              </div>
            </div>
            <p className="pl-note mt-3 max-w-[260px] translate-y-2 font-mono text-[10.5px] uppercase leading-relaxed tracking-[.14em] text-ink/60 opacity-0">
              The page loaded in {loadMs}ms. Built for speed — tap anywhere to skip.
            </p>
          </div>
          <div className="font-display text-[clamp(5rem,20vw,16rem)] font-[380] leading-[0.8] tabular-nums">
            {count}
            <span className="text-persimmon">%</span>
          </div>
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute left-0 top-full h-[14vh] w-full" aria-hidden>
        <path className="pl-curve fill-paper" d="M0 0 H100 V0 Q50 0 0 0 Z" />
      </svg>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { CHAPTERS, useChapter } from "../lib/smooth";

export function SunMark({ className = "", progress = 1 }: { className?: string; progress?: number }) {
  const c = 2 * Math.PI * 21;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="2" />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="#EE5A2F"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        transform="rotate(-90 24 24)"
      />
      <circle cx="24" cy="25" r="13" fill="#EE5A2F" />
      <path d="M24 12c2.5-5 7-6.5 11-5.5-1.2 4.2-5.6 7-11 5.5z" fill="#2E6A4C" />
    </svg>
  );
}

export function SunCursor() {
  const root = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const el = root.current;
    if (!el) return;

    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='tab'], input, textarea, select"
      );
      el.classList.remove("is-hover", "is-label");
      if (t) {
        const mode = t.dataset.cursor;
        const customLabel = t.dataset.cursorLabel || (mode === "label" ? "" : null);
        if (customLabel) {
          el.classList.add("is-label");
          if (labelRef.current) labelRef.current.textContent = customLabel;
        } else if (mode !== "none") {
          el.classList.add("is-hover");
        }
      }
    };

    const leave = () => el.classList.add("is-hidden");
    const enter = () => el.classList.remove("is-hidden");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={root} className="cursor_component" aria-hidden="true">
      <div className="cursor_ring">
        <span ref={labelRef} className="cursor_label" />
      </div>
    </div>
  );
}

/** Velocity marquee — drifts on its own, speeds up and flips with scroll direction, skews with momentum. */
export function Marquee({ items, className = "", base = 0.7, reverse = false }: { items: string[]; className?: string; base?: number; reverse?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0,
      dir = reverse ? -1 : 1,
      raf = 0,
      lastY = window.scrollY,
      skew = 0;
    const loop = () => {
      const el = track.current;
      if (el) {
        const v = window.scrollY - lastY;
        lastY = window.scrollY;
        if (v > 0.5) dir = reverse ? -1 : 1;
        else if (v < -0.5) dir = reverse ? 1 : -1;
        x -= (base + Math.min(Math.abs(v), 60) * 0.3) * dir;
        const w = el.scrollWidth / 2;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        skew += (Math.max(-8, Math.min(8, v * -0.25)) - skew) * 0.12;
        el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [base, reverse]);
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div ref={track} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display wonk text-2xl italic md:text-3xl">{t}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden>
              <circle cx="12" cy="13" r="7" fill="currentColor" />
              <path d="M12 6c1.4-2.8 4-3.6 6.2-3-.7 2.4-3.1 3.9-6.2 3z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Bottom-left chapter indicator (desktop). */
export function ChapterIndicator() {
  const c = useChapter();
  // Step aside at the footer, where the pill would cover the copyright line.
  const [atFooter, setAtFooter] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);
  const show = c.index > 0 && !atFooter;
  return (
    <div
      className="fixed bottom-6 left-6 z-40 hidden items-center gap-3 rounded-full border border-ink/10 bg-cream/80 py-2 pl-2 pr-4 shadow-[0_10px_30px_-15px_rgba(30,43,35,.4)] backdrop-blur-xl transition-all duration-500 xl:flex"
      style={{ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(20px)" }}
      aria-hidden
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-cream">{String(c.index).padStart(2, "0")}</span>
      <span className="relative h-5 w-28 overflow-hidden">
        <span key={c.id} className="absolute inset-0 font-display text-[15px] leading-5" style={{ animation: "rise .5s cubic-bezier(.2,.8,.2,1)" }}>
          {c.name}
        </span>
      </span>
      <span className="font-mono text-[10px] text-ink/40">/ {String(CHAPTERS.length - 1).padStart(2, "0")}</span>
    </div>
  );
}

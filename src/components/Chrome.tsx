import { useEffect, useRef, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, SMS_LINK } from "../lib/data";
import { CHAPTERS, getLenis, useChapter } from "../lib/smooth";

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

const links = [
  { href: "#test", label: "The test", ids: ["test"] },
  { href: "#harvest", label: "Harvest", ids: ["harvest"] },
  { href: "#season", label: "Process", ids: ["season", "compare"] },
  { href: "#grower", label: "About", ids: ["grower", "rules"] },
  { href: "#stand", label: "Prices", ids: ["stand", "letters"] },
  { href: "#faq", label: "FAQ", ids: ["faq"] },
];

export function Nav() {
  const { y, p } = usePageScroll();
  const chapter = useChapter();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const d = y - lastY.current;
    if (Math.abs(d) > 6) {
      setHidden(d > 0 && y > 500);
      lastY.current = y;
    }
  }, [y]);

  const wasOpen = useRef(false);
  useEffect(() => {
    const l = getLenis();
    if (open) l.stop();
    else if (wasOpen.current) l.start();
    wasOpen.current = open;
  }, [open]);

  const scrolled = y > 40;
  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] md:px-6 md:pt-4"
        style={{ transform: hidden && !open ? "translateY(-130%)" : "none" }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 md:px-4 ${
            scrolled ? "border-ink/10 bg-cream/80 shadow-[0_10px_40px_-20px_rgba(30,43,35,.35)] backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <SunMark className="h-9 w-9 transition-transform duration-700 group-hover:rotate-[360deg]" progress={p} />
            <span className="leading-none">
              <span className="font-display block text-[1.15rem] font-semibold">Clovis Web Design</span>
              <span className="font-mono block text-[10px] uppercase tracking-[.18em] text-ink-soft">hand-grown in Clovis, CA</span>
            </span>
          </a>
          <div className="relative hidden items-center gap-0.5 rounded-full p-1 lg:flex">
            {links.map((l) => {
              const active = (l.ids as readonly string[]).includes(chapter.id);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-2 text-[15px] transition-all duration-300 ${active ? "bg-ink text-cream" : "text-ink/75 hover:bg-ink/5 hover:text-ink"}`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SMS_LINK}
              data-magnetic="0.25"
              className="group hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[15px] font-medium text-cream transition-colors hover:bg-persimmon sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-citrus opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-citrus" />
              </span>
              Text Adam
            </a>
            <button onClick={() => setOpen((o) => !o)} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 lg:hidden" aria-label="Menu" aria-expanded={open}>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-citrus px-6 pb-10 pt-28 lg:hidden ${open ? "" : "pointer-events-none"}`}
        style={{ clipPath: open ? "circle(150% at 92% 4%)" : "circle(0% at 92% 4%)", transition: "clip-path .8s cubic-bezier(.7,0,.2,1)" }}
      >
        <div className="flex flex-col">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display wonk flex items-baseline justify-between border-b border-ink/15 py-3 text-5xl italic transition-all duration-700"
              style={{ transitionDelay: open ? `${200 + i * 60}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(30px)" }}
            >
              {l.label}
              <span className="font-mono text-xs not-italic text-ink/50">0{i + 1}</span>
            </a>
          ))}
        </div>
        <a href={SMS_LINK} className="mt-8 rounded-full bg-ink px-6 py-4 text-center text-lg text-cream">
          Text {PHONE_DISPLAY}
        </a>
      </div>
    </>
  );
}

/** Sun cursor — trails the pointer, swells on links, and shows labels on [data-cursor] zones. */
export function SunCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    let x = innerWidth / 2,
      y = innerHeight / 2,
      tx = x,
      ty = y,
      s = 1,
      ts = 1,
      raf = 0,
      cur: string | null = null,
      visible = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible && dot.current) {
        visible = true;
        dot.current.style.opacity = "1";
      }
      const t = e.target as HTMLElement;
      const zone = t.closest<HTMLElement>("[data-cursor]");
      const l = zone && !t.closest("a,button,input") ? zone.dataset.cursor! : null;
      if (l !== cur) {
        cur = l;
        setLabel(l);
      }
      ts = l ? 5.4 : t.closest("a,button,[data-hover],input") ? 3 : 1;
    };
    const leave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      s += (ts - s) * 0.15;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${s})`;
      if (tag.current) tag.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);
  if (!enabled) return null;
  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-4 w-4 rounded-full bg-persimmon opacity-0 mix-blend-multiply transition-opacity"
        style={{ boxShadow: "0 0 0 6px rgba(255,180,59,.25)" }}
        aria-hidden
      />
      <div ref={tag} className="pointer-events-none fixed left-0 top-0 z-[91]" aria-hidden>
        <span
          className="block font-mono text-[11px] uppercase tracking-[.16em] text-cream transition-all duration-300"
          style={{ opacity: label ? 1 : 0, transform: label ? "scale(1)" : "scale(.5)" }}
        >
          {label}
        </span>
      </div>
    </>
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
  const show = c.index > 0;
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

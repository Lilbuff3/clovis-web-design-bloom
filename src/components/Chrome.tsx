import { useEffect, useRef, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, SMS_LINK } from "../lib/data";

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
        style={{ transition: "stroke-dashoffset .2s linear" }}
      />
      <circle cx="24" cy="25" r="13" fill="#EE5A2F" />
      <path d="M24 12c2.5-5 7-6.5 11-5.5-1.2 4.2-5.6 7-11 5.5z" fill="#2E6A4C" />
    </svg>
  );
}

const links = [
  { href: "#test", label: "The test" },
  { href: "#harvest", label: "Harvest" },
  { href: "#season", label: "Process" },
  { href: "#stand", label: "Prices" },
  { href: "#grower", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { y, p } = usePageScroll();
  const [open, setOpen] = useState(false);
  const scrolled = y > 40;
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 md:px-4 ${
            scrolled ? "border-ink/10 bg-cream/85 shadow-[0_10px_40px_-20px_rgba(30,43,35,.35)] backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <SunMark className="h-9 w-9 transition-transform duration-700 group-hover:rotate-[360deg]" progress={p} />
            <span className="leading-none">
              <span className="font-display block text-[1.15rem] font-semibold">Clovis Web Design</span>
              <span className="font-mono block text-[10px] uppercase tracking-[.18em] text-ink-soft">hand-grown in Clovis, CA</span>
            </span>
          </a>
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[15px] text-ink/80 transition hover:bg-ink/5 hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SMS_LINK}
              className="group hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[15px] font-medium text-cream transition hover:bg-persimmon sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-citrus opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-citrus" />
              </span>
              Text Adam
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 lg:hidden"
              aria-label="Menu"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-citrus px-6 pb-10 pt-28 transition-all duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ clipPath: open ? "circle(150% at 90% 5%)" : "circle(0% at 90% 5%)", transition: "clip-path .7s cubic-bezier(.7,0,.2,1), opacity .3s" }}
      >
        <div className="flex flex-col">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display wonk border-b border-ink/15 py-3 text-5xl italic"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
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

/** A soft sun that trails the pointer and swells over interactive elements. */
export function SunCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      tx = x,
      ty = y,
      s = 1,
      ts = 1,
      raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      ts = t.closest("a,button,[data-hover]") ? 3.2 : 1;
    };
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      s += (ts - s) * 0.14;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${s})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[70] h-4 w-4 rounded-full bg-persimmon mix-blend-multiply"
      style={{ boxShadow: "0 0 0 6px rgba(255,180,59,.25)" }}
      aria-hidden
    />
  );
}

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
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

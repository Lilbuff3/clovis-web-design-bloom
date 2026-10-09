import { useEffect, useRef, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, PHONE_TEL, SMS_LINK } from "../lib/data";

export function SunMark({ className = "", progress = 1 }: { className?: string; progress?: number }) {
  const c = 2 * Math.PI * 21;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
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
  { href: "/services/medical-web-design/", label: "Medical Offices" },
  { href: "/services/contractor-websites/", label: "Contractors" },
  { href: "/#harvest", label: "Client Work" },
  { href: "/#season", label: "Process" },
  { href: "/#stand", label: "Pricing" },
  { href: "/#grower", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const { y, p } = usePageScroll();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = y - lastY.current;
    if (Math.abs(d) > 6) {
      setHidden(d > 0 && y > 500);
      lastY.current = y;
    }
  }, [y]);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    // The open menu covers the page: nothing behind it may take focus, and Escape closes it.
    for (const el of document.body.children) if (!el.contains(headerRef.current)) el.toggleAttribute("inert", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const scrolled = y > 40;
  return (
    <>
      {/* Tabbing into the header brings it back, so keyboard focus never sits on links scrolled out of view. */}
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] md:px-6 md:pt-4"
        style={{ transform: hidden && !open ? "translateY(-130%)" : "none" }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 md:px-4 ${
            scrolled ? "border-ink/10 bg-cream/80 shadow-[0_10px_40px_-20px_rgba(30,43,35,.35)] backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="/#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <SunMark className="h-11 w-11 transition-transform duration-700 group-hover:rotate-[360deg] md:h-12 md:w-12" progress={p} />
            <span className="leading-tight">
              <span className="font-display block text-[1.5rem] font-bold tracking-tight text-ink md:text-[1.8rem]">Clovis Web Design</span>
              <span className="font-mono block text-[11px] uppercase tracking-[.04em] text-ink-soft md:text-xs md:tracking-[.16em]">Web Studio · Clovis &amp; Fresno, CA</span>
            </span>
          </a>
          <div className="relative hidden items-center gap-0.5 rounded-full p-1 xl:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] text-ink/75 transition-all duration-300 hover:bg-ink/5 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SMS_LINK}
              data-magnetic="0.25"
              className="group hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[15px] font-medium text-cream transition-colors hover:bg-persimmon-deep sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-citrus opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-citrus" />
              </span>
              Text Adam
            </a>
            <button ref={menuBtn} onClick={() => setOpen((o) => !o)} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 xl:hidden" aria-label="Menu" aria-expanded={open}>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2px] w-5 bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: above the phone action bar (z-40), below the header that holds its close button. Inert while closed so its links aren't invisible tab stops. */}
      <div
        inert={!open}
        className={`fixed inset-0 z-[45] flex flex-col justify-end bg-citrus px-6 pb-10 pt-28 xl:hidden ${open ? "" : "pointer-events-none"}`}
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

export function Marquee({ items, className = "", reverse = false }: { items: string[]; className?: string; base?: number; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div className={`flex w-max gap-10 whitespace-nowrap animate-marquee ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display wonk text-2xl italic md:text-3xl">{t}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="13" r="7" fill="currentColor" />
              <path d="M12 6c1.4-2.8 4-3.6 6.2-3-.7 2.4-3.1 3.9-6.2 3z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SunCursor() {
  return null;
}

export function ChapterIndicator() {
  return null;
}

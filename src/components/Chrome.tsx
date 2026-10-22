import { useEffect, useRef, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, smsTo } from "../lib/data";

export function SunMark({ className = "", progress = 1 }: { className?: string; progress?: number }) {
  const c = 2 * Math.PI * 21;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="1.5" />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="#FF4D1C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        transform="rotate(-90 24 24)"
      />
      <circle cx="24" cy="24" r="6" fill="#FF4D1C" />
    </svg>
  );
}

const leftNavLinks = [
  { href: "/#harvest", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/packages/", label: "Packages" },
  { href: "/#check", label: "AI Audit" },
];

const mobileMenuLinks = [
  { href: "/#harvest", label: "Client Work", meta: "Case Studies" },
  { href: "/services/", label: "All Services", meta: "4 Core Channels" },
  { href: "/packages/", label: "Packages", meta: "Scoped to ROI" },
  { href: "/services/local-seo-fresno/", label: "Search & AI (GEO)", meta: "Google Maps & AI" },
  { href: "/services/medical-web-design/", label: "Medical Web Design", meta: "Clinical & HIPAA-Safe" },
  { href: "/services/contractor-websites/", label: "Contractor Websites", meta: "Trades & Dispatch" },
  { href: "/#check", label: "Free AI Audit", meta: "Live Citation Check" },
  { href: "/#contact", label: "Contact", meta: "Direct Senior Engineer" },
];

const dockLinks = [
  { href: "/services/", label: "Services" },
  { href: "/services/local-seo-fresno/", label: "Search & AI" },
  { href: "/services/medical-web-design/", label: "Medical" },
  { href: "/services/contractor-websites/", label: "Contractors" },
  { href: "/packages/", label: "Packages" },
  { href: "/#check", label: "AI Check" },
  { href: "/#harvest", label: "Case Studies" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const { y } = usePageScroll();
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
          aria-label="Primary"
          className={`mx-auto grid max-w-7xl grid-cols-2 items-center rounded-[12px] border border-white/10 bg-[#151515]/90 px-3.5 py-2.5 text-white backdrop-blur-xl transition-all duration-500 md:px-5 lg:grid-cols-3 ${
            scrolled ? "shadow-[0_16px_40px_-15px_rgba(0,0,0,0.65)]" : ""
          }`}
        >
          {/* Left column: Desktop navigation links */}
          <div className="hidden items-center gap-1 lg:flex">
            {leftNavLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className=" whitespace-nowrap rounded-[8px] px-3 py-2 font-mono text-[12px] uppercase tracking-[.08em] text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Center column: Editorial wordmark in Fraunces */}
          <div className="flex items-center justify-start lg:justify-center">
            <a
              href="/#top"
              className="group inline-flex items-center gap-2.5 text-left lg:text-center"
              onClick={() => setOpen(false)}
            >
              <span className="font-display text-2xl font-normal tracking-[-0.02em] text-white transition-opacity group-hover:opacity-85 md:text-[1.75rem]">
                Clovis Web Design
              </span>
            </a>
          </div>

          {/* Right column: Contact link + 8px Solid White CTA + Mobile Hamburger */}
          <div className="flex items-center justify-end gap-2.5">
            <a
              href="/#contact"
              className="hidden rounded-[8px] px-3 py-2 font-mono text-[12px] uppercase tracking-[.08em] text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white lg:inline-flex"
            >
              Contact
            </a>
            <a
              href={smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?")}
              data-magnetic="0.25"
              className="group hidden items-center gap-2 rounded-[8px] bg-white px-4 py-2 font-mono text-[13px] font-medium uppercase tracking-[.08em] text-[#070707] transition-colors duration-200 hover:bg-[#E03E10] hover:text-white sm:flex"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF08] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF08]" />
              </span>
              Text me
            </a>
            <button
              ref={menuBtn}
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/15 bg-[#1E1E1E] text-white lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-white transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-white transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Floating Bottom Dark-Glass Dock (Desktop md:flex) */}
      <nav
        aria-label="Quick navigation dock"
        className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-[12px] border border-white/12 bg-[#222222]/85 p-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md md:flex"
      >
        {dockLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-[8px] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[.06em] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {l.label}
          </a>
        ))}
        <a
          href={smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?")}
          className="ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-white px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[.06em] text-[#070707] transition-colors hover:bg-[#E03E10] hover:text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FF08]" />
          Text me
        </a>
      </nav>

      {/* Mobile menu: Deep Obsidian #151515 overlay above phone action bar (z-40), below header. Inert while closed. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-[45] flex flex-col justify-between overflow-y-auto bg-[#151515] px-6 pb-10 pt-24 text-white lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        style={{
          clipPath: open ? "circle(150% at 92% 4%)" : "circle(0% at 92% 4%)",
          transition: "clip-path .65s cubic-bezier(.7,0,.2,1)",
        }}
      >
        <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {mobileMenuLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between py-3.5 text-2xl font-medium tracking-[-0.03em] text-white transition-all duration-500 hover:text-[#FF4D1C] sm:text-3xl"
              style={{
                transitionDelay: open ? `${120 + i * 40}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(20px)",
              }}
            >
              <span>{l.label}</span>
              <span className="font-mono text-[11px] uppercase tracking-[.1em] text-white/70">{l.meta}</span>
            </a>
          ))}
        </div>
        <a
          href={smsTo("Hi Adam, I was looking through your site and wanted to talk about growing my business online.")}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-4 text-center font-sans text-base font-semibold text-[#070707] transition-colors hover:bg-[#E03E10] hover:text-white"
        >
          <span className="h-2 w-2 rounded-full bg-[#00FF08]" />
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
            <span className="font-sans text-xl font-medium tracking-[-0.03em] md:text-2xl">{t}</span>
            <span className="h-2 w-2 shrink-0 rotate-45 bg-[#FF4D1C]" aria-hidden="true" />
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

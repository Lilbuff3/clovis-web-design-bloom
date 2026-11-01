import { useEffect, useRef, useState } from "react";
import { usePageScroll } from "../lib/hooks";
import { PHONE_DISPLAY, smsTo } from "../lib/data";

export function SunMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="#F6F4EF" stroke="#141311" strokeWidth="2.5" />
      <rect x="7" y="7" width="16.5" height="34" rx="4" fill="#002FA7" />
      <rect x="25.5" y="7" width="15.5" height="16" rx="4" fill="#C83E14" />
      <rect x="25.5" y="25" width="15.5" height="16" rx="4" fill="#B87D1E" />
    </svg>
  );
}

const navLinks = [
  { href: "/#harvest", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/packages/", label: "Packages" },
  { href: "/#check", label: "AI Check" },
  { href: "/#contact", label: "Contact" },
];

const mobileMenuLinks = [
  { href: "/#harvest", label: "Client Work", meta: "Case Studies" },
  { href: "/services/", label: "All Services", meta: "5 Core Channels" },
  { href: "/packages/", label: "Packages", meta: "Scoped to ROI" },
  { href: "/services/local-seo-fresno/", label: "Search & AI (GEO)", meta: "Google Maps & AI" },
  { href: "/services/medical-web-design/", label: "Medical Web Design", meta: "Clinical & HIPAA-Safe" },
  { href: "/services/contractor-websites/", label: "Contractor Websites", meta: "Trades & Dispatch" },
  { href: "/#check", label: "Free AI Check", meta: "Live Citation Check" },
  { href: "/#contact", label: "Contact", meta: "Direct Senior Engineer" },
];

function normalizePath(p: string): string {
  if (!p) return "";
  const clean = p.split(/[?#]/)[0];
  return clean.endsWith("/") ? clean : `${clean}/`;
}

export function Nav({ currentPath = "" }: { currentPath?: string }) {
  const { y } = usePageScroll();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activePath, setActivePath] = useState(() => normalizePath(currentPath));
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!currentPath && typeof window !== "undefined") {
      setActivePath(normalizePath(window.location.pathname));
    } else if (currentPath) {
      setActivePath(normalizePath(currentPath));
    }
  }, [currentPath]);

  useEffect(() => {
    const d = y - lastY.current;
    if (Math.abs(d) > 8) {
      setHidden(d > 0 && y > 620);
      lastY.current = y;
    }
  }, [y]);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
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

  const scrolled = y > 24;
  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:px-8 md:pt-4"
        style={{ transform: hidden && !open ? "translateY(-130%)" : "none" }}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 text-[#141311] transition-all duration-300 md:px-6 ${
            scrolled
              ? "border border-[#141311]/12 bg-[#F6F4EF]/90 shadow-[0_14px_34px_-12px_rgba(20,19,17,0.10)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* Left: Studio Wordmark */}
          <a
            href="/#top"
            aria-current={activePath === "/" ? "page" : undefined}
            className="group inline-flex items-center gap-2.5 text-left"
            onClick={() => setOpen(false)}
          >
            <SunMark className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="font-sans text-[17px] font-semibold tracking-[-0.03em] text-[#141311]">
              Clovis Web Design
            </span>
          </a>

          {/* Center: Quiet Editorial Links */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => {
              const isRoute = !l.href.includes("#");
              const isExact = isRoute && activePath === l.href;
              const isSection =
                (l.href === "/services/" && activePath.startsWith("/services/")) ||
                (l.href === "/#harvest" && activePath.startsWith("/case-studies/"));
              const isActive = isExact || isSection;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isExact ? "page" : isSection ? "true" : undefined}
                  className={`font-sans text-[14.5px] transition-colors duration-200 ${
                    isActive
                      ? "font-bold text-[#002FA7] underline decoration-[#002FA7] decoration-2 underline-offset-8"
                      : "font-medium text-[#4A4742] hover:text-[#141311]"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* Right: Smooth Pill CTA + Mobile Trigger */}
          <div className="flex items-center gap-2.5">
            <a
              href={smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?")}
              className="hidden items-center gap-2 rounded-full bg-[#141311] px-4 py-2 font-sans text-[13.5px] font-medium text-[#F6F4EF] transition-all duration-200 hover:bg-[#002FA7] sm:inline-flex"
            >
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
              Start with a text
            </a>
            <button
              ref={menuBtn}
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#141311]/15 bg-[#F6F4EF] text-[#141311] lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-[1.5px] w-4 bg-[#141311] transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-4 bg-[#141311] transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: Smooth Sunlit Studio Overlay */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-0 z-[45] flex flex-col justify-between overflow-y-auto bg-[#EAE6DF] px-5 pb-24 pt-24 text-[#141311] lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        style={{
          clipPath: open ? "circle(150% at 92% 4%)" : "circle(0% at 92% 4%)",
          transition: "clip-path .55s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="flex flex-col divide-y divide-[#141311]/12 rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] p-2">
          {mobileMenuLinks.map((l, i) => {
            const isExact = !l.href.includes("#") && activePath === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isExact ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-baseline justify-between rounded-xl px-4 py-3.5 text-lg font-semibold tracking-[-0.025em] transition-colors ${
                  isExact
                    ? "bg-[#002FA7]/8 text-[#002FA7]"
                    : "text-[#141311] hover:bg-[#EAE6DF]"
                }`}
                style={{
                  transitionDelay: open ? `${60 + i * 25}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(10px)",
                }}
              >
                <span>{l.label}</span>
                <span className="font-mono text-[11px] uppercase tracking-[.08em] text-[#4A4742]">{l.meta}</span>
              </a>
            );
          })}
        </div>
        <a
          href={smsTo("Hi Adam, I was looking through your site and wanted to talk about growing my business online.")}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#002FA7] px-6 py-4 text-center font-sans text-base font-semibold text-[#F6F4EF] transition-colors hover:bg-[#141311]"
        >
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
          Text {PHONE_DISPLAY}
        </a>
      </div>
    </>
  );
}

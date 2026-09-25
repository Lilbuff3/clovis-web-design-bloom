import { useEffect, useState } from "react";
import { navLinks, studio } from "../data/content";
import { Button } from "./primitives";

export function useClovisTime() {
  const getInfo = () => {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Los_Angeles",
    }).format(now);
    const hour = Number(
      now.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        hour12: false,
      })
    );
    const status =
      hour >= 7 && hour < 19
        ? "at the workbench"
        : hour >= 19 && hour < 23
          ? "winding down — text anyway"
          : "asleep — texts answered at sunrise";
    return { time, status };
  };
  const [info, setInfo] = useState(getInfo);
  useEffect(() => {
    const id = setInterval(() => setInfo(getInfo()), 15000);
    return () => clearInterval(id);
  }, []);
  return info;
}

export function LogoMark({ size = 30 }: { size?: number }) {
  // Citrus-slice mark: 8 segments, one "bitten" in accent — the hand-cut detail
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo_mark">
      <circle cx="20" cy="20" r="19" fill="var(--_color---highlight)" />
      <circle cx="20" cy="20" r="15.5" fill="var(--_color---surface)" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d="M20 20 L20 6.5 A13.5 13.5 0 0 1 29.55 10.45 Z"
          fill={i === 0 ? "var(--_color---accent)" : "var(--_color---highlight)"}
          opacity={i === 0 ? 1 : 0.85}
          transform={`rotate(${i * 45} 20 20)`}
          stroke="var(--_color---surface)"
          strokeWidth="1.4"
        />
      ))}
      <circle cx="20" cy="20" r="2" fill="var(--_color---surface)" />
    </svg>
  );
}

export function Header({
  isBoostPage = false,
  isSubPage = false,
  onNavigate,
}: {
  isBoostPage?: boolean;
  /** Any page other than the homepage and /boost: links go back to the homepage, no Boost banner. */
  isSubPage?: boolean;
  onNavigate?: (path: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { time, status } = useClovisTime();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const offHome = isBoostPage || isSubPage;
  const resolveHref = (href: string) => {
    if (offHome && href.startsWith("#")) return `/${href}`;
    return href;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (!onNavigate) return;
    e.preventDefault();
    if (offHome) {
      onNavigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "#top");
    }
  };

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (offHome) {
      if (isBoostPage && href === "/boost") {
        e.preventDefault();
        const el = document.getElementById("boost-calc") || document.getElementById("boost");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (onNavigate) {
        e.preventDefault();
        onNavigate(resolveHref(href));
      }
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header className={`navbar_component ${isBoostPage ? "is-boost-header" : ""} ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "is-open" : ""}`}>
      {isBoostPage && (
        <div className="boost-page_banner">
          <div className="padding-global">
            <div className="container-large boost-page_banner-inner">
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate("/") : (window.location.href = "/"))}
                className="boost-back-btn text-style-eyebrow"
              >
                ← Explore Full Studio Portfolio
              </button>
              <div className="boost-banner_badge text-style-eyebrow">
                <span className="status_dot" aria-hidden="true" /> Live Conversion Engine · Clovis, CA
              </div>
              <a href={studio.phoneHref} className="boost-banner_phone text-style-eyebrow font-mono">
                Direct: {studio.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="padding-global">
        <div className="container-large">
          <div className="navbar_inner">
            <a
              href={offHome ? "/" : "#top"}
              onClick={handleLogoClick}
              className="navbar_logo"
              aria-label={`${studio.name} — home`}
              data-cursor="hover"
            >
              <LogoMark />
              <span className="navbar_logo-text">
                Clovis<span className="navbar_logo-sub">Web Design</span>
              </span>
            </a>

            <nav className="navbar_menu" aria-label="Primary">
              <ul className="navbar_links" role="list">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={resolveHref(l.href)}
                      onClick={(e) => handleLinkClick(l.href, e)}
                      className={`navbar_link ${l.isBoost ? "is-boost-link" : ""}`}
                    >
                      <span className="navbar_link-inner" data-text={l.label}>
                        {l.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="navbar_actions">
              <span
                className="navbar_time text-style-eyebrow"
                title={`Local time in Clovis: ${time} · Adam is ${status}`}
                aria-label={`Local time in Clovis: ${time}, Adam is ${status}`}
              >
                <span className="status_dot" aria-hidden="true" /> Clovis {time}
                <span className="navbar_time-status text-color-muted"> · {status}</span>
              </span>
              <Button label="Text Adam" href={studio.smsHref} variant="primary" showIcon={false} className="navbar_cta" />
              <button
                type="button"
                className="navbar_burger"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className="navbar_overlay" hidden={!open}>
        <nav aria-label="Mobile">
          <ul role="list" className="navbar_overlay-links">
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={resolveHref(l.href)}
                  onClick={(e) => {
                    setOpen(false);
                    handleLinkClick(l.href, e);
                  }}
                  className="heading-style-h2"
                >
                  <span className="text-style-eyebrow">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="navbar_overlay-foot">
          <a href={studio.smsHref} className="button is-accent">
            Text {studio.phoneDisplay}
          </a>
          <span className="text-style-eyebrow text-color-muted">{studio.location} · {time}</span>
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from "react";
import { studio } from "../data/content";
import { buildSmsHref } from "../utils/sms";

export function MobileTextBar({
  smsMessage = "Hi Adam — saw your site, wanted to ask about a website for my business.",
}: {
  smsMessage?: string;
} = {}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide bar when user reaches the contact section, boost closing, or footer to prevent overlap
    const contactEl = document.getElementById("contact");
    const closingEl = document.getElementById("boost-closing");
    const footerEl = document.querySelector(".footer_component");

    if (!contactEl && !closingEl && !footerEl) return;

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        const contactTop = contactEl?.getBoundingClientRect().top ?? Infinity;
        const closingTop = closingEl?.getBoundingClientRect().top ?? Infinity;
        const footerTop = footerEl?.getBoundingClientRect().top ?? Infinity;
        const isNearBottom =
          contactTop < window.innerHeight ||
          closingTop < window.innerHeight ||
          footerTop < window.innerHeight;
        setVisible(!isNearBottom);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isNearBottom = entries.some((entry) => entry.isIntersecting);
        setVisible(!isNearBottom);
      },
      { threshold: 0.02 }
    );

    if (contactEl) observer.observe(contactEl);
    if (closingEl) observer.observe(closingEl);
    if (footerEl) observer.observe(footerEl);

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      className={`mobile_text_bar ${visible ? "is-visible" : "is-hidden"}`}
      aria-label="Direct mobile contact"
    >
      <div className="mobile_text_bar-inner">
        <a
          href={buildSmsHref(studio.smsHref, smsMessage)}
          className="mobile_text_bar-sms"
          aria-label={`Text Adam at ${studio.phoneDisplay}`}
        >
          <span className="mobile_text_bar-status">
            <span className="status_dot" aria-hidden="true" />
            <span className="mobile_text_bar-label">
              Text Adam <span className="mobile_text_bar-phone">· {studio.phoneDisplay}</span>
            </span>
          </span>
          <span className="mobile_text_bar-send" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H5.5M13 3V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
        <a
          href={studio.phoneHref}
          className="mobile_text_bar-call"
          aria-label={`Call Adam at ${studio.phoneDisplay}`}
          title="Call Adam"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}

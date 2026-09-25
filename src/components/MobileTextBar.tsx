import { useEffect, useState } from "react";
import { studio, texts } from "../data/content";
import { buildSmsHref } from "../utils/sms";

export function MobileTextBar({ smsMessage = texts.hello }: { smsMessage?: string } = {}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide the bar while a page's own closing call to action or the footer is on screen, so they don't overlap.
    // Entries only report targets that changed, so remember which are on screen.
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target);
        setVisible(onScreen.size === 0);
      },
      { threshold: 0.02 }
    );
    document.querySelectorAll("#contact, #boost-closing, #medical-closing, footer").forEach((el) => observer.observe(el));
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

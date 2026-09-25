import { medical, navLinks, studio, texts } from "../data/content";
import { buildSmsHref } from "../utils/sms";
import { LogoMark, useClovisTime } from "./Header";

export function Footer({ smsMessage = texts.hello }: { smsMessage?: string } = {}) {
  const { time, status } = useClovisTime();
  return (
    <footer className="footer_component">
      <div className="padding-global">
        <div className="container-large">
          <div className="footer_top">
            <div className="footer_brand">
              <LogoMark size={44} />
              <p className="text-size-large">
                Hand-built websites for businesses across Fresno &amp; the Central Valley. Designed, written and coded in Clovis.
              </p>
            </div>
            <nav className="footer_col" aria-label="Footer">
              <h2 className="text-style-eyebrow">Sitemap</h2>
              <ul role="list">
                {/* This footer is only used off the homepage, so its #section links go back there. */}
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href.startsWith("#") ? `/${l.href}` : l.href} className="footer_link">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={medical.path} className="footer_link">
                    Medical practices
                  </a>
                </li>
              </ul>
            </nav>
            <div className="footer_col">
              <h2 className="text-style-eyebrow">Reach Adam</h2>
              <ul role="list">
                <li>
                  <a href={buildSmsHref(studio.smsHref, smsMessage)} className="footer_link">
                    Text {studio.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={studio.phoneHref} className="footer_link">
                    Call
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer_col">
              <h2 className="text-style-eyebrow">Serving</h2>
              <p className="text-color-muted">Clovis · Fresno · Madera · Sanger · Selma · Visalia · the whole Valley</p>
            </div>
          </div>

          <div className="footer_wordmark" aria-hidden="true">
            Clovis<span className="text-italic-serif">.</span>
          </div>

          <div className="footer_bottom text-style-eyebrow">
            <span>© {new Date().getFullYear()} {studio.name}</span>
            <span>
              <span className="status_dot" aria-hidden="true" /> Clovis, CA · {time} ({status})
            </span>
            <a href="#top" className="footer_top-link">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

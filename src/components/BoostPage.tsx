import { useEffect } from "react";
import { studio, boostCases, boostFaqs } from "../data/content";
import { Header } from "./Header";
import { Footer } from "./BespokeFooter";
import { MobileTextBar } from "./MobileTextBar";
import { Boost } from "./Boost";
import { ChapterRail, BOOST_CHAPTERS } from "./ChapterRail";
import { Button, Cursor, Reveal, ScrollProgress } from "./primitives";
import { getLenis } from "../lib/smooth";

export function BoostPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  useEffect(() => {
    const rawHash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (rawHash && rawHash !== "top") {
      setTimeout(() => {
        const el = document.getElementById(rawHash);
        if (el) {
          try {
            const lenis = getLenis();
            lenis.start();
            lenis.scrollTo(el, { offset: -8, duration: 1.2 });
          } catch {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    document.title = "Conversion Boost™ — Clovis Web Design | Mobile Speed & Local SEO Audit";
  }, []);

  return (
    <div className="page-wrapper is-boost-page">
      <a href="#boost-calc" className="skip-link">
        Skip to Boost calculator
      </a>

      {/* Webflow Bespoke Immersion Elements */}
      <ScrollProgress />
      <Cursor />
      <ChapterRail chapters={BOOST_CHAPTERS} />

      {/* Header with integrated top banner & client routing */}
      <Header isBoostPage={true} onNavigate={onNavigate} />

      <main id="main" className="main-wrapper">
        {/* Boost Page Specific Hero */}
        <section id="boost-top" className="section_boost-hero" aria-labelledby="boost-hero-heading">
          <div className="padding-global padding-section-small">
            <div className="container-large">
              <div className="boost-hero_inner">
                <div className="boost-hero_meta text-style-eyebrow">
                  <span>Special Project · Central Valley Businesses</span>
                  <span className="status_dot" aria-hidden="true" />
                  <span>$500 launch price</span>
                </div>

                <h1 id="boost-hero-heading" className="heading-style-display boost-hero_heading">
                  Stop losing local calls to a{" "}
                  <span className="text-italic-serif text-color-accent">four-second lag.</span>
                </h1>

                <p className="text-size-large boost-hero_lede">
                  Most local websites in Fresno and Clovis are built on bloated 5MB templates that freeze on two bars of
                  cell reception. I hand-build ultra-fast sites that score <strong>100/100 on Google PageSpeed</strong>,
                  put your phone number right under the customer’s thumb, and pay for themselves in days.
                </p>

                <div className="boost-hero_actions">
                  <a href="#boost-calc" className="button is-accent" data-cursor="hover">
                    <span>Launch the Loss Calculator ↓</span>
                  </a>
                  <Button
                    label="Text Adam Directly"
                    href={studio.smsHref}
                    variant="ghost"
                    showIcon={false}
                  />
                  <button
                    type="button"
                    onClick={() => onNavigate("/")}
                    className="text-link boost-explore-link text-size-small"
                    data-cursor="hover"
                  >
                    View complete studio portfolio &amp; case studies →
                  </button>
                </div>

                {/* Instant Authority Badges */}
                <div className="boost-hero_badges">
                  <div className="boost-badge-card">
                    <span className="boost-badge-num font-mono">100/100</span>
                    <span className="boost-badge-label text-size-small">PageSpeed Mobile on All Client Sites</span>
                  </div>
                  <div className="boost-badge-card">
                    <span className="boost-badge-num font-mono">&lt; 0.8s</span>
                    <span className="boost-badge-label text-size-small">Full Interactive Paint on 2 Bars LTE</span>
                  </div>
                  <div className="boost-badge-card">
                    <span className="boost-badge-num font-mono">7 Days</span>
                    <span className="boost-badge-label text-size-small">From Recorded Conversation to Live Site</span>
                  </div>
                  <div className="boost-badge-card">
                    <span className="boost-badge-num font-mono">$500</span>
                    <span className="boost-badge-label text-size-small">Launch Price · You Own Everything</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Standalone Boost Engine (Calculator + Teardown + 5 Pillars) */}
        <Boost isStandalone={true} onNavigate={onNavigate} />

        {/* Quick Social Proof Strip from Real Central Valley Clients */}
        <section id="boost-proof" className="section_boost-proof">
          <div className="padding-global padding-section-small">
            <div className="container-large">
              <div className="boost-proof_header text-center">
                <span className="text-style-eyebrow text-color-accent">Verified Central Valley Results</span>
                <h2 className="heading-style-h2">What happens when your site loads instantly.</h2>
              </div>

              <div className="boost-proof_grid">
                {boostCases.map((c) => (
                  <Reveal key={c.id} className="boost-proof_card">
                    <div className="boost-proof_metrics">
                      <div className="boost-proof_metric-item">
                        <span className="boost-proof_val font-mono">{c.afterMetrics.score}/100</span>
                        <span className="boost-proof_tag text-size-small">PageSpeed</span>
                      </div>
                      <div className="boost-proof_metric-item">
                        <span className="boost-proof_val font-mono">{c.afterMetrics.loadTime}</span>
                        <span className="boost-proof_tag text-size-small">Mobile Load</span>
                      </div>
                      <div className="boost-proof_metric-item">
                        <span className="boost-proof_val font-mono text-color-highlight">
                          {c.stats[0].value}
                        </span>
                        <span className="boost-proof_tag text-size-small">{c.stats[0].label}</span>
                      </div>
                    </div>

                    <blockquote className="boost-proof_quote text-size-large">
                      “{c.quote}”
                    </blockquote>

                    <div className="boost-proof_author">
                      <div className="boost-proof_author-name font-medium">{c.quoteBy}</div>
                      <div className="boost-proof_author-role text-size-small text-color-muted">
                        {c.quoteRole} · {c.client}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* High-Intent FAQ */}
        <section id="boost-faq" className="section_boost-faq">
          <div className="padding-global padding-section-small">
            <div className="container-large">
              <div className="boost-faq_header">
                <span className="text-style-eyebrow text-color-accent">Common Questions</span>
                <h2 className="heading-style-h3">Everything you need to know about the Boost build.</h2>
              </div>

              <div className="boost-faq_grid">
                {boostFaqs.slice(0, 4).map((f) => (
                  <div key={f.q} className="boost-faq_item">
                    <h3 className="heading-style-h4">{f.q}</h3>
                    <p className="text-color-muted text-size-small">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* High-Impact Closing Intake & Conversion Section */}
        <section id="boost-closing" className="section_boost-closing">
          <div className="padding-global padding-section-medium">
            <div className="container-large">
              <Reveal className="boost_closing-card">
                <div className="boost_closing-inner">
                  <div className="boost_closing-scarcity text-style-eyebrow">
                    <span className="status_dot" aria-hidden="true" />
                    <span>$500 for the first five Central Valley businesses</span>
                  </div>

                  <h2 className="heading-style-h2 boost_closing-heading">
                    Stop leaking callers. Get a site that{" "}
                    <span className="text-italic-serif text-color-accent">pays for itself.</span>
                  </h2>

                  <p className="text-size-large boost_closing-lede text-color-muted">
                    $500 one-off launch build. Live in a week. You own the code, domain, and hosting on day one.
                    Zero monthly hostage fees, zero lock-in, and guaranteed 100/100 PageSpeed.
                  </p>

                  <div className="boost_closing-actions">
                    <a
                      href={studio.smsHref}
                      className="button is-accent"
                      data-cursor="label"
                      data-cursor-label="Text"
                    >
                      <span>Text Adam at {studio.phoneDisplay}</span>
                    </a>
                    <a
                      href="#boost-teardown"
                      className="button is-light"
                      data-cursor="hover"
                    >
                      <span>Get Free 3-Min Video Teardown First ↑</span>
                    </a>
                    <a
                      href={studio.phoneHref}
                      className="boost_closing-phone text-style-eyebrow font-mono"
                    >
                      Or call directly: {studio.phoneDisplay}
                    </a>
                  </div>

                  <div className="boost_closing-guarantees">
                    <div className="boost_guar-pill">✓ 100/100 Mobile PageSpeed</div>
                    <div className="boost_guar-pill">✓ 100% Hand-Crafted Code</div>
                    <div className="boost_guar-pill">✓ English + Español Ready</div>
                    <div className="boost_guar-pill">✓ Code in Your Name Day 1</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileTextBar smsMessage="Hi, Adam! Saw the Conversion Boost page. I'd like to check how fast my website can be built and see your schedule." />
    </div>
  );
}

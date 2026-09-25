import { cases, letters, medical, studio } from "../data/content";
import { buildSmsHref } from "../utils/sms";
import { Footer } from "./BespokeFooter";
import { Header } from "./Header";
import { MobileTextBar } from "./MobileTextBar";
import { Button, Reveal, ScrollProgress, SectionHeader } from "./primitives";

const kidney = cases[0];
const drMasood = letters[0];

/** A swipe row on phones (like the homepage's), a grid from `sm` up. */
function Cards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mx-[calc(var(--_space---global)*-1)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--_space---global) pb-4 [scroll-padding-inline:var(--_space---global)] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {items.map((it, i) => (
        <Reveal key={it.title} index={i % 4} className="swipe-card w-[80vw] shrink-0 snap-start rounded-3xl border border-ink/10 bg-cream p-6 sm:w-auto">
          <h3 className="heading-style-h4">{it.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{it.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function MedicalPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const sms = buildSmsHref(studio.smsHref, medical.sms);
  return (
    <div className="page-wrapper">
      <ScrollProgress />
      <Header isSubPage onNavigate={onNavigate} smsMessage={medical.sms} />

      <main id="main" className="main-wrapper">
        <section className="section_boost-hero" aria-labelledby="medical-heading">
          <div className="padding-global">
            <div className="container-large">
              <div className="boost-hero_inner">
                <div className="boost-hero_meta text-style-eyebrow">{medical.eyebrow}</div>
                <h1 id="medical-heading" className="heading-style-display boost-hero_heading">
                  {medical.heading} <span className="text-italic-serif text-color-accent">{medical.headingEm}</span>
                </h1>
                <p className="text-size-large boost-hero_lede">{medical.lede}</p>
                <div className="boost-hero_actions">
                  <Button label="Text Adam" href={sms} variant="accent" showIcon={false} />
                  <Button label={`See ${kidney.urlDisplay}`} href={kidney.url} variant="ghost" external />
                </div>
                <div className="boost-hero_badges">
                  {medical.badges.map((b) => (
                    <div key={b.label} className="boost-badge-card">
                      <span className="boost-badge-num font-mono">{b.value}</span>
                      <span className="boost-badge-label text-size-small">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="padding-global padding-section-small">
          <div className="container-large">
            <SectionHeader
              index="01"
              label={`${kidney.client} · ${kidney.place}`}
              heading={["What I built for", <span className="text-italic-serif">a kidney practice.</span>]}
              lede={<p>{medical.caseIntro}</p>}
            />
            <Cards items={medical.built} />

            <Reveal className="boost-proof_card mt-10">
              <blockquote className="boost-proof_quote text-size-large">“{drMasood.quote}”</blockquote>
              <div className="boost-proof_author">
                <div className="boost-proof_author-name font-medium">{drMasood.name}</div>
                <div className="boost-proof_author-role text-size-small text-color-muted">
                  {drMasood.role} · {kidney.client}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="padding-global padding-section-small">
          <div className="container-large">
            <SectionHeader
              index="02"
              label="For your practice"
              heading={["What I'd do", <span className="text-italic-serif">for yours.</span>]}
              lede={<p>{medical.planIntro}</p>}
            />
            <Cards items={medical.plan} />
          </div>
        </section>

        <section className="padding-global padding-section-small">
          <div className="container-large">
            <SectionHeader index="03" label="Cost" heading={["Prices on the page,", <span className="text-italic-serif">like everything else.</span>]} />
            <p className="text-size-large mt-6 max-w-3xl text-ink/80">{medical.pricing}</p>
            <a
              href="/#stand"
              onClick={(e) => {
                if (!onNavigate) return;
                e.preventDefault();
                onNavigate("/#stand");
              }}
              className="mt-4 inline-block py-3 font-medium underline decoration-persimmon decoration-2 underline-offset-4"
            >
              See every price →
            </a>
          </div>
        </section>

        <section className="section_boost-faq">
          <div className="padding-global padding-section-small">
            <div className="container-large">
              <div className="boost-faq_header">
                <span className="text-style-eyebrow text-color-accent">Questions practices ask</span>
                <h2 className="heading-style-h3">Before you text.</h2>
              </div>
              <div className="boost-faq_grid">
                {medical.faqs.map((f) => (
                  <div key={f.q} className="boost-faq_item">
                    <h3 className="heading-style-h4">{f.q}</h3>
                    <p className="text-color-muted text-size-small">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="medical-closing" className="section_boost-closing">
          <div className="padding-global padding-section-medium">
            <div className="container-large">
              <Reveal className="boost_closing-card">
                <div className="boost_closing-inner">
                  <h2 className="heading-style-h2 boost_closing-heading">{medical.closing}</h2>
                  <p className="text-size-large boost_closing-lede text-color-muted">{medical.closingBody}</p>
                  <div className="boost_closing-actions">
                    <a href={sms} className="button is-accent">
                      <span>Text Adam at {studio.phoneDisplay}</span>
                    </a>
                    <a href={studio.phoneHref} className="button is-light">
                      <span>Call instead</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer smsMessage={medical.sms} />
      <MobileTextBar smsMessage={medical.sms} />
    </div>
  );
}

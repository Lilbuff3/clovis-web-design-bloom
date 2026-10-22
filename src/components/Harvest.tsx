import { cases, smsTo } from "../lib/data";
import { useCountUp, useGlobalReveal } from "../lib/hooks";

type Y = { value: number; prefix?: string; suffix?: string; label: string };

function PrimaryMetric({ y }: { y: Y }) {
  const [ref, v] = useCountUp(y.value, 1400);
  const shown = v.toFixed(0);
  return (
    <div className="flex items-baseline gap-3">
      <div className="font-display text-5xl font-[420] tabular-nums leading-none text-ink md:text-6xl">
        <span ref={ref}>
          {y.prefix}
          {shown}
        </span>
        <span className="text-persimmon-deep">{y.suffix}</span>
      </div>
      <div className="max-w-[200px] text-sm leading-snug text-ink-soft">{y.label}</div>
    </div>
  );
}

export function ClientWork() {
  useGlobalReveal();
  return (
    <section id="harvest" className="relative overflow-hidden px-5 py-12 md:px-8 md:py-16">
      <span id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-end">
          <div>
            <h2 className="font-display h-section">
              <span className="line-mask"><span>Proven track record</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>across industries.</span></span>
            </h2>
          </div>
          <p className="reveal max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
            When you align brand positioning, sub-second web engineering, and search visibility under one roof, the numbers move — whether you rely on professional referrals, online bookings, or direct phone calls.
          </p>
        </div>

        {/* Minimal, editorial Branded-style proof cards — no giant niche screenshots dominating the homepage */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cases.map((c, i) => (
            <article
              key={c.no}
              className="reveal flex flex-col justify-between rounded-[28px] border border-ink/10 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(30,43,35,.22)] md:p-8"
              style={{ ["--d" as string]: `${i * 100}ms` }}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-2xl font-[450] text-ink">{c.client}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-soft">{c.trade}</span>
                </div>

                <div className="mt-6 border-y border-ink/15 py-5">
                  <PrimaryMetric y={c.yields[0]} />
                </div>

                <p className="mt-5 text-[16px] leading-relaxed text-ink/85">{c.headline}</p>
                <p className="mt-3 text-[14.5px] italic leading-relaxed text-ink-soft">
                  “{c.quote.text}” — <span className="not-italic font-medium text-ink">{c.quote.name}</span>
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
                {c.caseStudyPath && (
                  <a
                    href={c.caseStudyPath}
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[.12em] text-ink underline decoration-persimmon decoration-2 underline-offset-4 transition hover:text-persimmon-deep"
                  >
                    Read full case study →
                  </a>
                )}
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-ink-soft transition hover:text-ink"
                >
                  {c.urlDisplay} ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-col items-start justify-between gap-4 rounded-[28px] bg-leaf px-7 py-6 text-cream sm:flex-row sm:items-center md:px-10 md:py-7">
          <p className="text-base leading-relaxed text-cream/95 md:text-lg">
            <strong className="font-semibold text-cream">Want to see what this looks like for your industry?</strong> If I don't see a clear way for our work to pay for itself, I'll tell you on our first call.
          </p>
          <a
            href={smsTo("Hi Adam, I saw your site and I'd like to talk about growing my business online.")}
            data-magnetic
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-citrus px-5 py-3 font-medium text-ink transition hover:bg-cream"
          >
            Text me to get started <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export const Harvest = ClientWork;

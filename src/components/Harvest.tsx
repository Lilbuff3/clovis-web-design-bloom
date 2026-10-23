import { cases, smsTo } from "../lib/data";
import { useCountUp, useGlobalReveal } from "../lib/hooks";

type Y = { value: number; prefix?: string; suffix?: string; label: string };

function PrimaryMetric({ y }: { y: Y }) {
  const [ref, v] = useCountUp(y.value, 1400);
  const shown = v.toFixed(0);
  return (
    <div>
      <div className="font-sans text-6xl font-medium tabular-nums leading-none tracking-[-0.05em] text-[#151515] md:text-7xl">
        <span className="text-[#FF4D1C]">{y.prefix}</span>
        <span ref={ref}>{shown}</span>
        <span className="text-[#FF4D1C]">{y.suffix}</span>
      </div>
      <div className="mt-2.5 text-[14px] font-medium leading-snug text-ink/80">
        {y.label}
      </div>
    </div>
  );
}

export function ClientWork() {
  useGlobalReveal();
  return (
    <section
      id="harvest"
      className="relative overflow-hidden bg-white px-5 py-20 text-[#151515] md:px-8 md:py-28"
    >
      <span id="work" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/12 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(2.25rem,4.6vw,4rem)] font-medium leading-[0.96] tracking-[-0.045em] text-[#151515]">
              A proven track record across industries.
            </h2>
          </div>
          <p className="reveal max-w-md text-[17px] leading-relaxed text-ink/80">
            When you align brand positioning, sub-second web engineering, and search visibility under one roof, the numbers move — whether you rely on professional referrals, online bookings, or direct phone calls.
          </p>
        </div>

        {/* Full-Width Horizontal 3-Zone Editorial Cards */}
        <div className="mt-12 space-y-6">
          {cases.map((c, i) => {
            const secondaryYield = c.yields[1];
            return (
              <article
                key={c.no}
                className="reveal grid gap-8 rounded-[16px] border border-[#151515]/10 bg-[#EDEDED] p-7 transition-all duration-300 hover:border-[#151515]/25 md:p-10 lg:grid-cols-12 lg:items-center"
                style={{ ["--d" as string]: `${i * 90}ms` }}
              >
                {/* Zone 1: Framing & Stack */}
                <div className="flex flex-col justify-between lg:col-span-4 lg:border-r lg:border-[#151515]/12 lg:pr-8">
                  <div>
                    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-ink-soft">
                      <span className="h-2 w-2 rounded-full bg-[#FF4D1C]" />
                      CASE {c.no} · {c.year}
                    </div>
                    <h3 className="mt-3 font-sans text-2xl font-medium tracking-[-0.03em] text-[#151515] md:text-3xl">
                      {c.client}
                    </h3>
                    <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-ink-soft">
                      {c.trade} · {c.place}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[8px] border border-[#151515]/10 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.08em] text-[#151515]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Zone 2: Giant -0.05em Metrics */}
                <div className="flex flex-col justify-center gap-6 border-y border-[#151515]/12 py-6 lg:col-span-4 lg:border-y-0 lg:border-r lg:py-0 lg:pr-8">
                  <PrimaryMetric y={c.yields[0]} />

                  {secondaryYield && (
                    <div className="flex items-baseline gap-3 border-t border-[#151515]/10 pt-4">
                      <span className="font-sans text-2xl font-medium tabular-nums tracking-[-0.04em] text-[#151515] md:text-3xl">
                        {secondaryYield.prefix}
                        {secondaryYield.value}
                        <span className="text-[#FF4D1C]">{secondaryYield.suffix}</span>
                      </span>
                      <span className="text-[13.5px] leading-snug text-ink-soft">
                        {secondaryYield.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Zone 3: Story, Quote & Case Study Link */}
                <div className="flex flex-col justify-between lg:col-span-4">
                  <div>
                    <p className="text-[16.5px] font-medium leading-snug text-[#151515]">
                      {c.headline}
                    </p>
                    <p className="mt-3 text-[14.5px] italic leading-relaxed text-ink/80">
                      “{c.quote.text}” —{" "}
                      <span className="not-italic font-medium text-[#151515]">
                        {c.quote.name}
                      </span>
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#151515]/12 pt-5">
                    {c.caseStudyPath && (
                      <a
                        href={c.caseStudyPath}
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#151515] px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[.1em] text-white transition hover:bg-[#FF4D1C] hover:text-[#151515]"
                      >
                        Read full case study →
                      </a>
                    )}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[.08em] text-ink-soft transition hover:text-[#151515]"
                    >
                      {c.urlDisplay} ↗
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Obsidian ROI Bar */}
        <div className="reveal mt-8 flex flex-col items-start justify-between gap-6 rounded-[16px] bg-[#151515] p-8 text-white sm:flex-row sm:items-center md:px-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.12em] text-[#00FF08]">
              <span className="h-2 w-2 rounded-full bg-[#00FF08]" />
              ROI-SCOPED ENGAGEMENTS
            </div>
            <p className="mt-2 text-[17px] leading-relaxed text-white/90">
              <strong className="font-semibold text-white">
                Want to see what this looks like for your industry?
              </strong>{" "}
              If I don't see a clear way for our work to pay for itself, I'll tell you on our first 15-minute call.
            </p>
          </div>
          <a
            href={smsTo("Hi Adam, I saw your site and I'd like to talk about growing my business online.")}
            data-magnetic
            className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-white px-5 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[.1em] text-[#151515] transition hover:bg-[#FF4D1C] hover:text-[#151515]"
          >
            Text me to get started <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export const Harvest = ClientWork;

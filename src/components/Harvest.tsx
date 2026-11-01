import { useRef, useState } from "react";
import { cases, smsTo } from "../lib/data";
import { useCountUp } from "../lib/hooks";

type Y = { value: number; prefix?: string; suffix?: string; label: string };

function PrimaryMetric({ y }: { y: Y }) {
  const [ref, v] = useCountUp(y.value, 900);
  const shown = v.toFixed(0);
  return (
    <div aria-label={`${y.prefix ?? ""}${y.value}${y.suffix ?? ""} ${y.label}`}>
      <div className="font-sans text-5xl font-semibold tabular-nums leading-none tracking-[-0.045em] text-[#141311] md:text-6xl">
        <span className="text-[#C83E14]">{y.prefix}</span>
        <span ref={ref}>{shown}</span>
        <span className="text-[#002FA7]">{y.suffix}</span>
      </div>
      <div className="mt-1.5 text-[13.5px] font-medium leading-snug text-[#4A4742]">
        {y.label}
      </div>
    </div>
  );
}

const CASE_TABS = [...cases.map((c) => c.no), "all"] as const;

export function ClientWork() {
  const [activeCase, setActiveCase] = useState<string>("01");
  const [viewMode, setViewMode] = useState<Record<string, "preview" | "photo">>({});
  const caseTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCaseTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const count = CASE_TABS.length;
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (idx + 1) % count;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (idx - 1 + count) % count;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = count - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      setActiveCase(CASE_TABS[nextIdx]);
      caseTabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <section
      id="harvest"
      className="relative overflow-hidden border-t border-[#141311]/12 bg-[#EAE6DF] px-5 py-10 text-[#141311] md:px-8 md:py-12"
    >
      <span id="work" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        {/* Calm Header + Smooth Pill Switcher */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(1.85rem,3.3vw,2.85rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
              A proven track record across industries.
            </h2>
          </div>

          {/* Interactive Case Study Switcher (Both Case Studies Remain in Static DOM) */}
          <div
            role="tablist"
            aria-label="Verified Client Case Studies"
            className="flex flex-wrap items-center gap-2 rounded-full bg-[#DFDBD2]/75 p-1"
          >
            {cases.map((c, idx) => {
              const isSelected = activeCase === c.no;
              return (
                <button
                  key={c.no}
                  ref={(el) => {
                    caseTabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`case-tab-${c.no}`}
                  aria-controls={`case-panel-${c.no}`}
                  tabIndex={isSelected ? 0 : -1}
                  aria-selected={isSelected}
                  onClick={() => setActiveCase(c.no)}
                  onKeyDown={(e) => handleCaseTabKeyDown(e, idx)}
                  className={`cursor-pointer rounded-full px-4 py-2 font-sans text-[13px] font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-[#141311] text-[#F6F4EF] shadow-sm"
                      : "text-[#4A4742] hover:text-[#141311]"
                  }`}
                >
                  {c.client} ({c.yields[0].prefix ?? ""}{c.yields[0].value}{c.yields[0].suffix ?? ""})
                </button>
              );
            })}
            <button
              ref={(el) => {
                caseTabRefs.current[cases.length] = el;
              }}
              type="button"
              role="tab"
              id="case-tab-all"
              tabIndex={activeCase === "all" ? 0 : -1}
              aria-selected={activeCase === "all"}
              onClick={() => setActiveCase("all")}
              onKeyDown={(e) => handleCaseTabKeyDown(e, cases.length)}
              className={`cursor-pointer rounded-full px-3.5 py-2 font-sans text-[13px] font-semibold transition-all duration-200 ${
                activeCase === "all"
                  ? "bg-[#002FA7] text-[#F6F4EF] shadow-sm"
                  : "text-[#4A4742] hover:text-[#141311]"
              }`}
            >
              {activeCase === "all" ? "Showing both" : "Compare both"}
            </button>
          </div>
        </div>

        {/* Smooth Rounded-2xl Case Study Specimens (Both Pre-Rendered in Static DOM) */}
        <div className="mt-6 space-y-6">
          {cases.map((c, i) => {
            const secondaryYield = c.yields[1];
            const mode = viewMode[c.no] ?? "preview";
            const accentBar = i === 0 ? "bg-[#002FA7]" : "bg-[#C83E14]";
            const isVisible = activeCase === "all" || activeCase === c.no;

            return (
              <article
                key={c.no}
                id={`case-panel-${c.no}`}
                aria-labelledby={`case-tab-${c.no}`}
                className={`${
                  isVisible ? "block" : "hidden"
                } overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] shadow-[0_24px_60px_-24px_rgba(20,19,17,0.08)]`}
              >
                {/* Top Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141311]/10 bg-[#EAE6DF]/55 px-6 py-3">
                  <div className="flex items-center gap-3 text-[12.5px] font-medium text-[#4A4742]">
                    <span className="font-mono font-semibold text-[#141311]">
                      {c.year}
                    </span>
                    <span>·</span>
                    <span>
                      {c.trade} · {c.place}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#0B6E3F]/12 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0B6E3F]">
                      100/100 PageSpeed
                    </span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12.5px] font-semibold text-[#002FA7] hover:underline"
                    >
                      {c.urlDisplay} ↗
                    </a>
                  </div>
                </div>

                {/* 3-Bay Specimen Grid */}
                <div className="grid divide-y divide-[#141311]/10 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  {/* Bay 1 (5 cols): Live Website / On-Site Photo Preview */}
                  <div className="flex flex-col justify-between bg-[#EAE6DF]/40 p-5 lg:col-span-5">
                    <div className="overflow-hidden rounded-xl border border-[#141311]/12 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#141311]/10 bg-[#F6F4EF] px-3.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#C83E14]/75" />
                          <span className="h-2 w-2 rounded-full bg-[#B87D1E]/75" />
                          <span className="h-2 w-2 rounded-full bg-[#0B6E3F]/75" />
                        </div>
                        <span className="font-mono text-[11px] text-[#4A4742]">
                          {c.urlDisplay}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-[#0B6E3F]">
                          ● Live
                        </span>
                      </div>

                      <div className="relative aspect-[16/9] max-h-[215px] w-full overflow-hidden bg-[#DFDBD2]">
                        {mode === "preview" ? (
                          <img
                            src={c.previewImg}
                            alt={`${c.client} live custom website interface`}
                            width={1280}
                            height={720}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                          />
                        ) : (
                          <img
                            src={c.photoImg}
                            alt={`${c.client} in ${c.place}`}
                            width={c.photoWidth}
                            height={c.photoHeight}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex rounded-full bg-[#DFDBD2]/80 p-0.5" role="tablist" aria-label={`${c.client} visual view`}>
                        <button
                          type="button"
                          role="tab"
                          tabIndex={mode === "preview" ? 0 : -1}
                          aria-selected={mode === "preview"}
                          onClick={() => setViewMode((prev) => ({ ...prev, [c.no]: "preview" }))}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                              e.preventDefault();
                              setViewMode((prev) => ({ ...prev, [c.no]: mode === "preview" ? "photo" : "preview" }));
                            }
                          }}
                          className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                            mode === "preview"
                              ? "bg-[#141311] text-[#F6F4EF]"
                              : "text-[#4A4742] hover:text-[#141311]"
                          }`}
                        >
                          Live website
                        </button>
                        <button
                          type="button"
                          role="tab"
                          tabIndex={mode === "photo" ? 0 : -1}
                          aria-selected={mode === "photo"}
                          onClick={() => setViewMode((prev) => ({ ...prev, [c.no]: "photo" }))}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                              e.preventDefault();
                              setViewMode((prev) => ({ ...prev, [c.no]: mode === "preview" ? "photo" : "preview" }));
                            }
                          }}
                          className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                            mode === "photo"
                              ? "bg-[#141311] text-[#F6F4EF]"
                              : "text-[#4A4742] hover:text-[#141311]"
                          }`}
                        >
                          On-site photo
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {c.stack.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#F6F4EF] px-2 py-0.5 text-[11.5px] font-medium text-[#4A4742]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bay 2 (3 cols): Metrics & Deliverables */}
                  <div className="flex flex-col justify-between p-5 lg:col-span-3">
                    <div>
                      <h3 className="font-sans text-xl font-semibold tracking-[-0.03em] text-[#141311]">
                        {c.client}
                      </h3>
                      <div className="mt-3">
                        <PrimaryMetric y={c.yields[0]} />
                      </div>

                      {secondaryYield && (
                        <div className="mt-3.5 flex items-baseline gap-2.5 border-t border-[#141311]/10 pt-3">
                          <span className="font-sans text-xl font-semibold tabular-nums tracking-[-0.04em] text-[#141311]">
                            {secondaryYield.prefix}
                            {secondaryYield.value}
                            <span className="text-[#002FA7]">{secondaryYield.suffix}</span>
                          </span>
                          <span className="text-[12.5px] font-medium leading-snug text-[#4A4742]">
                            {secondaryYield.label}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 border-t border-[#141311]/10 pt-3">
                      <ul className="space-y-1.5 text-[13px] leading-snug text-[#4A4742]">
                        {c.planted.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accentBar}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bay 3 (4 cols): Story, Verified Quote & Case Study Link */}
                  <div className="flex flex-col justify-between p-5 lg:col-span-4">
                    <div>
                      <p className="font-sans text-[16px] font-semibold leading-snug text-[#141311]">
                        {c.headline}
                      </p>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[#4A4742]">
                        <strong className="font-semibold text-[#141311]">The challenge: </strong>
                        {c.problem}
                      </p>

                      <blockquote className="mt-4 border-t border-[#141311]/10 pt-3.5 text-[13.5px] leading-relaxed text-[#141311]">
                        “{c.quote.text}”
                        <footer className="mt-1.5 text-[12px] font-medium text-[#4A4742]">
                          — {c.quote.name}, {c.quote.role}
                        </footer>
                      </blockquote>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#141311]/10 pt-4">
                      {c.caseStudyPath && (
                        <a
                          href={c.caseStudyPath}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#141311] px-4 py-2 font-sans text-[13px] font-semibold text-[#F6F4EF] transition hover:bg-[#002FA7]"
                        >
                          Read full case study →
                        </a>
                      )}
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-semibold text-[#4A4742] hover:text-[#141311]"
                      >
                        Open live site ↗
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Quiet ROI Guarantee Strip */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#002FA7] px-6 py-4 text-[#F6F4EF] sm:flex-row sm:items-center">
          <p className="text-[14.5px] leading-snug text-[#F6F4EF]">
            <strong className="font-semibold text-white">
              Want to see what this looks like for your industry?
            </strong>{" "}
            If I don't see a clear way for our work to pay for itself, I'll tell you on our first 15-minute call.
          </p>
          <a
            href={smsTo("Hi Adam, I saw your site and I'd like to talk about growing my business online.")}
            data-magnetic
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#F6F4EF] px-4 py-2 font-sans text-[13px] font-semibold text-[#141311] transition hover:bg-[#141311] hover:text-[#F6F4EF]"
          >
            Text me to get started <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export const Harvest = ClientWork;

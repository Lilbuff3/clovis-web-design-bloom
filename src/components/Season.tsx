import { compare, steps } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

const STEP_ACCENTS = [
  "bg-[#002FA7]/12 text-[#002FA7]",
  "bg-[#C83E14]/12 text-[#C83E14]",
  "bg-[#B87D1E]/15 text-[#B87D1E]",
  "bg-[#0B6E3F]/12 text-[#0B6E3F]",
];

export function Season() {
  useGlobalReveal();
  return (
    <section
      id="season"
      className="relative flex flex-col justify-between border-b border-[#141311]/12 p-6 text-[#141311] md:p-8 lg:col-span-5 lg:border-r lg:border-b-0"
    >
      <span id="process" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div>
        <h2 className="font-sans text-[clamp(1.65rem,2.5vw,2.25rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
          From discovery to measurable growth.
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Every engagement runs through four stages in order. Focused one-page builds launch in about a week; multi-page systems run two to four weeks.
        </p>

        <ol className="mt-5 grid grid-cols-1 divide-y divide-[#141311]/10 overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] shadow-[0_20px_50px_-24px_rgba(20,19,17,0.08)] sm:grid-cols-2 sm:divide-x">
          {steps.map((s, i) => (
            <li
              key={s.name}
              className="relative flex flex-col justify-between p-4 transition-colors hover:bg-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${STEP_ACCENTS[i] ?? STEP_ACCENTS[0]}`}>
                    Stage 0{i + 1}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-ink-soft">
                    {s.when}
                  </span>
                </div>
                <h3 className="mt-1 font-sans text-[15.5px] font-semibold leading-tight tracking-[-0.02em] text-[#141311]">
                  {s.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Compare() {
  useGlobalReveal();
  return (
    <section
      id="compare"
      className="relative flex flex-col justify-between overflow-hidden p-6 text-[#141311] md:p-8 lg:col-span-7"
    >
      <div>
        <h2 className="font-sans text-[clamp(1.65rem,2.5vw,2.25rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#141311]">
          Traditional agency, or dedicated builder?
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Compare working with a traditional marketing agency against working directly with me from discovery to launch.
        </p>

        {/* Semantic HTML Table in a Smooth Rounded Architectural Card */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#141311]/12 bg-[#F6F4EF] shadow-[0_20px_50px_-24px_rgba(20,19,17,0.08)]">
          <table className="block w-full border-collapse text-left md:table">
            <caption className="sr-only">Side-by-side comparison between typical agencies and working with Adam</caption>
            <thead className="sr-only md:not-sr-only md:table-header-group">
              <tr className="border-b border-[#141311]/10 bg-[#EAE6DF]/70 md:table-row">
                <th scope="col" className="w-[38%] px-4 py-3 font-sans text-[12.5px] font-semibold text-[#141311] md:table-cell">
                  The Question
                </th>
                <th scope="col" className="w-[31%] border-l border-[#141311]/10 px-4 py-3 font-sans text-[12.5px] font-semibold text-ink-soft md:table-cell">
                  Typical agency
                </th>
                <th scope="col" className="w-[31%] border-l border-[#141311]/10 bg-[#002FA7] px-4 py-3 font-sans text-[12.5px] font-semibold text-[#F6F4EF] md:table-cell">
                  With me (Adam)
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-[#141311]/10 md:table-row-group">
              {compare.map((row) => (
                <tr key={row.q} className="block p-3.5 align-middle md:table-row md:p-0">
                  <th scope="row" className="block pb-1 font-medium md:table-cell md:px-4 md:py-3">
                    <span className="font-sans text-[14px] font-semibold leading-snug tracking-[-0.015em] text-[#141311]">{row.q}</span>
                  </th>
                  <td
                    title={row.them[1]}
                    className="block py-1 md:table-cell md:border-l md:border-[#141311]/10 md:px-4 md:py-3"
                  >
                    <div className="mb-0.5 font-mono text-[11px] uppercase tracking-[.12em] text-ink-soft md:hidden">Typical agency</div>
                    <div className="font-sans text-[14px] font-medium leading-snug text-ink-soft line-through decoration-[#C83E14]/70">
                      {row.them[0]}
                    </div>
                    <p className="sr-only">{row.them[1]}</p>
                  </td>
                  <td
                    title={row.me[1]}
                    className="block rounded-xl bg-[#EAE6DF]/60 p-2.5 md:table-cell md:rounded-none md:border-l md:border-[#141311]/10 md:px-4 md:py-3"
                  >
                    <div className="mb-0.5 font-mono text-[11px] font-semibold uppercase tracking-[.12em] text-[#002FA7] md:hidden">With me (Adam)</div>
                    <div className="font-sans text-[14px] font-semibold leading-snug text-[#002FA7]">
                      {row.me[0]}
                    </div>
                    <p className="sr-only">{row.me[1]}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export const Process = Season;

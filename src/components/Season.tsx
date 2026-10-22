import { compare, steps } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Season() {
  useGlobalReveal();
  return (
    <section id="season" className="relative bg-[#151515] px-5 py-20 text-white md:px-8 md:py-24">
      <span id="process" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="h-section font-sans font-bold tracking-[-0.035em] text-white">
            <span className="line-mask"><span>From discovery</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>to measurable growth.</span></span>
          </h2>
          <p className="reveal mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            Every engagement goes through the same four stages in the same order, whether you hire me for a custom website build, a Search &amp; AI visibility overhaul, or both. Focused one-page builds launch in about a week; multi-page systems and search campaigns run two to four weeks.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.name}
              className="reveal relative flex flex-col rounded-[16px] border border-white/12 bg-[#1E1E1E] p-7 transition-colors hover:border-white/30"
              style={{ ["--d" as string]: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[.14em] text-[#FF4D1C]">
                  <span className="h-2 w-2 rounded-full bg-[#FF4D1C]" aria-hidden="true" />
                  Stage 0{i + 1}
                </span>
                <span className="rounded-[6px] border border-white/15 bg-[#151515] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.12em] text-white/75">
                  {s.when}
                </span>
              </div>
              <h3 className="mt-5 font-sans text-2xl font-bold leading-tight tracking-[-0.02em] text-white">
                {s.name}
              </h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/80">{s.body}</p>
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
    <section id="compare" className="relative overflow-hidden bg-white px-5 py-16 text-[#151515] md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="h-section font-sans font-bold tracking-[-0.035em] text-[#151515]">
            <span className="line-mask"><span>Traditional agency,</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>or dedicated builder?</span></span>
          </h2>
          <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Compare what it's like working with a traditional marketing agency against working directly with me from discovery to launch.
          </p>
        </div>

        {/* Semantic HTML Table rendered for humans, crawlers, and screen readers; stacks cleanly on mobile */}
        <div className="reveal mt-12">
          <table className="block w-full border-collapse text-left md:table">
            <caption className="sr-only">Side-by-side comparison between typical agencies and working with Adam</caption>
            <thead className="sr-only md:not-sr-only md:table-header-group">
              <tr className="border-b-2 border-[#151515] md:table-row">
                <th scope="col" className="w-[28%] pb-4 pt-2 font-mono text-xs uppercase tracking-[.16em] text-ink-soft md:table-cell">
                  The Question
                </th>
                <th scope="col" className="w-[36%] pb-4 pt-2 font-mono text-xs uppercase tracking-[.16em] text-ink-soft md:table-cell">
                  Typical agency
                </th>
                <th scope="col" className="w-[36%] pb-4 pl-4 pt-2 font-mono text-xs font-semibold uppercase tracking-[.16em] text-[#00A843] md:table-cell">
                  With me (Adam)
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-[#151515]/15 md:table-row-group">
              {compare.map((row, i) => (
                <tr key={row.q} className="block py-6 align-top md:table-row md:py-0">
                  <th scope="row" className="block pb-3 font-medium md:table-cell md:py-7 md:pr-6">
                    <span className="mr-2.5 font-mono text-xs font-semibold text-[#FF4D1C]">0{i + 1}</span>
                    <span className="font-sans text-base font-bold tracking-[-0.015em] text-[#151515] md:text-lg">{row.q}</span>
                  </th>
                  <td className="block py-3 md:table-cell md:py-7 md:pr-6">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-[.14em] text-ink-soft md:hidden">Typical agency</div>
                    <div className="font-sans text-xl font-bold tracking-[-0.02em] text-ink-soft line-through decoration-[#FF4D1C]/70 decoration-2 md:text-2xl">
                      {row.them[0]}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{row.them[1]}</p>
                  </td>
                  <td className="block rounded-[12px] bg-[#EDEDED] p-5 md:table-cell md:py-7 md:pl-5 md:pr-5">
                    <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[.14em] text-[#00A843] md:hidden">With me (Adam)</div>
                    <div className="font-sans text-xl font-bold tracking-[-0.02em] text-[#151515] md:text-2xl">
                      {row.me[0]}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#151515]">{row.me[1]}</p>
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

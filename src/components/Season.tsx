import { compare, steps } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Season() {
  useGlobalReveal();
  return (
    <section id="season" className="relative px-5 py-14 md:px-8 md:py-20">
      <span id="process" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="font-display h-section">
            <span className="line-mask"><span>From discovery</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>to launch in six days.</span></span>
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Every site goes through the same four stages in the same order, so nothing gets made up on the day it should've been decided. Day counts are for the
            one-page build; multi-page sites run three to four weeks, and anything with booking or compliance runs longer.
          </p>
        </div>

        {/* Each step's top rule joins the next on wide screens, so the four read as one timeline. */}
        <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.name} className="reveal relative border-t border-ink/20 pt-6 sm:pr-8" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-persimmon" aria-hidden="true" />
              <h3 className="font-display text-3xl font-[450] leading-tight">{s.name}</h3>
              <div className="mt-1 font-mono text-[12px] uppercase tracking-[.16em] text-ink-soft">{s.when}</div>
              <p className="mt-3 text-[16px] leading-relaxed text-ink/80">{s.body}</p>
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
    <section id="compare" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="font-display h-section">
            <span className="line-mask"><span>Traditional agency,</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>or dedicated builder?</span></span>
          </h2>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Compare what it's like working with a bloated agency against working directly with me from discovery to launch.
          </p>
        </div>

        {/* Semantic HTML Table rendered for humans, crawlers, and screen readers; stacks cleanly on mobile */}
        <div className="reveal mt-12">
          <table className="block w-full border-collapse text-left md:table">
            <caption className="sr-only">Side-by-side comparison between typical agencies and working with Adam</caption>
            <thead className="sr-only md:not-sr-only md:table-header-group">
              <tr className="border-b-2 border-ink/20 md:table-row">
                <th scope="col" className="w-[28%] pb-4 pt-2 font-mono text-xs uppercase tracking-[.16em] text-ink-soft md:table-cell">
                  The Question
                </th>
                <th scope="col" className="w-[36%] pb-4 pt-2 font-mono text-xs uppercase tracking-[.16em] text-ink-soft md:table-cell">
                  Typical agency
                </th>
                <th scope="col" className="w-[36%] pb-4 pt-2 font-mono text-xs uppercase tracking-[.16em] text-leaf md:table-cell">
                  With me (Adam)
                </th>
              </tr>
            </thead>
            <tbody className="block divide-y divide-ink/15 md:table-row-group">
              {compare.map((row, i) => (
                <tr key={row.q} className="block py-6 align-top transition-colors hover:bg-cream/40 md:table-row md:py-0">
                  <th scope="row" className="block pb-3 font-medium md:table-cell md:py-7 md:pr-6">
                    <span className="font-mono text-xs text-ink-soft mr-2">0{i + 1}</span>
                    <span className="text-base font-semibold text-ink md:text-lg">{row.q}</span>
                  </th>
                  <td className="block py-3 md:table-cell md:py-7 md:pr-6">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-[.14em] text-ink-soft md:hidden">Typical agency</div>
                    <div className="font-display wonk text-2xl italic text-ink-soft line-through decoration-persimmon/60 decoration-2 md:text-3xl">
                      {row.them[0]}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{row.them[1]}</p>
                  </td>
                  <td className="block rounded-xl bg-sage/20 p-4 md:table-cell md:bg-transparent md:py-7 md:pl-4 md:pr-0">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-[.14em] text-leaf md:hidden">With me (Adam)</div>
                    <div className="font-display wonk text-2xl italic text-leaf md:text-3xl">
                      {row.me[0]}
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{row.me[1]}</p>
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

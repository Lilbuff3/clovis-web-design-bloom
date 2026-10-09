import { steps } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Season() {
  useGlobalReveal();
  return (
    <section id="season" className="relative px-5 py-14 md:px-8 md:py-20">
      <span id="process" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>From discovery</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                to launch in <em className="wonk text-persimmon">six days.</em>
              </span>
            </span>
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
              <div className="font-mono text-[12px] uppercase tracking-[.16em] text-ink-soft">{s.when}</div>
              <h3 className="font-display mt-2 text-3xl font-[450] leading-tight">{s.name}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const Process = Season;

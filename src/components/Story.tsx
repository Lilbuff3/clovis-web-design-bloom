import { useId, useState } from "react";
import { care, faqs, plans, SMS_LINK } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Grower() {
  useGlobalReveal();
  return (
    <section id="grower" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <span id="about" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-12">
        <div className="reveal relative lg:col-span-5">
          <div className="clip-reveal relative aspect-[4/5] overflow-hidden rounded-[40px] bg-blush shadow-xl">
            <img src="/images/studio.jpg" alt="A sunlit desk with a laptop, a sketchbook and a bowl of mandarins" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/20 via-transparent to-persimmon/10 mix-blend-multiply" aria-hidden="true" />
          </div>
          <div data-speed="0.25" className="absolute -bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-cream/95 px-5 py-4 shadow-xl backdrop-blur md:left-auto md:right-[-24px] md:w-72">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[.18em] text-ink-soft">Based in</div>
              <div className="font-display text-lg">Clovis, California</div>
            </div>
            <div className="text-right font-mono text-[11px] leading-relaxed text-ink-soft">
              36.82° N
              <br />
              119.70° W
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <h2 className="font-display text-[clamp(2.8rem,6.5vw,6rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>One person.</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">One town</em> at a time.
              </span>
            </span>
          </h2>
          <div className="reveal mt-8 max-w-2xl space-y-5 text-[18px] leading-relaxed text-ink/85">
            <p>
              I'm <strong className="font-semibold">Adam Youssef</strong>. I write every site's code myself, in Astro, React and TypeScript — no WordPress themes, no drag-and-drop builders.
            </p>
            <p>
              I also write the words, set the site up so Google knows who you are and where you work, and make sure it works for everyone, including people using screen readers.
            </p>
            <p className="text-[16px] text-ink/70">
              <strong className="font-semibold text-ink">Agencies and designers:</strong> I also build from your Figma files, under your name. Text me the project and the deadline.
            </p>
          </div>
          <blockquote className="reveal font-display wonk relative mt-10 max-w-2xl border-l-2 border-citrus/60 pl-6 text-[clamp(1.7rem,3vw,2.5rem)] italic leading-[1.15]">
            “You don't rent your website from an agency. You own the code, the domain, and the keys.”
          </blockquote>
          <div className="mt-12">
            <a href={SMS_LINK} data-magnetic className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-cream transition-colors hover:bg-persimmon-deep">
              Text Adam directly →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stand() {
  useGlobalReveal();
  return (
    <section id="stand" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <span id="pricing" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-display mx-auto max-w-4xl text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>Prices on the tag,</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">not in a drawer.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-xl text-lg text-ink/80">No sales call to find out what it costs. Every price is published right here, and every site is 100% yours to keep.</p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-3 lg:gap-8">
            {plans.map((pl) => (
              <div key={pl.code} className="flex flex-col">
                <div
                  className={`relative flex flex-1 flex-col ${pl.color} rounded-[28px] border border-ink/10 p-7 shadow-[0_20px_50px_-25px_rgba(30,43,35,.2)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-20px_rgba(30,43,35,.3)]`}
                >
                  <div className="font-mono text-[11px] uppercase tracking-[.18em] text-ink/80">{pl.time}</div>
                  <div className="font-display wonk mt-3 text-4xl italic text-ink">{pl.name}</div>
                  <div className="mt-1 text-[15px] text-ink/80">{pl.kind}</div>
                  <div className="mt-6 font-display text-6xl font-[400] leading-none text-ink">{pl.price}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink/80">one-off · no subscription</div>
                  <div className="dotted-rule mt-6 text-ink/30" />
                  <ul className="mt-5 space-y-2.5 text-[15px]">
                    {pl.items.map((it) => (
                      <li key={it} className="flex gap-2.5">
                        <span className="mt-[3px] text-leaf">✓</span>
                        {it}
                      </li>
                    ))}
                    {pl.not.map((it) => (
                      <li key={it} className="flex gap-2.5 text-ink/80">
                        <span className="mt-[3px]">–</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-2xl bg-cream/70 p-3.5 text-[13.5px] leading-snug text-ink/75">
                    <span className="font-semibold text-ink">Best for: </span>
                    {pl.for}
                  </p>
                  <a href={SMS_LINK} className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-cream transition hover:bg-persimmon-deep font-medium">
                    Ask about {pl.name} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Care */}
        <div className="reveal mt-24 rounded-[36px] border border-ink/10 bg-cream p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[.2em] text-leaf">After Launch</div>
              <h3 className="font-display mt-3 text-4xl font-[420] leading-tight">
                Ongoing care is <em className="wonk">optional</em>. I mean it.
              </h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink/75">
                Your site runs fine without me. Plain files — no plugins to update, nothing that breaks at 2 a.m. These are for people who'd rather send one text than
                think about their website.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {care.map((c, i) => (
                <div key={c.name} className={`rounded-3xl p-6 transition hover:-translate-y-1 ${i === 1 ? "bg-citrus" : "bg-paper"}`}>
                  <div className="font-mono text-[11px] uppercase tracking-[.16em] text-ink/80">{c.name}</div>
                  <div className="font-display mt-3 text-5xl">
                    {c.price}
                    <span className="text-xl text-ink/80">/mo</span>
                  </div>
                  <p className="mt-3 text-[14.5px] leading-snug text-ink/75">{c.blurb}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 border-t border-dashed border-ink/20 pt-6 text-center text-[15px] text-ink/75">
            Cancel with one text. No contract, no exit fee.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  useGlobalReveal();
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section id="faq" className="relative px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-[420] leading-[0.95]">
              <span className="line-mask"><span>What people ask</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  <em className="wonk text-leaf">before they text.</em>
                </span>
              </span>
            </h2>
            <p className="reveal mt-6 text-lg text-ink/75">Didn't see your question? Text it. You'll get a straight answer, even if it's “you don't need a new website yet.”</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${id}-q${i}`;
            const panelId = `${id}-a${i}`;
            return (
              <div key={f.q} className="border-b border-ink/15">
                <button
                  id={btnId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className={`font-display text-2xl leading-snug transition md:text-[28px] ${isOpen ? "text-persimmon" : "group-hover:translate-x-1"}`}>{f.q}</span>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 text-2xl transition-all duration-500 ${
                      isOpen ? "rotate-45 border-persimmon-deep bg-persimmon-deep text-cream" : "group-hover:bg-citrus"
                    }`}
                  >
                    +
                  </span>
                </button>
                {/* inert: a closed answer is only squashed to zero height, so without it screen readers still read it. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  inert={!isOpen}
                  className="grid transition-all duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-[17px] leading-relaxed text-ink/80">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const About = Grower;
export const Pricing = Stand;


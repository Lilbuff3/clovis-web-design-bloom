import { useState } from "react";
import { care, faqs, letters, plans, studio, VIDEO_SHADOW } from "../data/content";
import { AmbientVideo } from "./primitives";

export function Grower() {
  return (
    <section id="grower" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-12">
        <div className="reveal relative lg:col-span-5">
          <div className="clip-reveal relative aspect-[4/5] overflow-hidden rounded-[40px] bg-blush">
            <img src="/images/studio.jpg" alt="Adam's sunlit workbench in Clovis with a laptop, sketchbook and a bowl of mandarins" className="h-full w-full object-cover" loading="lazy" />
            <AmbientVideo
              {...VIDEO_SHADOW}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply grayscale"
            />
          </div>
          <div data-speed="0.25" className="absolute -bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-cream/95 px-5 py-4 shadow-xl backdrop-blur md:left-auto md:right-[-24px] md:w-72">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">The workbench</div>
              <div className="font-display text-lg">Clovis, California</div>
            </div>
            <div className="text-right font-mono text-[10px] leading-relaxed text-ink/60">
              36.82° N
              <br />
              119.70° W
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">05 — The grower</div>
          <h2 className="font-display mt-5 text-[clamp(2.8rem,6.5vw,6rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>One person.</span></span>
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">One town</em> at a time.
              </span>
            </span>
          </h2>
          <div className="reveal mt-8 max-w-2xl space-y-5 text-[18px] leading-relaxed text-ink/85">
            <p>
              I'm <strong className="font-semibold">Adam Youssef</strong>. I build websites by hand from Clovis for businesses across Fresno and the Central
              Valley. You get my cell number, and the person who answers is the person who wrote the code.
            </p>
            <p>So I listen before I design, I write before I build, and I hand you the keys at the end.</p>
          </div>
          <blockquote className="reveal font-display wonk relative mt-10 max-w-2xl border-l-4 border-citrus pl-6 text-[clamp(1.7rem,3vw,2.5rem)] italic leading-[1.15]">
            “You don't rent the tree from me. You own the orchard.”
          </blockquote>

          <div className="mt-12">
            <a href={studio.smsHref} data-magnetic className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-cream transition-colors hover:bg-persimmon">
              Text Adam directly →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stand() {
  return (
    <section id="stand" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">06 — The farm stand</div>
          <h2 className="font-display mx-auto mt-5 max-w-4xl text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
            <span className="line-mask"><span>Prices on the tag,</span></span>
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">not in a drawer.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-xl text-lg text-ink/80">No call to find out what it costs. Every price is right here, and every site is yours to keep.</p>
        </div>

        {/* wooden rail */}
        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-0 h-3 rounded-full bg-[#b98a5a] shadow-[inset_0_-3px_0_rgba(0,0,0,.15)]" />
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-10 pt-3 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-10">
            {plans.map((pl, i) => (
              <div key={pl.code} className="swipe-card group flex w-[82vw] shrink-0 snap-start flex-col items-center md:w-auto" style={{ perspective: 800 }}>
                <div className="h-10 w-[2px] bg-ink/50 md:h-14" />
                <div
                  className="w-full origin-top animate-sway transition-transform group-hover:[animation-play-state:paused]"
                  style={{ animationDelay: `${i * -1.4}s` }}
                >
                  <div
                    className={`relative ${pl.color} px-7 pb-8 pt-14 shadow-[0_30px_60px_-30px_rgba(30,43,35,.5)] transition-transform duration-500 group-hover:-translate-y-2`}
                    style={{ clipPath: "polygon(56px 0, calc(100% - 56px) 0, 100% 44px, 100% 100%, 0 100%, 0 44px)", borderRadius: 22 }}
                  >
                    <span className="tag-hole absolute left-1/2 top-5 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f3e9d6] ring-2 ring-ink/10" />
                    <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[.18em]">
                      <span>Nº {pl.code}</span>
                      <span>{pl.time}</span>
                    </div>
                    <div className="font-display wonk mt-4 text-5xl italic">{pl.name}</div>
                    <div className="mt-1 text-[15px] text-ink/70">{pl.kind}</div>
                    <div className="mt-6 flex items-end gap-3">
                      <span className="font-display text-7xl font-[400] leading-none">{pl.price}</span>
                      {pl.was && <span className="mb-2 font-display text-2xl text-ink/45 line-through decoration-persimmon decoration-2">{pl.was}</span>}
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-ink/60">{pl.note ?? "one-off · no subscription"}</div>
                    <div className="dotted-rule mt-6 text-ink/30" />
                    <ul className="mt-5 space-y-2.5 text-[15px]">
                      {pl.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span className="mt-[3px] text-leaf">✓</span>
                          {it}
                        </li>
                      ))}
                      {pl.not.map((it) => (
                        <li key={it} className="flex gap-2.5 text-ink/50">
                          <span className="mt-[3px]">–</span>
                          {it}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 rounded-2xl bg-cream/60 p-3.5 text-[13.5px] leading-snug text-ink/75">
                      <span className="font-semibold text-ink">Best for: </span>
                      {pl.for}
                    </p>
                    <a href={studio.smsHref} className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-cream transition hover:bg-persimmon">
                      Pick {pl.name} →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Care */}
        <div className="reveal mt-24 rounded-[36px] border border-ink/10 bg-cream p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="font-mono text-[11px] uppercase tracking-[.2em] text-leaf">After the harvest</div>
              <h3 className="font-display mt-3 text-4xl font-[420] leading-tight">
                Tending is <em className="wonk">optional</em>. I mean it.
              </h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink/75">
                Your site runs fine without me. Plain files — no plugins to update, nothing that breaks at 2 a.m. These are for people who'd rather send one text than
                think about their website.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {care.map((c, i) => (
                <div key={c.name} className={`rounded-3xl p-6 transition hover:-translate-y-1 ${i === 1 ? "bg-citrus" : "bg-paper"}`}>
                  <div className="font-mono text-[11px] uppercase tracking-[.16em] text-ink/60">{c.name}</div>
                  <div className="font-display mt-3 text-5xl">
                    {c.price}
                    <span className="text-xl text-ink/50">/mo</span>
                  </div>
                  <p className="mt-3 text-[14.5px] leading-snug text-ink/75">{c.blurb}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 border-t border-dashed border-ink/20 pt-6 text-center text-[15px] text-ink/75">
            Cancel with one text. No contract, no exit fee, no “migration charge” — you already have the code, the domain and the logins.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Letters() {
  return (
    <section id="letters" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-ink/70">07 — Letters from the valley</div>
        <h2 className="font-display mt-5 text-[clamp(2.8rem,7vw,6.5rem)] font-[420] leading-[0.92]">
          <span className="line-mask"><span>They wrote</span></span>
          <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
            <span>
              <em className="wonk text-persimmon">back.</em>
            </span>
          </span>
        </h2>
        <p className="reveal mt-4 text-lg text-ink/75">Two clients, in their own words, unedited.</p>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {letters.map((l, i) => (
            <figure
              key={l.name}
              className={`reveal relative rounded-[10px] bg-cream p-7 shadow-[0_40px_60px_-40px_rgba(30,43,35,.55)] transition-transform duration-700 hover:rotate-0 md:p-10 ${
                i === 0 ? "md:-rotate-2" : "md:mt-16 md:rotate-2"
              }`}
              style={{ ["--d" as string]: `${i * 120}ms` }}
            >
              <div className="absolute right-6 top-6 flex items-start gap-3">
                <div className="relative hidden h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-ink/25 font-mono text-[8px] uppercase leading-tight tracking-widest text-ink/40 sm:flex">
                  <span className="text-center">
                    {l.place.split(",")[0]}
                    <br />
                    2025
                  </span>
                </div>
                <div className={`flex h-20 w-16 flex-col items-center justify-center ${l.stamp} p-1`} style={{ outline: "3px dotted #fcf8f0", outlineOffset: "-3px" }}>
                  <svg viewBox="0 0 24 24" className="h-8 w-8">
                    <circle cx="12" cy="13" r="7" fill="#EE5A2F" />
                    <path d="M12 6c1.4-2.8 4-3.6 6.2-3-.7 2.4-3.1 3.9-6.2 3z" fill="#2E6A4C" />
                  </svg>
                  <span className="mt-1 font-mono text-[7px] uppercase tracking-widest">Clovis</span>
                </div>
              </div>
              <div className="font-display wonk text-7xl leading-none text-persimmon">“</div>
              <blockquote className="font-display mt-2 text-[21px] font-[380] leading-[1.4] md:text-[23px]">{l.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-dashed border-ink/25 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-lg text-cream">{l.name.replace("Dr. ", "")[0]}</span>
                <span>
                  <span className="block font-medium">{l.name}</span>
                  <span className="block text-sm text-ink/60">{l.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">08 — Porch questions</div>
            <h2 className="font-display mt-5 text-[clamp(2.6rem,5vw,4.5rem)] font-[420] leading-[0.95]">
              <span className="line-mask"><span>What people ask</span></span>
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
                <span>
                  <em className="wonk text-leaf">before they text.</em>
                </span>
              </span>
            </h2>
            <p className="reveal mt-6 text-lg text-ink/75">Didn't see yours? Text it. You'll get a straight answer, even if it's “you don't need me yet.”</p>
          </div>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-ink/15">
                <button onClick={() => setOpen(isOpen ? null : i)} className="group flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
                  <span className={`font-display text-2xl leading-snug transition md:text-[28px] ${isOpen ? "text-persimmon" : "group-hover:translate-x-1"}`}>{f.q}</span>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 text-2xl transition-all duration-500 ${
                      isOpen ? "rotate-45 border-persimmon bg-persimmon text-cream" : "group-hover:bg-citrus"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div className="grid transition-all duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
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

import { useEffect, useId, useRef, useState } from "react";
import { faqs, plans, smsTo } from "../lib/data";
import { useGlobalReveal } from "../lib/hooks";

export function Grower() {
  useGlobalReveal();
  const video = useRef<HTMLVideoElement>(null);
  // This island hydrates as the section scrolls into view, so the video only downloads then.
  // It plays once (about 3s, under WCAG's 5s limit for motion without a pause button) and holds on the
  // last frame. Visitors who ask for reduced motion keep the still.
  useEffect(() => {
    const v = video.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <section id="grower" className="relative overflow-hidden px-5 py-14 md:px-8 md:py-20">
      <span id="about" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-start gap-14 lg:grid-cols-12 lg:items-center">
        <div className="reveal relative lg:col-span-5">
          <div className="clip-reveal relative aspect-video overflow-hidden rounded-[40px] bg-blush shadow-xl">
            <video
              ref={video}
              src="/images/studio-desk.mp4"
              poster="/images/studio-desk.webp"
              muted
              playsInline
              preload="none"
              aria-label="Animation: an empty desk fills up with code and website plans on two screens"
              className="h-full w-full object-cover"
            />
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
          <h2 className="font-display h-section">
            <span className="line-mask"><span>One person.</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>Start to finish.</span></span>
          </h2>
          <div className="reveal mt-8 max-w-2xl space-y-5 text-[18px] leading-relaxed text-ink/85">
            <p>
              I'm <strong className="font-semibold">Adam</strong>. Based in Clovis, California, I work with businesses across California and the US — and I do the work myself from start to finish. When you call or text, you talk straight to the person who designed your pages, wrote the code, and configured your search and AI visibility.
            </p>
            <p>
              I write every word from our 15-minute call, align your business across Google Search, Google Maps, Bing, Apple Maps, and Yelp so both search engines and AI assistants recommend you, and wire your analytics so you see every call, text, and lead.
            </p>
            <p className="text-[16px] text-ink/75">
              <strong className="font-semibold text-ink">Agencies and designers:</strong> I also build from your Figma files in Astro, React and TypeScript, under your name. Text me the project and the deadline.
            </p>
          </div>
          <blockquote className="reveal font-display wonk relative mt-10 max-w-2xl border-l-2 border-citrus/60 pl-6 text-[clamp(1.7rem,3vw,2.5rem)] italic leading-[1.15]">
            “You don't rent your website from an agency. You own the code, the domain, and your marketing accounts.”
          </blockquote>
          <div className="mt-12">
            <a href={smsTo("Hi Adam, I read about how you work and I'd like to talk to you directly about my business.")} data-magnetic className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-cream transition-colors hover:bg-persimmon-deep">
              Text me directly →
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
          <h2 className="font-display h-section mx-auto max-w-4xl">
            <span className="line-mask"><span>How we can work</span></span>{" "}
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>together.</span></span>
          </h2>
          <p className="reveal mx-auto mt-6 max-w-2xl text-lg text-ink/80">
            Every engagement is scoped to your goals, your market competition, and the return it can generate for your business. Hire me for a custom website build, a standalone Search &amp; AI overhaul, or an ongoing monthly growth partnership.
          </p>
        </div>

        {/* Scoped Engagement Cards */}
        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-3 lg:gap-8">
            {plans.map((pl) => (
              <div key={pl.code} className="flex flex-col">
                <div
                  className={`relative flex flex-1 flex-col ${pl.color} rounded-[28px] border border-ink/10 p-7 shadow-[0_20px_50px_-25px_rgba(30,43,35,.2)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-20px_rgba(30,43,35,.3)]`}
                >
                  <div className="font-mono text-[11px] uppercase tracking-[.16em] text-ink/80">{pl.kind}</div>
                  <div className="mt-2 font-display wonk text-3xl italic leading-tight text-ink lg:text-4xl">{pl.name}</div>
                  <div className="mt-5 font-display text-2xl font-[420] leading-tight text-ink lg:text-3xl">
                    {pl.price}
                  </div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[.14em] text-ink/80">{pl.time} · {pl.terms}</div>
                  <div className="dotted-rule mt-6 text-ink/30" />
                  <ul className="mt-5 space-y-2.5 text-[15px]">
                    {pl.items.map((it) => (
                      <li key={it} className="flex gap-2.5">
                        <span className="mt-[3px] text-leaf">✓</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  {/* mt-auto: "Best for" and the button sit at the card's foot, level across all three models. */}
                  <p className="mt-auto pt-6 text-[13.5px] leading-snug text-ink/75">
                    <span className="font-semibold text-ink">Best for: </span>
                    {pl.for}
                  </p>
                  <a
                    href="#contact"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("cwd:select-plan", { detail: pl.name }));
                    }}
                    className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-medium text-cream transition hover:bg-persimmon-deep"
                  >
                    {pl.cta ?? `Ask about ${pl.name}`} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Reversal & ROI Guarantee */}
        <div className="reveal mt-16 grid gap-8 border-y border-ink/15 py-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-display text-2xl font-[420] text-ink md:text-3xl">See the website preview before you pay.</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/80">
              For website builds, we talk for 15 minutes and I build a working preview with your real copy that you can open on your phone. If you don't like how it looks and reads, walk away and owe nothing.
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl font-[420] text-ink md:text-3xl">Scoped to pay for itself.</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/80">
              Your scope is tied directly to what a new customer is worth to you and what it takes to win in your market. If I don't see a clear way for a new site or search campaign to earn back its cost, I'll tell you upfront on our first call.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[15px] text-ink/75">
          100% client ownership from day one. Ongoing monthly marketing is strictly month-to-month — pause or cancel anytime with one text.
        </p>
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
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="font-display h-section">
              <span className="line-mask"><span>What people ask</span></span>{" "}
              <span className="line-mask" style={{ ["--d" as string]: "120ms" }}><span>before they text.</span></span>
            </h2>
            <p className="reveal mt-6 text-lg text-ink/75">Didn't see your question? Text it. You'll get a straight answer, even if it's “you don't need a new website yet.”</p>
          </div>
        </div>
        <div className="lg:col-span-7">
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

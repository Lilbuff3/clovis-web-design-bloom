import { useEffect, useRef } from "react";
import { gsap } from "../lib/smooth";
import { VIDEO_ORCHARD } from "../data/content";

/* ------------------------------------------------------------------ */
/* Manifesto — words ripen as you scroll                               */
/* ------------------------------------------------------------------ */
type Tok = string | { img: string; alt: string };
const manifesto: Tok[] = [
  "Most", "websites", "are", "bolted", "together", "from", "the", "same", "parts", "bin.",
  "Mine", "are", "grown", { img: "/images/studio.jpg", alt: "workbench" }, "by", "hand,", "in", "Clovis",
  { img: "/images/hero.jpg", alt: "orchard" }, "—", "one", "business", "at", "a", "time,", "for", "the", "four", "seconds",
  "between", "someone", "searching", "and", "someone", "calling.", { img: "/images/seedling.jpg", alt: "seedling" },
];
const accent = new Set(["grown", "hand,", "four", "seconds"]);

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mf-tok",
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".mf-text", start: "top 78%", end: "bottom 50%", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".mf-pill",
        { scale: 0.3, rotate: -12 },
        {
          scale: 1,
          rotate: 0,
          stagger: 0.3,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".mf-text", start: "top 70%", end: "bottom 55%", scrub: 0.6 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={ref} className="relative px-5 py-28 md:px-8 md:py-44">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[.2em] text-ink/60">
          <span className="h-px w-10 bg-ink/40" />A short manifesto
        </div>
        <p className="mf-text font-display text-[clamp(2rem,4.9vw,4.6rem)] font-[400] leading-[1.08]">
          {manifesto.map((t, i) =>
            typeof t === "string" ? (
              <span key={i} className={`mf-tok ${accent.has(t) ? "wonk italic text-persimmon" : ""}`}>
                {t}{" "}
              </span>
            ) : (
              <span key={i} className="mf-tok mf-pill mx-[0.08em] inline-block h-[0.78em] w-[1.6em] overflow-hidden rounded-full align-[-0.06em] shadow-md">
                <img src={t.img} alt="" className="h-full w-full object-cover" loading="lazy" />
              </span>
            )
          )}
        </p>
        <div className="mt-10 flex items-center gap-3">
          <span className="font-display wonk text-2xl italic">— Adam</span>
          <span className="font-mono text-[11px] uppercase tracking-[.18em] text-ink/50">builder, Clovis CA</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Valley — pinned arch that blooms into a full-bleed film             */
/* ------------------------------------------------------------------ */
export function ValleyZoom() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: "+=140%", scrub: 1, pin: true, anticipatePin: 1 },
        });
        tl.fromTo(".vz-box", { width: "24vw", height: "46vh", borderRadius: "999px 999px 36px 36px" }, { width: "100vw", height: "100vh", borderRadius: "0px 0px 0px 0px", ease: "power2.inOut" }, 0)
          .fromTo(".vz-media", { scale: 1.45 }, { scale: 1, ease: "power2.inOut" }, 0)
          .to(".vz-left", { xPercent: -140, opacity: 0, ease: "power2.in" }, 0)
          .to(".vz-right", { xPercent: 140, opacity: 0, ease: "power2.in" }, 0)
          .to(".vz-hint", { opacity: 0, duration: 0.15 }, 0)
          .fromTo(".vz-cap > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 0.62);
      });
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(".vz-box", { scale: 0.82, borderRadius: "200px 200px 28px 28px" }, { scale: 1, borderRadius: "28px 28px 28px 28px", ease: "none", scrollTrigger: { trigger: ".vz-box", start: "top bottom", end: "center center", scrub: true } });
        gsap.fromTo(".vz-cap > *", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: ".vz-box", start: "top 40%" } });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="valley" ref={ref} className="relative overflow-hidden px-5 py-10 md:h-screen md:p-0">
      <div className="flex flex-col items-center gap-6 md:absolute md:inset-0 md:flex-row md:justify-center md:gap-0">
        <div className="vz-left font-display text-[clamp(2.6rem,6.4vw,7.5rem)] font-[420] leading-none md:absolute md:left-[5vw] md:top-1/2 md:-translate-y-1/2">
          Made <em className="wonk text-persimmon">in</em>
        </div>
        <div className="vz-box relative h-[70vh] w-full overflow-hidden rounded-[28px] bg-leaf shadow-[0_40px_80px_-40px_rgba(30,43,35,.6)]">
          <div className="vz-media absolute inset-0">
            <video src={VIDEO_ORCHARD} autoPlay muted loop playsInline poster="/images/hero.jpg" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
          <div className="vz-cap absolute inset-x-0 bottom-0 p-6 text-cream md:p-14">
            <div className="font-mono text-[11px] uppercase tracking-[.2em] text-citrus">Fresno · Clovis · Madera · the Central Valley</div>
            <h2 className="font-display mt-4 max-w-4xl text-[clamp(2rem,5vw,5rem)] font-[400] leading-[0.98]">
              Built for where your customers actually are — <em className="wonk text-citrus">on a phone, in a truck, between jobs.</em>
            </h2>
            <a href="#test" data-magnetic className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 font-medium text-ink transition-colors hover:bg-citrus">
              See why speed wins <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
        <div className="vz-right font-display text-[clamp(2.6rem,6.4vw,7.5rem)] font-[420] leading-none md:absolute md:right-[5vw] md:top-1/2 md:-translate-y-1/2">
          the <em className="wonk">Valley.</em>
        </div>
      </div>
      <div className="vz-hint absolute bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-[11px] uppercase tracking-[.2em] text-ink/50 md:block">Keep scrolling</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rules — horizontal pinned gallery                                   */
/* ------------------------------------------------------------------ */
const rules = [
  { rule: "No templates sold as custom. Ever.", note: "Every line is written for your business. If something's reused, you'll hear it from me first.", cls: "bg-persimmon text-cream", accent: "text-citrus" },
  { rule: "Prices published — never behind a phone call.", note: "What's on the tag is what you pay. No “let's hop on a call to discuss budget.”", cls: "bg-cream text-ink", accent: "text-persimmon" },
  { rule: "You keep the code, the domain and the logins.", note: "Handed over on launch day, in your name. Leave whenever you like — no permission needed.", cls: "bg-leaf text-cream", accent: "text-citrus" },
  { rule: "I don't disappear. When you text, I answer.", note: "The person who wrote the code is the person who picks up. No ticket queue, ever.", cls: "bg-sky text-ink", accent: "text-leaf" },
  { rule: "If one page is enough, that's what I'll tell you.", note: "Sometimes the honest answer is “you don't need me yet.” You'll get that answer.", cls: "bg-ink text-cream", accent: "text-citrus" },
];

function RuleIcon({ i }: { i: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 md:h-16 md:w-16" aria-hidden>
      {i === 0 && (<><rect x="10" y="12" width="44" height="40" rx="6" {...common} /><path d="M18 24h28M18 32h20M18 40h14" {...common} /><path d="M44 38l8 8M52 38l-8 8" {...common} /></>)}
      {i === 1 && (<><path d="M12 30 L32 10 H52 V30 L32 50 Z" {...common} /><circle cx="43" cy="19" r="3.5" {...common} /></>)}
      {i === 2 && (<><circle cx="22" cy="32" r="10" {...common} /><path d="M32 32h22M46 32v8M52 32v6" {...common} /></>)}
      {i === 3 && (<><path d="M12 14h40v28H26l-10 10V42h-4z" {...common} /><path d="M22 26h20M22 32h12" {...common} /></>)}
      {i === 4 && (<><path d="M32 54V26" {...common} /><path d="M32 34c-10 0-16-6-16-16 10 0 16 6 16 16zM32 28c0-9 6-15 15-15 0 9-6 15-15 15z" {...common} /></>)}
    </svg>
  );
}

export function RulesGallery() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.fromTo(".rg-bar", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + dist(), scrub: true, invalidateOnRefresh: true } });
        gsap.utils.toArray<HTMLElement>(".rg-card").forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotate: i % 2 ? -7 : 7, yPercent: 10, scale: 0.9 },
            { rotate: 0, yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 100%", end: "left 45%", scrub: true } }
          );
          const num = card.querySelector(".rg-num");
          if (num) gsap.fromTo(num, { xPercent: 40 }, { xPercent: -20, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="rules" ref={ref} className="relative overflow-hidden py-24 md:h-screen md:py-0">
      <div className="md:flex md:h-full md:items-center">
        <div
          ref={track}
          data-cursor="Scroll"
          className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:w-max md:snap-none md:gap-8 md:overflow-visible md:px-[6vw] md:pb-0"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center md:w-[40vw] md:pr-10">
            <div className="font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">Rules of the orchard</div>
            <h2 className="font-display mt-5 text-[clamp(2.8rem,5.6vw,6rem)] font-[420] leading-[0.92]">
              Five rules, <em className="wonk text-leaf">nailed to the barn door.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">How the practice runs, in writing, so you can hold me to it.</p>
            <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.2em] text-ink/60">
              <span className="hidden md:inline">Scroll</span>
              <span className="md:hidden">Swipe</span>
              <span className="inline-block h-px w-16 bg-ink/40" />→
            </div>
          </div>
          {rules.map((r, i) => (
            <article
              key={r.rule}
              className={`rg-card relative flex h-[62vh] min-h-[420px] w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[36px] p-7 shadow-[0_40px_70px_-40px_rgba(30,43,35,.55)] md:h-[70vh] md:w-[34vw] md:p-10 ${r.cls}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[.2em] opacity-70">Rule {String(i + 1).padStart(2, "0")} / 05</span>
                <span className={r.accent}>
                  <RuleIcon i={i} />
                </span>
              </div>
              <span className={`rg-num font-display wonk pointer-events-none absolute -bottom-10 right-2 select-none text-[14rem] italic leading-none opacity-[.14] md:text-[20rem]`}>
                {i + 1}
              </span>
              <div className="relative">
                <h3 className="font-display text-[clamp(1.9rem,2.8vw,3rem)] font-[420] leading-[1.02]">{r.rule}</h3>
                <p className="mt-4 max-w-sm text-[15.5px] leading-relaxed opacity-80">{r.note}</p>
              </div>
            </article>
          ))}
          <div className="hidden w-[6vw] shrink-0 md:block" />
        </div>
      </div>
      <div className="absolute inset-x-[6vw] bottom-10 hidden h-[3px] overflow-hidden rounded-full bg-ink/10 md:block">
        <div className="rg-bar h-full origin-left bg-persimmon" />
      </div>
    </section>
  );
}

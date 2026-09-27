/* ------------------------------------------------------------------ */
/* Manifesto — words ripen as you scroll                               */
/* ------------------------------------------------------------------ */
type Tok = string | { img: string; alt: string };
const manifesto: Tok[] = [
  "Most", "agency", "websites", "are", "bolted", "together", "from", "the", "same", "slow", "templates.",
  "Mine", "are", "crafted", { img: "/images/studio.jpg", alt: "workbench" }, "by", "hand,", "in", "Clovis",
  { img: "/images/hero.jpg", alt: "orchard" }, "—", "one", "business", "at", "a", "time,", "for", "the", "four", "seconds",
  "between", "someone", "searching", "and", "someone", "calling.", { img: "/images/seedling.jpg", alt: "code" },
];
const accent = new Set(["crafted", "hand,", "four", "seconds"]);

export function Manifesto() {
  return (
    <section id="manifesto" className="relative px-5 py-28 md:px-8 md:py-44">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[.2em] text-ink/60">
          <span className="h-px w-10 bg-ink/40" />A short manifesto
        </div>
        <p className="reveal mf-text font-display text-[clamp(2rem,4.9vw,4.6rem)] font-[400] leading-[1.08]">
          {manifesto.map((t, i) =>
            typeof t === "string" ? (
              <span key={i} className={`mf-tok ${accent.has(t) ? "wonk italic text-persimmon" : ""}`}>
                {t}{" "}
              </span>
            ) : (
              <span key={i} className="mf-tok mf-pill mx-[0.08em] inline-block h-[0.78em] w-[1.6em] overflow-hidden rounded-full align-[-0.06em] shadow-md">
                <img src={t.img} alt={t.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
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
/* Valley — landscape showcase                                         */
/* ------------------------------------------------------------------ */
export function ValleyZoom() {
  return (
    <section id="valley" className="relative overflow-hidden px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="vz-box relative h-[70vh] min-h-[500px] w-full overflow-hidden rounded-[28px] bg-leaf shadow-[0_40px_80px_-40px_rgba(30,43,35,.6)]">
          <div className="vz-media absolute inset-0">
            <img
              src="/images/valley-orchard.jpg"
              alt="Central Valley orchard landscape"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="vz-cap absolute inset-x-0 bottom-0 p-6 text-cream md:p-14">
            <div className="font-mono text-[11px] uppercase tracking-[.2em] text-citrus">Fresno · Clovis · Madera · the Central Valley</div>
            <h2 className="font-display mt-4 max-w-4xl text-[clamp(2rem,5vw,4.5rem)] font-[400] leading-[0.98]">
              Built for where your customers actually are — <em className="wonk text-citrus">on a phone, in a truck, between jobs.</em>
            </h2>
            <a href="#test" className="mt-8 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 font-medium text-ink transition-colors hover:bg-citrus">
              See why speed wins <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rules — horizontal scroll-snap gallery                             */
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
    <svg viewBox="0 0 64 64" className="h-14 w-14 md:h-16 md:w-16" aria-hidden="true">
      {i === 0 && (<><rect x="10" y="12" width="44" height="40" rx="6" {...common} /><path d="M18 24h28M18 32h20M18 40h14" {...common} /><path d="M44 38l8 8M52 38l-8 8" {...common} /></>)}
      {i === 1 && (<><path d="M12 30 L32 10 H52 V30 L32 50 Z" {...common} /><circle cx="43" cy="19" r="3.5" {...common} /></>)}
      {i === 2 && (<><circle cx="22" cy="32" r="10" {...common} /><path d="M32 32h22M46 32v8M52 32v6" {...common} /></>)}
      {i === 3 && (<><path d="M12 14h40v28H26l-10 10V42h-4z" {...common} /><path d="M22 26h20M22 32h12" {...common} /></>)}
      {i === 4 && (<><path d="M32 54V26" {...common} /><path d="M32 34c-10 0-16-6-16-16 10 0 16 6 16 16zM32 28c0-9 6-15 15-15 0 9-6 15-15 15z" {...common} /></>)}
    </svg>
  );
}

export function RulesGallery() {
  return (
    <section id="rules" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 max-w-xl">
          <div className="font-mono text-[11px] uppercase tracking-[.2em] text-persimmon">Our Commitments</div>
          <h2 className="font-display mt-4 text-[clamp(2.5rem,5.2vw,5rem)] font-[420] leading-[0.95]">
            Five standards, <em className="wonk text-leaf">put in writing.</em>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">How I work with every business, in writing, so you can hold me to it.</p>
        </div>

        <div className="flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-6 [scrollbar-width:none]">
          {rules.map((r, i) => (
            <article
              key={r.rule}
              className={`rg-card relative flex h-[520px] w-[85vw] max-w-[420px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[36px] p-8 shadow-[0_30px_60px_-30px_rgba(30,43,35,.4)] md:w-[380px] ${r.cls}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[.2em] opacity-70">Rule {String(i + 1).padStart(2, "0")} / 05</span>
                <span className={r.accent}>
                  <RuleIcon i={i} />
                </span>
              </div>
              <span className="rg-num font-display wonk pointer-events-none absolute -bottom-10 right-2 select-none text-[12rem] italic leading-none opacity-[.14]">
                {i + 1}
              </span>
              <div className="relative">
                <h3 className="font-display text-[clamp(1.8rem,2.5vw,2.4rem)] font-[420] leading-[1.05]">{r.rule}</h3>
                <p className="mt-4 text-[15px] leading-relaxed opacity-85">{r.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

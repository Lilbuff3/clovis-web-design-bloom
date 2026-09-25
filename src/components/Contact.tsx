import { useState } from "react";
import { studio, VIDEO_SHADOW } from "../data/content";
import { AmbientVideo } from "./primitives";
import { buildSmsHref, contactMessage } from "../utils/sms";
import { SunMark } from "./Chrome";

const needs = ["A one-page site ($500)", "A few pages + Spanish", "Something bigger", "Not sure yet"];
const whens = ["ASAP", "This month", "Just looking"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[14.5px] transition-all duration-300 ${
        active ? "scale-[1.03] border-ink bg-ink text-cream" : "border-ink/20 bg-cream/70 hover:border-ink/50 hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}

export function Contact() {
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [need, setNeed] = useState(needs[0]);
  const [when, setWhen] = useState(whens[0]);

  const message = contactMessage(name, trade, need, when);
  const smsHref = buildSmsHref(studio.smsHref, message);

  return (
    <section id="contact" className="relative overflow-hidden rounded-b-[40px] px-5 py-24 md:rounded-b-[72px] md:px-8 md:py-36">
      <AmbientVideo
        {...VIDEO_SHADOW}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.14] mix-blend-multiply grayscale"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="reveal font-mono text-[11px] uppercase tracking-[.2em] text-persimmon-deep">09 — The front gate</div>
          <h2 className="font-display mt-5 text-[clamp(3rem,8vw,7.5rem)] font-[420] leading-[0.9]">
            <span className="line-mask"><span>Start with</span></span>
            <span className="line-mask" style={{ ["--d" as string]: "120ms" }}>
              <span>
                <em className="wonk text-persimmon">a text.</em>
              </span>
            </span>
          </h2>
          <p className="reveal mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            No forms to wade through, no call you didn't ask for. Tap a few things below and I'll write the first message for you — even if you don't have a website yet.
          </p>

          <div className="reveal mt-10 space-y-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maria"
                  className="mt-2 w-full border-b-2 border-ink/25 bg-transparent py-2 font-display text-2xl outline-none transition placeholder:text-ink/30 focus:border-persimmon"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">What you do</span>
                <input
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  placeholder="a taquería in Old Town"
                  className="mt-2 w-full border-b-2 border-ink/25 bg-transparent py-2 font-display text-2xl outline-none transition placeholder:text-ink/30 focus:border-persimmon"
                />
              </label>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">What you need</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {needs.map((n) => (
                  <Chip key={n} active={need === n} onClick={() => setNeed(n)}>
                    {n}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/60">When</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {whens.map((w) => (
                  <Chip key={w} active={when === w} onClick={() => setWhen(w)}>
                    {w}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="reveal mx-auto w-full max-w-[360px] rotate-[2deg] transition-transform duration-700 hover:rotate-0">
            <div className="rounded-[48px] bg-ink p-3 shadow-[0_60px_100px_-40px_rgba(30,43,35,.6)]">
              <div className="overflow-hidden rounded-[38px] bg-[#fbf8f2]">
                <div className="flex flex-col items-center border-b border-ink/10 bg-cream/80 px-4 pb-3 pt-8">
                  <SunMark className="h-12 w-12" />
                  <div className="mt-1 text-[13px] font-semibold">Adam · Clovis Web Design</div>
                  <div className="font-mono text-[10px] text-ink/50">{studio.phoneDisplay}</div>
                </div>
                <div className="flex min-h-[260px] flex-col justify-end gap-2 px-4 py-5">
                  <div
                    key={message}
                    className="max-w-[90%] self-end rounded-3xl rounded-br-md bg-persimmon px-4 py-3 text-[14px] leading-snug text-white shadow-md"
                    style={{ animation: "pop .35s cubic-bezier(.3,1.4,.5,1)" }}
                  >
                    {message}
                  </div>
                  <div className="self-end font-mono text-[9px] text-ink/40">Preview · ready to send</div>
                </div>
                <div className="flex items-center gap-2 border-t border-ink/10 px-3 py-3">
                  <div className="flex-1 truncate rounded-full border border-ink/15 px-4 py-2 text-[13px] text-ink/40">iMessage</div>
                  <a href={smsHref} className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon text-white transition hover:scale-110" aria-label="Send text">
                    ↑
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a href={smsHref} data-magnetic="0.2" className="flex w-full max-w-[360px] items-center justify-center gap-2 rounded-full bg-ink py-4 text-lg text-cream transition-colors hover:bg-persimmon">
              Send this to Adam →
            </a>
            <a href={studio.phoneHref} className="text-[15px] underline decoration-persimmon decoration-2 underline-offset-4">
              or just call {studio.phoneDisplay}
            </a>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 text-center">
            {[
              ["Cost to ask", "Nothing"],
              ["Who answers", "Adam"],
              ["Launch price", "$500"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-cream/70 px-2 py-3">
                <div className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/55">{k}</div>
                <div className="font-display mt-1 text-xl">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

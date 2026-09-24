import type { ReactNode } from "react";
import { ChapterIndicator, Marquee, Nav, SunCursor } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { FourSeconds } from "./components/FourSeconds";
import { Harvest } from "./components/Harvest";
import { Compare, Season } from "./components/Season";
import { FAQ, Grower, Letters, Stand } from "./components/Story";
import { Contact, Footer } from "./components/Contact";
import { Manifesto, RulesGallery, ValleyZoom } from "./components/Scenes";
import { Preloader } from "./components/Preloader";
import { useGlobalReveal } from "./lib/hooks";
import { useAutoRefresh, useChapterTriggers, useMagnetic, useParallax } from "./lib/motion";
import { useChapter } from "./lib/smooth";
import { PHONE_DISPLAY, SMS_LINK } from "./lib/data";

function MobileTextBar() {
  return (
    <a
      href={SMS_LINK}
      className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-full bg-ink py-2 pl-5 pr-2 text-cream shadow-2xl sm:hidden"
    >
      <span className="text-[15px]">Text Adam · {PHONE_DISPLAY}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon">→</span>
    </a>
  );
}

/** The page canvas — its colour melts from chapter to chapter as you scroll. */
function Canvas({ children }: { children: ReactNode }) {
  const c = useChapter();
  return (
    <main
      className="relative z-10 rounded-b-[40px] shadow-[0_40px_60px_-30px_rgba(30,43,35,.35)] md:rounded-b-[72px]"
      style={{ backgroundColor: c.bg }}
    >
      {children}
    </main>
  );
}

export default function App() {
  useChapterTriggers();
  useParallax();
  useMagnetic();
  useGlobalReveal();
  useAutoRefresh();

  return (
    <div className="grain relative">
      <Preloader />
      <SunCursor />
      <Nav />
      <ChapterIndicator />
      <Canvas>
        <Hero />
        <Marquee
          className="bg-persimmon text-cream"
          items={["$500 landing pages", "Live in a week", "100/100 PageSpeed", "You own the code", "No monthly hostage fees", "English + Español", "Your cell, not a ticket queue"]}
        />
        <Manifesto />
        <ValleyZoom />
        <FourSeconds />
        <Harvest />
        <Season />
        <Compare />
        <Grower />
        <RulesGallery />
        <Stand />
        <Marquee
          reverse
          base={0.5}
          className="-rotate-[1.5deg] scale-[1.03] bg-leaf text-cream"
          items={["Hand-built", "No page builders", "Built for two bars of signal", "Text-to-book", "Bilingual when you need it", "Nothing to log into"]}
        />
        <Letters />
        <FAQ />
        <Contact />
      </Canvas>
      <Footer />
      <MobileTextBar />
    </div>
  );
}

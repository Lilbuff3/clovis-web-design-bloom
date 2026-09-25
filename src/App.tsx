import { useEffect, useState, type ReactNode } from "react";
import { ChapterIndicator, Marquee, Nav, SunCursor } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { FourSeconds } from "./components/FourSeconds";
import { Harvest } from "./components/Harvest";
import { Boost } from "./components/Boost";
import { BoostPage } from "./components/BoostPage";
import { ChapterRail, HOME_CHAPTERS } from "./components/ChapterRail";
import { Compare, Season } from "./components/Season";
import { FAQ, Grower, Letters, Stand } from "./components/Story";
import { Contact, Footer } from "./components/Contact";
import { Manifesto, RulesGallery, ValleyZoom } from "./components/Scenes";
import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/primitives";
import { MobileTextBar } from "./components/MobileTextBar";
import { useGlobalReveal } from "./lib/hooks";
import { useAutoRefresh, useChapterTriggers, useMagnetic, useParallax } from "./lib/motion";
import { getLenis, useChapter } from "./lib/smooth";

function getPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname.toLowerCase();
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
  const [currentPath, setCurrentPath] = useState(getPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      const [pathname, hash] = path.split("#");
      const targetPath = (pathname || "/").toLowerCase();
      window.history.pushState({}, "", path);
      setCurrentPath(targetPath);
      if (hash) {
        setTimeout(() => {
          const target = hash === "top" ? 0 : document.getElementById(hash);
          if (target !== null) {
            try {
              const lenis = getLenis();
              lenis.start();
              lenis.scrollTo(target, { offset: hash === "top" ? 0 : -8, duration: 1.5 });
            } catch {
              const el = document.getElementById(hash);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  useChapterTriggers();
  useParallax();
  useMagnetic();
  useGlobalReveal();
  useAutoRefresh();

  // Dedicated /boost high-conversion route
  if (currentPath === "/boost" || currentPath === "/boost/") {
    return <BoostPage onNavigate={navigateTo} />;
  }

  return (
    <div className="grain relative">
      <Preloader />
      <ScrollProgress />
      <SunCursor />
      <ChapterRail chapters={HOME_CHAPTERS} />
      <Nav onNavigate={navigateTo} />
      <ChapterIndicator />
      <Canvas>
        <Hero />
        <Marquee
          className="bg-persimmon text-cream"
          items={[
            "$500 landing pages",
            "Live in a week",
            "100/100 PageSpeed",
            "You own the code",
            "No monthly hostage fees",
            "English + Español",
            "Your cell, not a ticket queue",
          ]}
        />
        <Manifesto />
        <ValleyZoom />
        <FourSeconds />
        <Harvest />
        <Boost onNavigate={navigateTo} />
        <Season />
        <Compare />
        <Grower />
        <RulesGallery />
        <Stand />
        <Marquee
          reverse
          base={0.5}
          className="-rotate-[1.5deg] scale-[1.03] bg-leaf text-cream"
          items={[
            "Hand-built",
            "No page builders",
            "Built for two bars of signal",
            "Text-to-book",
            "Bilingual when you need it",
            "Nothing to log into",
          ]}
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

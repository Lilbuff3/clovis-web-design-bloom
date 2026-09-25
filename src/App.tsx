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
import { scrollToSection, useChapter } from "./lib/smooth";
import { useSilentClean } from "./utils/utm";

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

function updateSeo(path: string) {
  if (typeof document === "undefined") return;
  const isBoost = path === "/boost" || path === "/boost/";
  if (isBoost) {
    document.title = "Conversion Boost™ — Clovis Web Design | Mobile Speed & Local SEO Audit";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://cloviswebdesign.com/boost");

    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", "Stop losing local calls to a four-second mobile lag. Hand-built websites that score 100/100 on Google PageSpeed for Fresno & Clovis businesses. Launch the loss calculator.");
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://cloviswebdesign.com/boost");

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Conversion Boost™ — Stop Losing Local Calls | Clovis Web Design");
  } else {
    document.title = "Clovis Web Design — Hand-grown websites for Fresno & the Central Valley";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://cloviswebdesign.com/");

    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", "Fast, hand-built websites grown in Clovis, CA by Adam Youssef. Landing pages from $500, live in a week. You own the code, the domain, everything.");
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://cloviswebdesign.com/");

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", "Clovis Web Design — Hand-grown websites for Fresno & the Central Valley");
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getPath);

  useSilentClean(currentPath);

  useEffect(() => {
    updateSeo(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => {
      const p = getPath();
      setCurrentPath(p);
      updateSeo(p);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Direct loads like cloviswebdesign.com/#faq
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.length > 1) {
      scrollToSection(window.location.hash.slice(1));
    }
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      const [pathname, hash] = path.split("#");
      const targetPath = (pathname || "/").toLowerCase();
      window.history.pushState({}, "", path);
      setCurrentPath(targetPath);
      if (hash) {
        // Give the homepage a moment to mount before measuring it.
        setTimeout(() => scrollToSection(hash), 120);
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

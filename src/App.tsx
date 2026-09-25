import { useEffect, useState, type ReactNode } from "react";
import { ChapterIndicator, Marquee, SunCursor } from "./components/Chrome";
import { Header } from "./components/Header";
import { Footer } from "./components/BespokeFooter";
import { Hero } from "./components/Hero";
import { FourSeconds } from "./components/FourSeconds";
import { Harvest } from "./components/Harvest";
import { Boost } from "./components/Boost";
import { BoostPage } from "./components/BoostPage";
import { MedicalPage } from "./components/MedicalPage";
import { medical, studio, texts } from "./data/content";
import { ChapterRail, HOME_CHAPTERS } from "./components/ChapterRail";
import { Compare, Season } from "./components/Season";
import { FAQ, Grower, Letters, Stand } from "./components/Story";
import { Contact } from "./components/Contact";
import { Manifesto, RulesGallery, ValleyZoom } from "./components/Scenes";
import { Preloader } from "./components/Preloader";
import { ScrollProgress } from "./components/primitives";
import { MobileTextBar } from "./components/MobileTextBar";
import { useDesktopTextFallback, useGlobalReveal } from "./lib/hooks";
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

/** Client-side SEO for pushState navigation. Crawlers get each page's own HTML from the build. */
const SEO: Record<string, { title: string; description: string; ogTitle?: string }> = {
  "/": {
    title: "Clovis Web Design — Hand-grown websites for Fresno & the Central Valley",
    description: "Fast, hand-built websites grown in Clovis, CA by Adam Youssef. Landing pages from $500, live in a week. You own the code, the domain, everything.",
  },
  "/boost": {
    title: "Conversion Boost™ — Clovis Web Design | Mobile Speed & Local SEO Audit",
    description: "Stop losing local calls to a four-second mobile lag. Hand-built websites that score 100/100 on Google PageSpeed for Fresno & Clovis businesses. Launch the loss calculator.",
    ogTitle: "Conversion Boost™ — Stop Losing Local Calls | Clovis Web Design",
  },
  [medical.path]: medical.seo,
};

/** Ignores a trailing slash; unknown paths fall back to the homepage. */
function pageOf(path: string) {
  const p = path.replace(/\/+$/, "") || "/";
  return p in SEO ? p : "/";
}

function updateSeo(path: string) {
  if (typeof document === "undefined") return;
  const page = pageOf(path);
  const { title, description, ogTitle } = SEO[page];
  const url = `https://cloviswebdesign.com${page}`;
  document.title = title;

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", url);
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", ogTitle ?? title);
}

export default function App() {
  const [currentPath] = useState(getPath);

  useSilentClean(currentPath);

  useEffect(() => {
    updateSeo(currentPath);
  }, [currentPath]);

  // Direct loads like cloviswebdesign.com/#faq
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.length > 1) {
      scrollToSection(window.location.hash.slice(1));
    }
  }, []);

  // Every call goes to another page, and each page is its own prerendered file, so load it for real.
  // The motion and reveal hooks below only run on first mount: swapping pages in place left the
  // homepage invisible.
  const navigateTo = (path: string) => window.location.assign(path);

  useDesktopTextFallback(`${texts.onComputer} ${studio.phoneDisplay}`);
  useChapterTriggers();
  useParallax();
  useMagnetic();
  useGlobalReveal();
  useAutoRefresh();

  const page = pageOf(currentPath);
  if (page === "/boost") return <BoostPage onNavigate={navigateTo} />;
  if (page === medical.path) return <MedicalPage onNavigate={navigateTo} />;

  return (
    <div className="grain relative overflow-x-clip">
      <Preloader />
      <ScrollProgress />
      <SunCursor />
      <ChapterRail chapters={HOME_CHAPTERS} />
      <Header onNavigate={navigateTo} />
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

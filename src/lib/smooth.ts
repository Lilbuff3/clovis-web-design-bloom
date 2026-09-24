import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Lenis singleton — smooth scroll synced to GSAP's ticker             */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;

export function getLenis(): Lenis {
  if (lenis) return lenis;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth in-page anchors everywhere
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href")!;
    if (href.length < 2) return;
    const target = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
    if (target === null) return;
    e.preventDefault();
    lenis?.start();
    lenis?.scrollTo(target, { offset: href === "#top" ? 0 : -8, duration: 1.8 });
  });

  return lenis;
}

/* ------------------------------------------------------------------ */
/* Intro signal — hero waits for the preloader curtain                 */
/* ------------------------------------------------------------------ */
let introDone = false;
export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}
export function onIntroDone(cb: () => void) {
  if (introDone) {
    cb();
    return () => {};
  }
  window.addEventListener("intro:done", cb, { once: true });
  return () => window.removeEventListener("intro:done", cb);
}

/* ------------------------------------------------------------------ */
/* Chapters — drives background colour morph, nav state, indicator     */
/* ------------------------------------------------------------------ */
export const CHAPTERS = [
  { id: "top", name: "Sunrise", bg: "#f7f0e3" },
  { id: "manifesto", name: "Manifesto", bg: "#fcf8f0" },
  { id: "valley", name: "The Valley", bg: "#fcf8f0" },
  { id: "test", name: "The test", bg: "#f7f0e3" },
  { id: "harvest", name: "Harvest", bg: "#f3e9d6" },
  { id: "season", name: "Process", bg: "#fcf8f0" },
  { id: "compare", name: "Farm stand?", bg: "#dbe5cf" },
  { id: "grower", name: "The grower", bg: "#f7f0e3" },
  { id: "rules", name: "Rules", bg: "#fbe7c4" },
  { id: "stand", name: "Prices", bg: "#f3e9d6" },
  { id: "letters", name: "Letters", bg: "#d8e7f0" },
  { id: "faq", name: "Questions", bg: "#f7f0e3" },
  { id: "contact", name: "Say hello", bg: "#f7d3bf" },
] as const;

export type Chapter = (typeof CHAPTERS)[number] & { index: number };

let current: Chapter = { ...CHAPTERS[0], index: 0 };
const subs = new Set<() => void>();

export function setChapter(i: number) {
  if (current.index === i) return;
  current = { ...CHAPTERS[i], index: i };
  subs.forEach((s) => s());
}
export function useChapter() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => current
  );
}

export { gsap, ScrollTrigger };

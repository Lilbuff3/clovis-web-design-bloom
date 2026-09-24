import { useEffect } from "react";
import { CHAPTERS, getLenis, gsap, ScrollTrigger, setChapter } from "./smooth";

/** Boot Lenis + register chapter triggers (bg colour morph / nav state). */
export function useChapterTriggers() {
  useEffect(() => {
    getLenis();
    const ctx = gsap.context(() => {
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const parent = el.parentElement;
        const trigger = parent && parent.classList.contains("pin-spacer") ? parent : el;
        ScrollTrigger.create({
          trigger,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setChapter(i),
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);
}

/** Re-measure all ScrollTriggers whenever the page height changes (accordions, toggles, images). */
export function useAutoRefresh() {
  useEffect(() => {
    let last = document.body.scrollHeight;
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - last) > 2) {
          last = h;
          ScrollTrigger.refresh();
          last = document.body.scrollHeight;
        }
      }, 180);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);
}

/** Elements with [data-magnetic] get pulled toward the pointer with an elastic settle. */
export function useMagnetic() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = els.map((el) => {
      const strength = Number(el.dataset.magnetic) || 0.35;
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, []);
}

/** Elements with [data-speed="0.3"] drift at a different rate than the scroll. */
export function useParallax() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const s = Number(el.dataset.speed) || 0.2;
        gsap.fromTo(
          el,
          { y: s * 140 },
          { y: -s * 140, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
      // Footer rises out from beneath the page
      const f = document.querySelector("[data-footer-inner]");
      if (f) {
        gsap.fromTo(
          f,
          { yPercent: -35, opacity: 0.4 },
          { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: "footer", start: "top bottom", end: "bottom bottom", scrub: true } }
        );
      }
    });
    return () => ctx.revert();
  }, []);
}

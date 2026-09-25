import { useEffect, useRef, useState, type RefObject } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** IX2 "Scroll into view" — adds `is-in` once the element enters the viewport */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView] as const;
}

/**
 * IX2 "While scrolling in view" — returns 0→1 progress of the element
 * travelling through the viewport. Writes to a callback to avoid re-renders.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  mode: "through" | "sticky" = "through"
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "sticky") {
        const total = r.height - vh;
        p = total <= 0 ? 0 : -r.top / total;
      } else {
        p = (vh - r.top) / (vh + r.height);
      }
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
}

/** Subtle parallax — translates the element on Y relative to scroll */
export function useParallax<T extends HTMLElement>(strength = 60) {
  const ref = useRef<T>(null);
  const wrap = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    wrap.current = el.parentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const host = wrap.current ?? el;
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - r.top) / (vh + r.height); // 0..1
      const y = (p - 0.5) * strength * 2;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/** Magnetic micro-interaction — element drifts toward the cursor */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}

/** Animated count-up once visible */
export function useCountUp(target: number, run: boolean = true, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(parseFloat((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration, decimals]);
  return value;
}

/**
 * Variable-font kinetic typography hook.
 * Dynamically shifts optical weight (wght 340 -> 820) and softness (SOFT 100 -> 0)
 * on individual character spans based on pointer proximity with smoothstep easing.
 */
export function useKineticModulation(
  containerRef: RefObject<HTMLElement | null>,
  charSelector = ".hero_char",
  radius = 260
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>(charSelector));
    if (chars.length === 0) return;

    let mx = -9999,
      my = -9999,
      raf = 0;

    const render = () => {
      raf = 0;
      for (const c of chars) {
        const r = c.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 1 - d / radius);
        const e = f * f * (3 - 2 * f); // smoothstep
        const isItalic = c.parentElement?.classList.contains("is-italic") || c.classList.contains("is-italic");
        const base = isItalic ? 380 : 340;
        const targetWght = Math.round(base + e * 480);
        const targetSoft = Math.round(100 - e * 100);
        const targetWonk = isItalic ? 1 : 0;
        c.style.fontVariationSettings = `"wght" ${targetWght}, "SOFT" ${targetSoft}, "opsz" 144, "WONK" ${targetWonk}`;
      }
    };

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const leave = () => {
      mx = my = -9999;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const host = root.closest("section") || root;
    host.addEventListener("pointermove", move as EventListener);
    host.addEventListener("pointerleave", leave as EventListener);

    return () => {
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerleave", leave as EventListener);
      cancelAnimationFrame(raf);
    };
  }, [containerRef, charSelector, radius]);
}

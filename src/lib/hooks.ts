import { useEffect, useRef, useState } from "react";

/** Marks every `.reveal` / `.line-mask` / .clip-reveal / [data-reveal] element with `data-in` as it enters the viewport.
 *  An attribute, not a class: React rewrites `className` when a card's classes change, which would hide it again. */
export function useGlobalReveal() {
  useEffect(() => {
    // Skip islands React hasn't hydrated yet: stamping their server HTML makes hydration mismatch.
    // Each of those islands calls this hook itself once it hydrates.
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .line-mask, .clip-reveal, [data-reveal]")).filter(
      (el) => !el.closest("astro-island[ssr]")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
    );

    // Immediately mark visible or already scrolled-past elements to avoid hydration flashes or scroll-up hiding
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.setAttribute("data-in", "");
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);
}

export function usePageScroll() {
  const [y, setY] = useState(0);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    let max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () => {
      max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sy = window.scrollY;
        setY(sy);
        setP(max > 0 ? Math.min(1, sy / max) : 0);
      });
    };
    measure();
    on();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(document.documentElement);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", on);
    };
  }, []);
  return { y, p };
}

/** Count up to a number when visible. Never zeroes out the DOM on mount, so SSR HTML, AI crawlers,
 *  screen readers, and anchor-link jumps always read the real metric value. */
export function useCountUp(target: number, duration = 900) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(target);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    // If already visible in the initial viewport or for small rank numbers (#1, +4), keep exact value
    if (el.getBoundingClientRect().top < window.innerHeight || target <= 5) {
      setVal(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const startVal = Math.max(1, Math.round(target * 0.35));
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setVal(startVal + (target - startVal) * eased);
          if (k < 1) raf = requestAnimationFrame(step);
          else setVal(target);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [ref, val] as const;
}

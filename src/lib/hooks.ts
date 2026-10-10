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
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
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
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setY(window.scrollY);
        setP(max > 0 ? window.scrollY / max : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);
  return { y, p };
}

/** Count up to a number when visible. Starts at the real number, so the built HTML (and anyone without JS) never shows 0. */
export function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(target);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    setVal(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setVal(target * eased);
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);
  return [ref, val] as const;
}

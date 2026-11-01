import { useEffect, useRef, useState } from "react";

export type RevealEnv = {
  innerHeight?: number;
  window?: { innerHeight: number };
  document: {
    documentElement?: any;
    querySelectorAll: (selector: string) => ArrayLike<any>;
    [key: string]: any;
  };
  IntersectionObserver?: new (
    callback: (entries: any[]) => void,
    options?: Record<string, unknown>
  ) => {
    observe: (target: any) => void;
    unobserve: (target: any) => void;
    disconnect?: () => void;
  };
  MutationObserver?: new (
    callback: (mutations: any[]) => void
  ) => {
    observe: (target: any, options?: Record<string, unknown>) => void;
    disconnect?: () => void;
  };
};

/**
 * Marks every `.reveal, .line-mask, .clip-reveal, [data-reveal]` element with `data-in`
 * as it enters the viewport. Skips elements inside unhydrated `<astro-island ssr>` containers
 * until Astro removes the `ssr` attribute upon React hydration, preventing hydration attribute
 * mismatches while requiring zero hook calls inside React components.
 *
 * Defined as a typed function expression with zero interior TS annotations so
 * `initDocumentReveal.toString()` is valid browser JS with zero regex stripping.
 */
export const initDocumentReveal: (env: RevealEnv) => void = function (env) {
  const doc = env.document;
  const IO = env.IntersectionObserver;
  const MO = env.MutationObserver;
  if (!doc || !IO) return;

  const SELECTOR = ".reveal, .line-mask, .clip-reveal, [data-reveal]";
  const io = new IO(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
  );

  function viewportHeight() {
    return env.window ? env.window.innerHeight : env.innerHeight || 0;
  }

  function registerElements(nodes = Array.from(doc.querySelectorAll(SELECTOR))) {
    const vh = viewportHeight();
    nodes.forEach(function (el) {
      if (el.hasAttribute("data-in")) return;
      if (el.closest && el.closest("astro-island[ssr]")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh) {
        el.setAttribute("data-in", "");
      } else {
        io.observe(el);
      }
    });
  }

  registerElements(Array.from(doc.querySelectorAll(SELECTOR)));

  if (MO && doc.documentElement) {
    const mo = new MO(function (mutations) {
      mutations.forEach(function (m) {
        if (
          m.type === "attributes" &&
          m.attributeName === "ssr" &&
          m.target &&
          !m.target.hasAttribute("ssr") &&
          m.target.querySelectorAll
        ) {
          registerElements(Array.from(m.target.querySelectorAll(SELECTOR)));
        }
      });
    });
    mo.observe(doc.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["ssr"],
    });
  }
};

export const INLINE_REVEAL_SCRIPT = `(${initDocumentReveal.toString()})({ window, document, IntersectionObserver: window.IntersectionObserver, MutationObserver: window.MutationObserver });`;

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

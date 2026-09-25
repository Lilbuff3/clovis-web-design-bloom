import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { useInView, useMagnetic } from "../hooks/motion";

/* ---------------------------------------------------------------------------
   Icons
--------------------------------------------------------------------------- */
export const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5.5M13 3V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ---------------------------------------------------------------------------
   Reveal — IX2 "scroll into view" wrapper. Props: as (tag), delay index.
--------------------------------------------------------------------------- */
type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  index?: number;
  style?: CSSProperties;
  id?: string;
};
export function Reveal({ as: Tag = "div", children, className = "", index = 0, style, id }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} id={id} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ "--i": index, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Line-masked heading reveal. Pass lines as array of ReactNodes. */
export function MaskedLines({ lines, className = "", as: Tag = "h2" }: { lines: ReactNode[]; className?: string; as?: ElementType }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} className={`${className} ${inView ? "is-in" : ""}`}>
      {lines.map((line, i) => (
        <span className="reveal-mask" key={i}>
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------------------------------------------------------------------------
   Button component
   Props → Webflow component props:
   - label (Text), href (Link), variant (Variant), showIcon (Visibility), magnetic (Boolean)
--------------------------------------------------------------------------- */
type ButtonProps = {
  label: string;
  href: string;
  variant?: "primary" | "accent" | "light" | "ghost";
  showIcon?: boolean;
  magnetic?: boolean;
  external?: boolean;
  cursorLabel?: string;
  className?: string;
};
export function Button({ label, href, variant = "primary", showIcon = true, magnetic = false, external, cursorLabel, className = "" }: ButtonProps) {
  const mag = useMagnetic<HTMLAnchorElement>(magnetic ? 0.3 : 0);
  const variantClass = variant === "primary" ? "" : `is-${variant}`;
  return (
    <a
      ref={mag}
      href={href}
      className={`button ${variantClass} ${className}`}
      data-cursor={cursorLabel ? "label" : "hover"}
      data-cursor-label={cursorLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{label}</span>
      {showIcon && (
        <span className="button_icon">
          <ArrowIcon size={12} />
        </span>
      )}
    </a>
  );
}

/* ---------------------------------------------------------------------------
   SectionHeader component
   Props: index, label, heading (slot), lede (slot), dark (variant), headingId
--------------------------------------------------------------------------- */
type SectionHeaderProps = {
  index: string;
  label: string;
  heading: ReactNode[];
  lede?: ReactNode;
  dark?: boolean;
  headingId?: string;
};
export function SectionHeader({ index, label, heading, lede, dark, headingId }: SectionHeaderProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`section-header_component ${dark ? "is-dark" : ""} ${inView ? "is-in" : ""}`}>
      <div className="section-header_index text-style-eyebrow">
        <span>
          № {index} — {label}
        </span>
        <span className="section-header_index-line" aria-hidden="true" />
      </div>
      <h2 id={headingId} className="section-header_heading heading-style-h2">
        {heading.map((line, i) => (
          <span className="reveal-mask" key={i}>
            <span style={{ "--i": i } as CSSProperties}>{line}</span>
          </span>
        ))}
      </h2>
      {lede && (
        <div className={`section-header_lede text-size-large reveal ${inView ? "is-in" : ""}`} style={{ "--i": 3 } as CSSProperties}>
          {lede}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Marquee
--------------------------------------------------------------------------- */
export function Marquee({ items, className = "", separator = "✺" }: { items: string[]; className?: string; separator?: string }) {
  const track = (hidden: boolean) => (
    <div className="marquee_track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="marquee_item">
          <span>{item}</span>
          <span className="marquee_sep" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee_component ${className}`}>
      {track(false)}
      {track(true)}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Cursor follower — reads data-cursor / data-cursor-label from targets
--------------------------------------------------------------------------- */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current!;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role='tab'], input, textarea, select");
      el.classList.remove("is-hover", "is-label");
      if (t) {
        const mode = t.dataset.cursor;
        if (mode === "label" && t.dataset.cursorLabel) {
          el.classList.add("is-label");
          if (label.current) label.current.textContent = t.dataset.cursorLabel;
        } else if (mode !== "none") {
          el.classList.add("is-hover");
        }
      }
    };
    const leave = () => el.classList.add("is-hidden");
    const enter = () => el.classList.remove("is-hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);
  return (
    <div ref={root} className="cursor_component" aria-hidden="true">
      <div className="cursor_ring">
        <span ref={label} className="cursor_label" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Scroll progress bar (scrubbed)
--------------------------------------------------------------------------- */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={bar} className="progress_bar" aria-hidden="true" />;
}

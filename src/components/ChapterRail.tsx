import { useEffect, useState } from "react";

export interface Chapter {
  id: string;
  num: string;
  name: string;
}

export const HOME_CHAPTERS: Chapter[] = [
  { id: "top", num: "00", name: "Sunrise" },
  { id: "manifesto", num: "01", name: "Manifesto" },
  { id: "test", num: "02", name: "The Race" },
  { id: "harvest", num: "03", name: "Harvest" },
  { id: "boost", num: "04", name: "Boost Engine" },
  { id: "season", num: "05", name: "7-Day Path" },
  { id: "compare", num: "06", name: "Contrast" },
  { id: "grower", num: "07", name: "The Grower" },
  { id: "stand", num: "08", name: "Plain Fees" },
  { id: "letters", num: "09", name: "Letters" },
  { id: "faq", num: "10", name: "Questions" },
  { id: "contact", num: "11", name: "Direct Cell" },
];

export const BOOST_CHAPTERS: Chapter[] = [
  { id: "boost-top", num: "00", name: "Overview" },
  { id: "boost-calc", num: "01", name: "Loss Calc" },
  { id: "boost-diag", num: "02", name: "5 Friction Points" },
  { id: "boost-teardown", num: "03", name: "Free Teardown" },
  { id: "boost-proof", num: "04", name: "Local Proof" },
  { id: "boost-faq", num: "05", name: "Questions" },
  { id: "boost-closing", num: "06", name: "Intake" },
];

export function ChapterRail({ chapters = HOME_CHAPTERS }: { chapters?: Chapter[] }) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id || "top");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show rail after scrolling past initial hero fold
    const handleScroll = () => {
      setVisible(window.scrollY > 240);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to observe sections with proximity detection
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.3) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.3)
          );
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0.05, 0.2, 0.5],
      }
    );

    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [chapters]);

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  return (
    <nav
      className={`chapter-rail ${visible ? "is-visible" : ""}`}
      aria-label="Page chapter navigation"
      role="navigation"
    >
      <div className="chapter-rail_inner">
        {chapters.map((ch) => {
          const isActive = activeId === ch.id;
          return (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              onClick={(e) => scrollTo(ch.id, e)}
              className={`chapter-rail_item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              data-cursor="label"
              data-cursor-label={ch.name}
            >
              <span className="chapter-rail_dot" aria-hidden="true" />
              <span className="chapter-rail_label">
                <span className="chapter-rail_num font-mono">{ch.num}</span>
                <span className="chapter-rail_name">{ch.name}</span>
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

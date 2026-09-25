# Clovis Web Design — cloviswebdesign.com (live site)

Adam Youssef's web design site, "Bloom" design: hand-grown websites for Fresno & the
Central Valley. React 19 + TypeScript, Vite 7, Tailwind v4, GSAP + Lenis for motion.
`vite-plugin-singlefile` inlines everything into one `dist/index.html`.

This repo **is** the live site. The older Astro repo (`Projects/clovis-web-design`,
FOVEA eye-doctor design) is retired and serves nothing.

## Commands

```bash
npm run dev        # http://localhost:5173
npm run build      # → dist/index.html (single file) + public/ assets
npx tsc --noEmit   # types
python scripts/validate_seo.py   # meta, JSON-LD, sitemap/robots, then live checks
```

## Deploy: a push to `main` is a production deploy

- Vercel project `clovis-web-design-bloom` (team lilbuff3s-projects) is connected to
  `github.com/Lilbuff3/clovis-web-design-bloom`. `main` → production; other branches get
  preview URLs.
- It owns `cloviswebdesign.com`; `www` redirects to the apex. Don't `vercel alias` the
  domain by hand: new deploys stop reaching it.
- Do risky work on a branch and check the preview before merging.
- Vercel Web Analytics: `<Analytics />` from `@vercel/analytics/react` is mounted in
  `src/main.tsx`. It covers the `/boost` route too (pushState is tracked).

## Where things live

- `src/App.tsx`: homepage section order, plus the tiny `/boost` router (pushState).
  `vercel.json` rewrites every path to `index.html` so `/boost` works on reload.
- Copy and facts, in two places for now:
  - `src/lib/data.ts`: phone, videos and the homepage sections (Hero, Harvest, Season, Story, Contact…).
  - `src/data/content.ts`: `studio` (phone, SMS links) and the Header, Boost, BoostPage,
    footer and MobileTextBar content.
  Phone is **(559) 575-3014** in both; change both together.
- Motion: `src/lib/smooth.ts` (Lenis + GSAP ScrollTrigger + chapter colours),
  `src/lib/motion.ts` and `src/lib/hooks.ts` (homepage), `src/hooks/motion.ts` (Hero
  kinetic type, `primitives.tsx`).
- Styles: `src/index.css` holds the Tailwind `@theme` colours/fonts and the shared
  helpers (`.line-mask`, `.reveal`, `.grain`…), and `@import`s `src/styles/`
  (`tokens.css` → `global.css` → `sections-a.css` → `sections-b.css` → `boost.css`).
  A class used in a component must be defined in one of those imported files.
- SEO lives in `index.html` (meta, geo tags, JSON-LD `@graph`) plus `public/robots.txt`,
  `sitemap.xml`, `site.webmanifest`. Keep `scripts/validate_seo.py` passing.
- Fonts load from Google Fonts in `index.html`. Images are in `public/images/`.

## Known debt (consolidate when nobody else is mid-edit)

- Two content modules and two motion-hook modules overlap (`useParallax`, `useMagnetic`,
  `useCountUp` exist twice). Pick one of each.
- `sections-b.css` is a ported stylesheet; most of its ~200 classes are unused.
- The hero videos (`VIDEO_ORCHARD`, `VIDEO_SHADOW`) are hotlinked from Pexels. Host your
  own compressed loops in `public/` instead.

## Rules

- **Headline reveal:** `.line-mask` clips with `overflow: hidden`. Its bottom padding
  (0.2em) is what keeps Fraunces descenders visible under `leading-[0.9x]`. Don't shrink
  it, and keep the hidden `translateY` past (line-height + padding) / line-height.
- **Claims must be true.** Only facts Adam confirmed or that are visible on the live
  client site. Check client sites in a real browser, not curl (they're JS-driven).
- **Voice:** first person singular, plain English, no agency jargon.
- **Geography:** lead with Fresno. Adam is *based* in Clovis.
- **Phones first:** no sideways scroll at 320px, tap targets ≥ 48px. The mobile Text/Call
  bar (`MobileTextBar`) hides while `#contact` or the footer is on screen.
- Respect `prefers-reduced-motion`: reveals and kinetic type must render static.

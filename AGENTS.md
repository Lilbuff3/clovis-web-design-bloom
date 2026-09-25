# Clovis Web Design — cloviswebdesign.com (live site)

Adam Youssef's web design site, "Bloom" design: hand-grown websites for Fresno & the
Central Valley. React 19 + TypeScript, Vite 7, Tailwind v4, GSAP + Lenis for motion.
`vite-plugin-singlefile` inlines everything into one `dist/index.html`.

This repo **is** the live site. The older Astro repo (`Projects/clovis-web-design`,
FOVEA eye-doctor design) is retired and serves nothing.

## Commands

```bash
npm run dev        # http://localhost:5173
npm run build      # → dist/index.html (single file), dist/boost.html, public/ assets
npm test           # UTM attribution tests (scripts/test_utm.js)
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
  `scripts/generate-boost-html.js` writes `dist/boost.html` with /boost's own SEO, and
  `vercel.json` rewrites `/boost` to it and everything else to `index.html`.
- `src/data/content.ts` holds **every word and fact**: `studio` (name, phone, SMS/tel
  links), `navLinks` (both navs), the homepage sections in page order, then
  `boostCases`/`boostFaqs`. Change copy there, not in components. Phone is
  **(559) 575-3014**, and only `studio` should spell it.
- Motion, one home per kind:
  - `src/lib/smooth.ts`: Lenis + GSAP setup, chapter colours, the intro signal, and
    `scrollToSection(id)`, which is how `/#id` links land (from /boost and on direct loads).
  - `src/lib/motion.ts`: page-wide GSAP hooks (chapters, `[data-speed]` parallax,
    `[data-magnetic]`).
  - `src/lib/hooks.ts`: per-element React hooks (reveal, in-view, progress, count-up,
    `useMagneticRef`).
- `src/components/primitives.tsx`: shared bits for /boost and the hero (`Button`,
  `Reveal`, `SectionHeader`, `Cursor`, `ScrollProgress`, `AmbientVideo`).
- Styles: `src/index.css` holds the Tailwind `@theme` colours/fonts and shared helpers
  (`.line-mask`, `.reveal`, `.grain`…), then `@import`s `src/styles/` in cascade order:
  `tokens.css` → `global.css` → `components.css` (the /boost navbar and footer, hero
  kinetic letters, the mobile text bar) → `boost.css`. A class used in a component must be
  defined in one of those files, and a rule no element can match shouldn't be there.
- Video: `public/video/*.mp4` are 9 s muted loops with a crossfaded seam, each with a
  WebP poster from its first frame. Always render them through `AmbientVideo`, which
  plays them only on screen and shows the poster alone under reduced motion or Save-Data.
  Never hotlink stock video.
- SEO lives in `index.html` (meta, geo tags, JSON-LD `@graph`) plus `public/robots.txt`,
  `sitemap.xml`, `site.webmanifest`. Keep `scripts/validate_seo.py` passing.
- Fonts load from Google Fonts in `index.html`. Images are in `public/images/`.

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

# Clovis Web Design

> Brand positioning, sub-second custom websites, Google Maps SEO, AI search optimization (GEO), and GA4 lead attribution for businesses in Clovis, Fresno, the Central Valley, and nationwide ([cloviswebdesign.com](https://cloviswebdesign.com)).

## Tech Stack
- Astro 5 (static output) + React 19 islands (`@astrojs/react`)
- Tailwind CSS v4 (`@tailwindcss/vite`) + TypeScript
- Vercel Edge Functions (`api/ask-gemini.ts`, `api/contact.ts`)

## Commands
```bash
npm install
npm run dev            # Dev server on :4321
npm run sync:discovery # Regenerate public/llms.txt, llms-full.txt, sitemap.xml, and .well-known/ai-catalog.json
npm run build          # Sync discovery manifests + static build into dist/
npm run typecheck      # Strict TypeScript check (tsc --noEmit)
npm test               # Run typecheck, site-check, and verify-e2e suites
```

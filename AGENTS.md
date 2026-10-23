# Clovis Web Design (cloviswebdesign.com) — agent instructions

Adam Youssef's brand positioning, web engineering, search (SEO), and AI search marketing (GEO) studio site. This repo is the live site; the old Astro build in `../clovis-web-design` is retired.

## Stack

- Astro (static output) with React islands (`@astrojs/react`) and Tailwind CSS v4 via `@tailwindcss/vite`.
- `trailingSlash: 'always'`, directory build format, stylesheets inlined for PageSpeed.
- `@/` imports resolve to `src/`.
- `api/ask-gemini.ts` is a Vercel Edge function (Maps-grounded Gemini lookup for the lead audit). It needs `GEMINI_API_KEY`; never hard-code a key.

## Commands

- `npm run dev` — dev server on 4321 (or `$PORT`).
- `npm run build`, `npm run preview`.
- `npm test` — `tests/site-check.test.mjs`, then `tests/verify-e2e.mjs`.

## Deploy

Vercel project `clovis-web-design-bloom`. A push to `main` is a production deploy of cloviswebdesign.com.

## Adam's name

On the site Adam is just "Adam": never his last name, in copy, meta tags or schema. `tests/verify-e2e.mjs` T4.5 checks the built site.

## Positioning & Services

Clovis Web Design offers **five full-lifecycle services** to businesses in Clovis, Fresno, across California, and nationwide:
1. **Brand Positioning & Conversion Copy**
2. **Custom Web Design & Engineering** (`<0.4s` static builds, 100/100 PageSpeed, WCAG 2.1 AA, 100% client ownership)
3. **Search Engine & Google Maps Optimization (SEO)**
4. **AI Search & Answer Engine Optimization (GEO — ChatGPT, Gemini, Claude, Perplexity & Siri)**
5. **AI & Search Lead Attribution & Retention** (GA4 custom AI channels, call/SMS tracking & review automation)

- **Always explain why it matters**: Every service and technical feature must state its commercial impact (more calls, higher conversion, beating AI bot timeouts, winning citations).
- **Scoped to ROI (No fixed retail price tags)**: Do not plaster fixed `$1,500 / $2,500 / $99` retail price stickers on the site. Engagements are scoped to the client's business, market, and ROI—with a working preview before payment on website builds and 100% client ownership of website code.

## SEO: one search per page

Each URL owns one set of searches. Don't add a page that competes with another for them.

| URL | Owns |
| --- | --- |
| `/` | Clovis web design / digital growth studio, brand, custom websites, search & AI marketing overview |
| `/services/` | Full-lifecycle services overview (5 pillars) & agency-vs-direct-engineer comparison |
| `/packages/` | Modular growth packages (`01 Base -> 02 Customize Channels -> 03 Scale`) & scope builder |
| `/services/local-seo-fresno/` | Search Engine, Google Maps 3-Pack & AI Search (GEO) Marketing — full breakdown of how Google, ChatGPT, Gemini, Claude & Siri pick businesses |
| `/services/medical-web-design/` | Medical, dental and healthcare practice web design & referral growth |
| `/services/contractor-websites/` | Contractor and trade website design & local lead generation |

`/services/web-design-clovis/` competed with `/` and now 301s there (`vercel.json`).

- No internal SEO working notes in visible copy: no "GBP Primary Category" labels, Wikidata Q-IDs (`Q949704`), or internal GEO-unit markers. `tests/verify-e2e.mjs` T6.3 checks.
- Pages describe the web engineering and marketing work Adam does. A medical client's own clinical voice (insurance lists like Medi-Cal/Medicare, "accepting new patients", admitting privileges) stays on the client's site (`T6.2`), or Google reads our agency page as a clinic.
- Schema comes from `pageSchema()` in `src/lib/data.ts`: the business, one `Service`, and a `FAQPage` built from the same array the page renders, so the markup always matches what shows.

## Read before changing copy or design

| Doc | Covers |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Users, 5 lifecycle services, positioning, brand commitments, product principles |
| [DESIGN.md](DESIGN.md) | High-contrast obsidian/white architectural design system, colours, type, layout, do's & don'ts |
| [TONE_AND_VOICE.md](TONE_AND_VOICE.md) | Voice, 2026 AI Search & SEO messaging rules, component mapping |
| [CONTEXT.md](CONTEXT.md) | Agency and white-label vocabulary — use these terms |
| [outreach/ai-search-field-guide.md](outreach/ai-search-field-guide.md) | Primary-source verified 2026 AI Search (GEO), GA4 AI tracking & Lighthouse 13.5 reference |

## House rules (from Adam)

- Never show Adam's full name on the site, in copy or metadata. "Adam" at most.
- Write in first person: "Text me", not "Text Adam".
- Plain language that explains *why it matters* to a business owner. No metaphors or figures of speech in headlines and buttons.
- No small labels above headings, no cards inside cards.
- No legal promises, and no numbers or client facts that can't be backed up.

## Working alongside other agents

- Claude Code and Antigravity both work in this repo. Each works on its own branch; never edit files another agent has uncommitted changes in.
- Never commit or push to `main` directly. Open a PR and let Adam merge.

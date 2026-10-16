# Clovis Web Design (cloviswebdesign.com) — agent instructions

Adam Youssef's web design studio site. This repo is the live site; the old Astro build in
`../clovis-web-design` is retired.

## Stack

- Astro (static output) with React islands (`@astrojs/react`) and Tailwind CSS v4 via
  `@tailwindcss/vite`.
- `trailingSlash: 'always'`, directory build format, stylesheets inlined for PageSpeed.
- `@/` imports resolve to `src/`.
- `api/ask-gemini.ts` is a Vercel Edge function (Maps-grounded Gemini lookup for the lead
  audit). It needs `GEMINI_API_KEY`; never hard-code a key.

## Commands

- `npm run dev` — dev server on 4321 (or `$PORT`).
- `npm run build`, `npm run preview`.
- `npm test` — `tests/site-check.test.mjs`, then `tests/verify-e2e.mjs`.

## Deploy

Vercel project `clovis-web-design-bloom`. A push to `main` is a production deploy of
cloviswebdesign.com.

## Adam's name

On the site Adam is just "Adam": never his last name, in copy, meta tags or schema.
`tests/verify-e2e.mjs` T4.5 checks the built site.

## SEO: one search per page

Each URL owns one set of searches. Don't add a page that competes with another for them.

| URL | Owns |
| --- | --- |
| `/` | Clovis web design / web designer, the brand name; Fresno web design as a secondary |
| `/services/medical-web-design/` | Medical, dental and healthcare practice web design |
| `/services/contractor-websites/` | Contractor and trade website design |
| `/services/local-seo-fresno/` | Fresno local SEO, Google Maps rankings |

`/services/web-design-clovis/` competed with `/` and now 301s there (`vercel.json`).

- No SEO working notes in visible copy: no "GBP Primary Category" labels, Wikidata IDs,
  "entity grounding" or GEO-unit markers. `tests/verify-e2e.mjs` T6.3 checks.
- Pages describe the website work Adam does. A client's own voice (insurance lists, "accepting
  new patients", a doctor's credentials) stays on the client's site, or Google reads the page as
  that business.
- Schema comes from `pageSchema()` in `src/lib/data.ts`: the business, one `Service`, and a
  `FAQPage` built from the same array the page renders, so the markup always matches what shows.

## Read before changing copy or design

| Doc | Covers |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Users, positioning, brand commitments, product principles |
| [DESIGN.md](DESIGN.md) | Colours, type, layout, components, do's and don'ts |
| [TONE_AND_VOICE.md](TONE_AND_VOICE.md) | Voice, messaging pillars, the metaphor ban |
| [CONTEXT.md](CONTEXT.md) | Agency and white-label vocabulary — use these terms |

## House rules (from Adam)

- Never show Adam's full name on the site, in copy or metadata. "Adam" at most.
- Write in first person: "Text me", not "Text Adam".
- Plain language. No metaphors or figures of speech in headlines and buttons.
- No small labels above headings, no cards inside cards.
- No legal promises, and no numbers or client facts that can't be backed up.

## Working alongside other agents

- Claude Code and Antigravity both work in this repo. Each works on its own branch; never
  edit files another agent has uncommitted changes in.
- Never commit or push to `main` directly. Open a PR and let Adam merge.

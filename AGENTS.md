# Clovis Web Design (cloviswebdesign.com) — agent instructions

Adam Youssef's web design studio site. This repo is the live site; the old Astro build in
`../clovis-web-design` is retired.

## Stack

- Astro (static output) with React islands (`@astrojs/react`) and Tailwind CSS v4 via
  `@tailwindcss/vite`. The README's "React + Vite" line is out of date.
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

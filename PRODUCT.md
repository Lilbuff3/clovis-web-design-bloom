# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Independent Medical Practices** (the homepage audience): physician owners and practice managers in Fresno, Clovis and Madera. Referred patients look them up before booking, and the front desk answers the same questions all day (plans, referrals, records, which suite). They usually meet Adam through an in-person demo drop-off, then check this site for about 20 seconds: is he real, local, and has he built a practice site before?
2. **Local Business Owners & Contractors** (Roofing, HVAC, Plumbing, Dumpster Rental): served from `/services/contractor-websites/`, off the homepage. Needs calls, Google Maps rankings and mobile quote requests.
3. **Digital Marketing & Creative Agency Partners**: Figma-to-code builds and dev overflow under white-label terms. Reached by outbound email (`outreach/`), not the homepage.

## Product Purpose

Clovis Web Design builds websites for independent medical practices in the Central Valley. They answer what patients and referring offices ask the front desk (insurance by plan type, referral steps, where to fax records, which suite, where to park) and never collect patient information. Clients own the code and domain.

## Positioning

The practice's plain-facts front door, built and written by Adam Youssef: a Clovis native who studied health law and whose family drove out of town for care that turned out to be close to home. No forms that collect patient information, no ad trackers, no account managers.

## Operating Context

- Mobile-first reality: Customers often search on phones in direct 100° Central Valley sun with spotty LTE cellular coverage.
- Commercial stakes: Clients invest hundreds to thousands of dollars to fix real business leakages (missed calls, zero SEO, high bounce rates).
- Direct builder access: Clients communicate directly with the engineer via phone/SMS rather than navigating account manager queues or ticketing systems.

## Capabilities and Constraints

- **Stack**: Astro 5 (SSG/SSR), React 19, Tailwind CSS v4, TypeScript, deployed to Vercel.
- **Performance Targets**: Under 1.0s Largest Contentful Paint (LCP), 0.0 Cumulative Layout Shift (CLS), 100/100 Google PageSpeed Mobile score.
- **Practice Features**: Insurance by plan type (and what each needs before booking; specialist sites get no open online booking), referral steps, referring-office fax/NPI/what to send, arrival directions, printable new-patient paperwork, English + Spanish. Tap-to-call and direct SMS to Adam.
- **Never**: Forms that collect patient information, ad trackers or pixels, patient logins. Anything with patient details stays in the practice's own portal.
- **Metaphor Guardrail**: Strictly ban kitschy agricultural/orchard metaphors ("hand-grown", "harvest", "two crates ripe", "seedling plan", "watering/pruning"). Use clear, authoritative commercial language ("Custom-built", "Proven Results", "The Starter", "From Discovery to Launch").
- **Client Terms**: True ownership—clients receive full GitHub repository access, source code, and independent hosting configuration.

## Brand Commitments

- **Name**: Clovis Web Design
- **Operator**: Adam Youssef
- **Geographic Focus**: Clovis, Fresno, Madera, and the broader California Central Valley.
- **Tone**: Pragmatic, direct, respectful of time, anti-agency honesty, Central Valley grounded.

## Evidence on Hand

- Kidney Specialist Inc. (homepage case): facts only. There is no client quote on file in Dr. Masood's exact words, and the +40% referral figure stays off the site until he has confirmed it.
- Big Bros Dumpster Rental: contractor page only.
- Patient research: Doctor.com "Customer Experience Trends in Healthcare 2020" (1,600+ U.S. adults): 88% read reviews of a provider even after a referral; 49.3% would not book over incomplete information online.
- Comprehensive brand standards in `TONE_AND_VOICE.md`.
- Agency partner positioning in `CONTEXT.md`.

## Product Principles

1. **Patient Clarity and Front-Desk Relief First**: Sell what the site answers and what it never collects. Speed stays true but invisible; doctors don't buy PageSpeed scores.
2. **Done-For-You Reality**: Remove business owner friction through interview-driven copy rather than demanding homework.
3. **Transparent Independence**: No hostage monthly fees, no vendor lock-in, client owns 100% of their digital assets.
4. **Pragmatic Craftsmanship**: Clean semantic code, clear visual hierarchy, accessible contrast, and zero AI template tells.

## Accessibility & Inclusion

- Compliance Target: WCAG 2.1 AA.
- High outdoor contrast for bright sunlight conditions.
- Strict touch target sizing (minimum 48x48px) for mobile workers and contractors.

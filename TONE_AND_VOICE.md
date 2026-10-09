# Clovis Web Design — Tone, Voice & Messaging Guidelines

## 1. Brand Positioning & Core Promise

### Who We Are
Clovis Web Design is a web design and development studio operated by **Adam Youssef** in Clovis, California. The homepage speaks to independent medical practices in Clovis, Fresno and Madera. Contractors and local businesses are served from `/services/contractor-websites/`.

### The Value Proposition
> **"Your referred patients look you up before they call. I build practice websites that answer what patients and referring offices ask your front desk, and never collect patient information."**

### Why Clients Hire Us Instead of an Agency
1. **Direct Access to the Builder:** No account managers, junior interns, or ticket queues. When clients call or text, the person who writes the code answers.
2. **Speed & Mobile Conversion:** Sites load in under 1 second on mobile devices with two bars of cellular signal. Instant tap-to-call, direct SMS, and zero layout shift.
3. **Local SEO & Discovery:** Engineered with schema markup, location targeting, and semantic HTML to rank on Google Maps (Local 3-Pack) and AI search engines.
4. **Stress-Free Delivery:** Done-for-you copywriting based on a 45-minute discovery interview. No 20-page blank questionnaires.
5. **True Ownership:** Clients own their domain, code, and hosting from day one. No monthly hostage fees or proprietary lock-in.

---

## 2. Voice & Tone Principles

Our tone is **confident, clear, pragmatic, and respectful of the business owner's time.** We speak like an honest craftsman and business ally, not a marketing agency or a corporate pitchman.

### The 4 Pillars

| Pillar | What It Means | What It Looks Like | What It Avoids |
| :--- | :--- | :--- | :--- |
| **1. Pragmatic & Outcome-Driven** | Focus on phone calls, foot traffic, booked jobs, and Google visibility. | "Loads in 1.3s so customers tap 'Call Now' instead of leaving." | Tech jargon ("isomorphic hydration"), abstract fluff ("elevate your synergy"). |
| **2. Plain English & Direct** | Speak naturally and transparently. No double-talk. | "What's on the tag is what you pay. No discovery fees." | Vague pricing ("request a custom enterprise quote"). |
| **3. Anti-Agency Honesty** | Champion client autonomy, transparency, and independence. | "You own the domain, the code, and the keys on day one." | Monthly hosting retainers disguised as maintenance traps. |
| **4. Central Valley Grounded** | Local, accountable, and built for real-world field conditions. | "Built for customers searching on a phone in a truck in 100° heat." | Silicon Valley tropes, sterile corporate templates, kitschy folk themes. |

### Say It Once

Each selling point has one home on the homepage. Don't repeat it in other sections.

| Point | Its home |
| :--- | :--- |
| Referred patients look you up first | The hero headline |
| The research (88% read reviews after a referral; nearly half won't book over incomplete info) | `#referrals`, with the source named and linked |
| What a practice site answers | `#front-desk`: six cards, then "What it never does" |
| No patient data, no trackers, no logins | The `#front-desk` strip and the HIPAA FAQ |
| Proof | `#harvest`: Kidney Specialist only, facts and the live link |
| Adam's story | Short version in `#grower`; the whole thing on `/our-story/` |
| You own the code, domain and keys | The FAQ |
| Texts go straight to Adam | The hero and the phone action bar |
| Words written from a 45-minute conversation | `#season` (the process) |

Trades depth (the four-second race, Big Bros, the "Can AI find you?" check) lives on `/services/contractor-websites/`, not the homepage.

## 2b. Claims We Can Prove

Doctors check sources. One unprovable line costs more trust than the rest of the page earns.

- **No legal conclusions.** Never "HIPAA compliant", "regulatory immunity", "lawsuit-proof", "legal indemnity". Say the fact instead: "collects no patient information", "no ad trackers", "your patient portal stays where it is". Adam studied health law; the site is not legal advice.
- **No number without a named source on the page.** Approved: Doctor.com, *Customer Experience Trends in Healthcare 2020* (1,600+ U.S. adults): 88% read reviews of a provider even after a referral; 49.3% would not book over incomplete information online.
- **Banned (unsourced, from AI drafts):** "1 in 3 patients drop the referral", "70–80% research the specialist", "+140% referrals", "50–100 calls a day", "4–7 minutes per call", "60% of calls deflected".
- **Quotation marks only around a client's exact, approved words.** No paraphrased "testimonials".
- **llms.txt and "AI search optimization" are not selling points.** No major AI engine has said it reads llms.txt.

`tests/verify-e2e.mjs` Tier 6 fails the build on the banned phrases, on trackers, and on forms on the practice pages.

---

## 3. The Metaphor Ban (Why Farm/Orchard Tropes Are Out)

### Background
While Clovis has rich agricultural heritage, using heavy agrarian/orchard metaphors ("hand-grown", "harvest", "sapling", "fruit stand", "two crates ripe", "tending") confuses business owners and undermines our technical credibility. 

Business owners are investing hundreds or thousands of dollars to solve urgent commercial problems: outranking competitors, getting their phones to ring, and avoiding predatory agency contracts. They need an **authoritative, modern digital partner**, not an orchard novelty.

### Vocabulary Guardrails

| ❌ BANNED (Do Not Use) | ✅ APPROVED (Use Instead) |
| :--- | :--- |
| Hand-grown / Grown by hand | Custom-built / Hand-coded / Precision-built |
| Harvest / Two crates still ripe | Client Work / Proven Results / Measured Case Studies |
| Seedling ($1,500 plan) | The Starter / The Landing Page / Core Launchpad |
| Grove ($2,500 plan) | Growth / Local Authority / Multi-Page System |
| Orchard ($5,000 plan) | Flagship / Custom System / Bespoke Enterprise |
| The growing season | The Process / From Discovery to Launch |
| Seed / Sprout / Grow / Harvest | Discovery / Design & Strategy / Custom Build / Launch & Support |
| The farm stand | Transparent Pricing / Published Rates |
| The grower / At the workbench | About the Builder / Adam Youssef |
| Rules of the orchard / Nailed to the barn door | Our Standards / How We Work / Five Commitments |
| Letters from the valley | Client Reviews / What Business Owners Say |
| Porch questions | Frequently Asked Questions |
| No preservatives / Picked fresh | Clean code / Zero bloat / 100/100 Google PageSpeed |
| The weeds / What I planted / What grew | The Problem / The Solution / Measured Results |
| Watering / Pruning / Picking (Preloader) | Designing / Coding / Optimizing / Ready |
| Sunrise (Chapter label) | Overview / Home |

---

## 4. Key Messaging Pillars

### A. Speed as a Sales Tool (Not Just a Vanity Metric)
* **The Message:** Speed is about conversion rate, not geeky benchmarks. If a website takes 4 seconds to load on LTE, half of the potential customers tap the "Back" button and call the next competitor on Google.
* **Key Stats:** < 1.0s Largest Contentful Paint (LCP), 0.0 Layout Shift (CLS), 100/100 Google PageSpeed score.
* **On the page, say them in plain words:** "Page shows up in < 1.0s", "Things that jump around: 0". Never show the metric names (LCP, CLS, INP) to a business owner.
* **Why owners don't notice:** they check their own site at home on Wi-Fi, with a copy already saved on their phone. A first-time customer on two bars sees something else.

### B. Done-For-You Copywriting
* **The Message:** Most website projects stall for months because agencies hand the business owner a 20-page blank document and tell them to write their own content.
* **The Solution:** We interview you for 45 minutes, record it, and write your entire website using your actual voice, trade vocabulary, and customer objections.

### C. Winning the Local 3-Pack & Mobile Discovery
* **The Message:** Having a pretty site means nothing if Google doesn't rank it when someone types "dumpster rental Fresno" or "nephrologist Madera".
* **The Solution:** Semantic structure, location landing pages, local business schema, and Google Business Profile optimization.

### D. Zero Agency Hostage Fees
* **The Message:** Many agencies build websites on closed platforms and charge $200–$500/month just to keep the lights on. If you leave, they turn the site off.
* **The Solution:** With Clovis Web Design, you receive complete source code, GitHub repository access, domain control, and independent hosting.

---

## 5. Audience Archetypes & Tailored Copy

The homepage is for #2, the practices. #1 and #3 get their own pages.

### 1. The Home Services Contractor (Roofers, HVAC, Plumbers, Dumpsters)
* **Pains:** Tired of paying Angi/Yelp for shared leads; burned by slow agency retainers; needs the phone ringing now.
* **Winning Copy Angle:** Tap-to-call, text-to-book, fast quotes, top rankings for service + city ("roof repair Clovis").

### 2. The Professional / Healthcare Practice (Doctors, Clinics, Legal, Accounting)
* **Pains:** Needs credible, pristine design; HIPAA/compliance considerations; patient accessibility.
* **Winning Copy Angle:** Fast loading, zero patient health data leaks, accessible WCAG 2.1 AA typography, provider referral boosts.

### 3. The Local Main Street Business (Restaurants, Retail, Specialty Shops)
* **Pains:** Limited budget, overwhelmed by tech, needs to display hours, menu, directions, and contact cleanly.
* **Winning Copy Angle:** The $1,500 one-page Starter, live in about a week, looks high-end on iPhone and Android.

---

## 6. Website Component Mapping

Homepage sections, top to bottom. Each heading stands alone: no numbered labels above section headings (see DESIGN.md).

| Section ID | Visual Concept | Voice & Messaging Purpose |
| :--- | :--- | :--- |
| `#top` | Hero + Sunrise | "Your referred patients look you up before they call." Adam, first person: practice sites that answer the front desk's daily questions and never collect patient information. "Practice sites from $1,500", direct SMS CTA, links to a live practice site and to `/our-story/`. |
| `#referrals` | Stat + Four Checks | "A referral isn't a booking." The two Doctor.com numbers with the source linked, the blank-directory line from Adam's family, and the four things patients check. |
| `#front-desk` | Six Cards + Dark Strip | "Answers before the phone rings." Insurance by plan type, referral steps, referring offices, getting there, paperwork, English + Spanish. Then "What it never does". |
| `#harvest` | Showcase Card | "A practice site, live now." Kidney Specialist Inc. only: the problem, what was built, two provable numbers, the live link. No quote until Dr. Masood approves exact words. |
| `#grower` | Studio & Workbench | "Why I build for doctors." The short version of Adam's story, then a link to `/our-story/`. Keeps the one-line agency/Figma note. |
| `#season` | Four-Step Timeline | One row: Discovery (Day 1), Words & layout (Days 2–3), Build (Days 3–5), Launch (Day 6+, fixes free for 90 days). |
| `#stand` | Hanging Price Tags | Upfront package pricing ($1,500 Starter for a solo practice, $2,500 Growth, $5,000 Flagship). Optional care plans; the $99 plan covers routine changes (hours, providers, insurance plans), not open-ended work. |
| `#faq` | Accordion | Four questions: is it HIPAA-compliant (facts, not a legal conclusion), why bother when booked out, who owns it, can we keep our portal. |
| `#contact` | Interactive SMS Generator | Drafts a text to Adam's phone. No form: nothing is submitted anywhere. |

Other pages:

| Page | What lives there |
| :--- | :--- |
| `/our-story/` | Adam's whole story in his own words, the Doctor.com numbers, and what he builds now. He approves every sentence. |
| `/services/contractor-websites/` | Big Bros results, `#check` ("Can AI find you?", `api/ask-gemini.ts`; never imply a website alone gets someone into Gemini's answer), then `#speed`: the four-second race. Footer-linked. |
| `/services/web-design-clovis/`, `/services/local-seo-fresno/` | Location and local SEO pages, footer-linked. |
| `/services/medical-web-design/` | Retired: a permanent redirect to `/` in `vercel.json`. |

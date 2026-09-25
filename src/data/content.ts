// CMS-style content layer — each export maps to a Webflow CMS Collection or
// component-prop set. Swap values here, the components rebind automatically.

export const studio = {
  name: "Clovis Web Design",
  founder: "Adam Youssef",
  phoneDisplay: "(559) 575-3014",
  phoneHref: "tel:+15595753014",
  smsHref: "sms:+15595753014",
  email: "hello@cloviswebdesign.com",
  location: "Clovis, California",
  coords: "36.8252° N, 119.7029° W",
};

export const navLinks = [
  { label: "Proof", href: "#proof" },
  { label: "Work", href: "#work" },
  { label: "Boost", href: "#boost" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "Fees", href: "#fees" },
  { label: "Questions", href: "#questions" },
];

export const marqueeItems = [
  "100/100 PageSpeed, both client sites",
  "#1 on Google for “dumpster rental Fresno”",
  "+140% provider referrals",
  "Code & domain in your name",
  "English + Español",
  "WCAG 2.1 AA",
  "Live in a week",
];

export const metrics = [
  { value: 1.0, decimals: 1, prefix: "<", suffix: "s", label: "Largest Contentful Paint", note: "Google calls under 2.5s good" },
  { value: 0, decimals: 1, prefix: "", suffix: "", label: "Cumulative Layout Shift", note: "Nothing jumps while it loads" },
  { value: 50, decimals: 0, prefix: "<", suffix: "ms", label: "Interaction to Next Paint", note: "Buttons answer the moment you tap" },
  { value: 100, decimals: 0, prefix: "", suffix: "", label: "PageSpeed, mobile", note: "On every site we ship" },
];

export type Capability = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  body: string;
  leverage: string;
  deliverables: string[];
};

export const capabilities: Capability[] = [
  {
    id: "words",
    index: "01",
    title: "Words & Strategy",
    kicker: "We talk for forty-five minutes. I write the site.",
    body: "A recorded conversation at your shop or on the phone becomes the copy — in your words, not a template’s. I study who outranks you locally and tell you plainly what the site needs, including when you need less than you came for.",
    leverage: "Removes the blank questionnaire — the step that stalls most projects for months.",
    deliverables: ["Recorded discovery session", "Local competitor read", "Full site copy, written for you", "Plain-English scope & price up front"],
  },
  {
    id: "direction",
    index: "02",
    title: "Art Direction",
    kicker: "You see it before it exists.",
    body: "Layout, type and colour set for real people — readable at arm’s length, in sunlight, on a cracked phone screen. Nothing is reused from another client; every composition starts from your trade and your town.",
    leverage: "Trust is decided in four seconds. Craft is what buys you the fifth.",
    deliverables: ["Page composition", "Type & colour system", "Accessibility-checked contrast", "One full round of revisions"],
  },
  {
    id: "engineering",
    index: "03",
    title: "Engineering",
    kicker: "Written by hand. Nothing bolted on.",
    body: "No page builder, no plugin pile, nothing to log into and nothing to break at 2 a.m. Semantic, hand-written code that renders before a customer on two bars of signal has time to give up.",
    leverage: "Every second of load time is a measurable share of callers lost.",
    deliverables: ["Hand-written, semantic code", "Sub-second loads on mobile", "Tap-to-call & text everywhere", "Structured data for Google"],
  },
  {
    id: "search",
    index: "04",
    title: "Search & Growth",
    kicker: "Found by someone forty feet away.",
    body: "A page for each town you serve, your Google listing set up or tidied, and a full Spanish version when your customers need one. Then 90 days of tuning after launch — direct to me, by text.",
    leverage: "Own the local search instead of renting it from national brokers.",
    deliverables: ["Service-area pages", "Google Business Profile", "Full Spanish site at /es/", "90-day post-launch tuning"],
  },
];

export type CaseStudy = {
  id: string;
  index: string;
  client: string;
  url: string;
  urlDisplay: string;
  sector: string;
  place: string;
  year: string;
  img: string;
  previewImg: string;
  avatarImg?: string;
  beforeMetrics: {
    score: number;
    loadTime: string;
    label: string;
    description: string;
    badge: string;
  };
  afterMetrics: {
    score: number;
    loadTime: string;
    label: string;
    description: string;
    badge: string;
  };
  headline: string;
  complaint: string;
  prescription: string[];
  stack: string[];
  stats: { value: string; label: string }[];
  palette: { bg: string; ink: string; accent: string; soft: string };
  quote: string;
  quoteBy: string;
  quoteRole?: string;
};

export const orchardQuote = {
  quote: "You don’t rent the tree from me. You own the orchard.",
  author: "Adam Youssef",
  role: "Builder · Clovis, CA",
};

export const cases: CaseStudy[] = [
  {
    id: "kidney",
    index: "01",
    client: "Kidney Specialist Inc.",
    url: "https://www.kidneyspecialistinc.com",
    urlDisplay: "kidneyspecialistinc.com",
    sector: "Nephrology practice",
    place: "Madera & Fresno, CA",
    year: "2025",
    img: "./images/kidney.jpg",
    previewImg: "./images/kidney-preview.webp",
    avatarImg: "./images/dr-masood.jpg",
    beforeMetrics: {
      score: 42,
      loadTime: "3.8s",
      label: "Legacy WordPress theme",
      description: "Insecure forms requesting PHI, 4.2MB uncompressed assets, poor 2.8:1 text contrast.",
      badge: "PageSpeed 42/100 · 3.8s mobile",
    },
    afterMetrics: {
      score: 100,
      loadTime: "0.7s",
      label: "Hand-built Astro application",
      description: "Zero-PHI web architecture, print-ready referral fax, 12.6:1 AAA text contrast.",
      badge: "PageSpeed 100/100 · 0.7s mobile",
    },
    headline: "A medical site that never touches patient data — and scores 100 on Google’s speed test.",
    complaint: "The old forms asked patients for health details a website had no business holding.",
    prescription: ["No patient data on the web", "Printable forms instead of online ones", "Guides patients actually use"],
    stack: ["Astro", "English + Español", "WCAG 2.1 AA", "No-PHI architecture"],
    stats: [
      { value: "+140%", label: "Provider referrals" },
      { value: "100", label: "PageSpeed, mobile" },
      { value: "12.6:1", label: "Text contrast ratio" },
    ],
    palette: { bg: "#EEF2EC", ink: "#18332B", accent: "#2F7A64", soft: "#D5E3DA" },
    quote: "He made a professional-grade website that looked stunning while protecting the rights of my patients and protecting my practice.",
    quoteBy: "Dr. Sheikh Mohammad Masood, MD",
    quoteRole: "Founding President & Medical Director",
  },
  {
    id: "bigbros",
    index: "02",
    client: "Big Bros Dumpster Rentals",
    url: "https://bigbrosdumpster.com",
    urlDisplay: "bigbrosdumpster.com",
    sector: "Roll-off dumpster rental",
    place: "Fresno & Clovis, CA",
    year: "2025",
    img: "./images/bigbros.jpg",
    previewImg: "./images/big-bros-preview.webp",
    avatarImg: "./images/bigbros-family.webp",
    beforeMetrics: {
      score: 38,
      loadTime: "7.2s",
      label: "Bloated broker template",
      description: "Single generic page, outranked by national middlemen, hidden fees, English only.",
      badge: "PageSpeed 38/100 · 7.2s mobile",
    },
    afterMetrics: {
      score: 100,
      loadTime: "0.8s",
      label: "Hand-built local authority site",
      description: "#1 on Google for “dumpster rental Fresno”, published flat pricing, text-to-book.",
      badge: "PageSpeed 100/100 · 0.8s mobile",
    },
    headline: "Number one on Google for dumpster rental in Fresno — ahead of the national brokers.",
    complaint: "National brokers were outranking the company that actually owns the trucks.",
    prescription: ["A page per service area", "Flat prices, right on the page", "Driveway protection, said out loud"],
    stack: ["Local SEO", "English + Español", "Text-to-book", "PageSpeed 100"],
    stats: [
      { value: "#1", label: "“dumpster rental Fresno”" },
      { value: "+4", label: "Trucks bought to keep up" },
      { value: "1–2", label: "Avg. position, high-intent" },
    ],
    palette: { bg: "#FFF4E2", ink: "#231A10", accent: "#E8712A", soft: "#F6D9A8" },
    quote: "Contractors and homeowners in Fresno and Clovis text us directly. We’ve had to buy 4 more trucks just to keep up with the volume.",
    quoteBy: "William Maldonado Ramirez",
    quoteRole: "Co-Owner & Head of Operations",
  },
];

export const processSteps = [
  {
    index: "01",
    when: "Day 1",
    title: "Discovery",
    body: "Forty-five minutes on the phone or at your shop. What you do, who calls, what they ask before they book. I look at who else shows up when people search your trade around here.",
    outputs: ["What the site should do, and why", "An honest local competitor read", "Cost & timeline before you pay"],
  },
  {
    index: "02",
    when: "Days 2–3",
    title: "Direction",
    body: "I write the copy from our recording and lay out the page. You see it, and tell me what’s wrong. Nobody hands you a blank document.",
    outputs: ["Real copy, in your words", "The layout, before it’s built", "One round of changes included"],
  },
  {
    index: "03",
    when: "Days 3–5",
    title: "Build",
    body: "Written by hand. Your number everywhere it should be, and the whole thing tuned to load on a phone with two bars of signal.",
    outputs: ["Hand-written code, zero lock-in", "Tap to call or text, anywhere", "Tested on real phones"],
  },
  {
    index: "04",
    when: "Day 6 →",
    title: "Launch & Tune",
    body: "Domain pointed, Google told it exists, your listing tidied. Then 90 days where anything genuinely broken gets fixed at no charge — by text.",
    outputs: ["Live, indexed, in your name", "Keys handed over, not lent", "90 days of free repairs"],
  },
];

export const comparison = [
  { q: "Who builds it", agency: "An account manager relays notes to whoever is free that week.", studio: "I design it, write it and put it live. The person who answers wrote the code." },
  { q: "Who owns it", agency: "It lives on their system. Stop paying and it goes dark.", studio: "Code and domain in your name from day one. Move it anywhere, any time." },
  { q: "On a phone", agency: "A heavy template with plugins bolted on. People leave before it loads.", studio: "Nothing in it that doesn’t need to be. It’s there before they wait." },
  { q: "Who writes the words", agency: "You get a blank questionnaire and a deadline.", studio: "We talk. I record it. I write the site from what you actually said." },
  { q: "Changing things", agency: "A ticket, a change order, then an invoice for a paragraph.", studio: "A text message. Small things I just do." },
];

export const tiers = [
  {
    id: "landing",
    code: "LP",
    name: "The Landing",
    tagline: "Landing page · 1 week",
    price: "$500",
    was: "$750",
    note: "Launch price · first 5 Central Valley businesses",
    featured: false,
    includes: ["One page, hand-built, live in a week", "Your number everywhere — one tap to call or text", "Loads before anyone gets bored", "Set up so Google knows who and where you are", "One round of changes"],
    excludes: ["No multi-page site or blog", "No logo or brand design"],
    fit: "Contractors, shops and one-person trades who need a real page today.",
  },
  {
    id: "local",
    code: "LA",
    name: "Local Authority",
    tagline: "3–5 pages · 3–4 weeks",
    price: "$2,500",
    was: "",
    note: "One-off · no retainer required",
    featured: true,
    includes: ["3–5 pages, each written from a recorded conversation", "A page for each town you serve", "A full Spanish version at /es/", "Still yours on day one, still no lock-in"],
    excludes: [],
    fit: "Established businesses with more than one service to explain.",
  },
  {
    id: "flagship",
    code: "FL",
    name: "Flagship",
    tagline: "Custom build · 4–6 weeks",
    price: "$5,000",
    was: "",
    note: "One-off · 90 days of support",
    featured: false,
    includes: ["Custom design built around your brand", "Booking, quoting, or the tool your customers need", "Built to your industry’s accessibility & privacy rules", "I stay on it for 90 days after launch"],
    excludes: [],
    fit: "Medical practices, multi-location operators, anyone with compliance rules.",
  },
];

export const carePlans = [
  { name: "No plan", price: "$0", body: "Take the keys and go. It keeps working without me." },
  { name: "Care", price: "$99", body: "Hosting, backups, updates and small changes, handled." },
  { name: "Care Plus", price: "$249", body: "Everything in Care, plus the site keeps growing." },
];

export const rules = [
  "No templates sold as custom. Ever.",
  "Prices published, never behind a phone call.",
  "You keep the code, the domain and the logins.",
  "I don’t disappear. When you text, I answer.",
  "If one page is enough, that’s what I’ll tell you.",
];

export const testimonials = [
  {
    quote:
      "My main concern was compliance with HIPAA, HITECH and CMIA regulations. Adam was very knowledgeable and experienced with handling these regulations. He made a professional-grade website that looked stunning while protecting the rights of my patients and protecting my practice. And our provider referrals are up over 140%!",
    name: "Dr. Sheikh Mohammad Masood, MD",
    role: "Founding President & Medical Director",
    org: "Kidney Specialist Inc.",
    avatar: "./images/dr-masood.jpg",
  },
  {
    quote:
      "Before Adam rebuilt our site, national brokers were taking a huge chunk of every rental. Now, contractors and homeowners in Fresno and Clovis text us directly. We’ve had to buy 4 more trucks just to keep up with the volume.",
    name: "William Maldonado Ramirez",
    role: "Co-Owner & Head of Operations",
    org: "Big Bros Dumpster Rentals",
    avatar: "./images/bigbros-family.webp",
  },
];

export const faqs = [
  {
    q: "Who owns the website and the domain once it’s live?",
    a: "You do, completely, from day one. The code, the domain and the hosting account are all in your name. If you ever want someone else to take over, you hand it to them and walk — no migration fee, no permission needed.",
  },
  {
    q: "What do I actually get for $500?",
    a: "One page, built by hand, live in about a week. Your phone number at the top, the bottom and on a bar that follows people down the page. Fast on a phone, set up for Google, and yours the day it goes live. It isn’t a multi-page site, a blog or a logo — if you need those, I’ll quote it properly.",
  },
  {
    q: "Why is it $500 when everyone else wants thousands?",
    a: "It’s a launch offer limited to the first five businesses, and one page genuinely is about a day of focused work once we’ve talked. After those five it goes to $750. The bigger builds cost more because they take longer — there’s no trick.",
  },
  {
    q: "Do I have to write all the words myself?",
    a: "No. We talk for about forty-five minutes, I record it, and I write the site from what you actually said. The blank twenty-page questionnaire is the step that kills most website projects, so I do it for you.",
  },
  {
    q: "Do I have to sign up for anything monthly?",
    a: "No. The Care plan ($99/mo) covers hosting, backups, updates and small changes — but the site is yours either way. Cancel any month with one text. No notice period, no exit fee.",
  },
  {
    q: "We’re a medical practice. How do you handle patient privacy?",
    a: "By not collecting patient information on the website at all. The site routes people to a phone call or referral fax — channels your practice already handles correctly. Nothing sensitive is stored on the web server, because nothing sensitive is collected there.",
  },
  {
    q: "Can we keep our existing booking or ordering system?",
    a: "Usually, yes. If it gives you a link or an embed — most do — I can put it on the page without slowing things down. Tell me what software you run and I'll confirm before you pay anything.",
  },
  {
    q: "What happens if something breaks after launch?",
    a: "You text me and I fix it. For the first ninety days anything genuinely broken is fixed at no charge. After that, small things I’ll usually just do; if something is real work I’ll tell you the cost before I start.",
  },
];

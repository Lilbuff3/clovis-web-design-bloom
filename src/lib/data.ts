export const PHONE_DISPLAY = "(559) 575-3014";
export const PHONE_TEL = "+15595753014";
export const SMS_LINK = `sms:${PHONE_TEL}`;

export const cases = [
  {
    no: "01",
    client: "Kidney Specialist Inc.",
    url: "https://www.kidneyspecialistinc.com",
    urlDisplay: "kidneyspecialistinc.com",
    trade: "Nephrology practice",
    place: "Madera & Fresno, CA",
    year: "2025",
    img: "/images/kidney.jpg",
    previewImg: "/images/kidney-preview.webp",
    photoImg: "/images/kidney.jpg",
    tint: "bg-sky",
    headline: "A medical site that never touches patient data — and scores 100 for accessibility.",
    problem: "The old forms asked patients for health details a website shouldn't be holding.",
    planted: ["Zero patient data collected online", "Printable registration & direct referral routing", "Accessible guides patients actually understand"],
    stack: ["English + Español"],
    // No quote: neither version on file was Dr. Masood's exact words.
    // Two numbers per case: the business result, then the one that explains the headline.
    // PageSpeed, mobile, Oct 8 2026: Performance 97, Accessibility 100. Re-check before changing either number.
    yields: [
      { value: 0, label: "Forms that ask patients for health information" },
      { value: 100, suffix: "/100", label: "Accessibility, on Google's PageSpeed test" },
    ],
  },
];

// Condensed from the longer step copy; same facts, one sentence or two each.
export const steps = [
  {
    name: "Discovery",
    when: "Day 1",
    body: "A 45-minute call about your practice: who refers to you, and what patients and referring offices ask before they book. If one simple page is enough, I'll say so.",
  },
  {
    name: "Words & layout",
    when: "Days 2–3",
    body: "I write every word from that call and send you a link to try on your phone. No blank questionnaire to fill in.",
  },
  {
    name: "Build",
    when: "Days 3–5",
    body: "No page builders or plugins. Your call and text buttons go right where thumbs land.",
  },
  {
    name: "Launch",
    when: "Day 6+",
    body: "Your site goes live and gets connected to Google Search and Maps. Fixes in the first 90 days are free.",
  },
];

export const plans = [
  {
    code: "01",
    name: "Starter",
    kind: "Landing page",
    time: "1 week",
    price: "$1,500",
    color: "bg-citrus",
    hole: "bg-paper",
    items: [
      "One page, live in a week",
      "Insurance, referral steps, fax and directions, each one tap away",
      "Loads in under 1 second on mobile devices",
      "Set up so Google knows who & where you are",
      "One full round of revisions included",
    ],
    not: ["No multi-page site or blog", "No logo or brand design", "No ongoing SEO — that's the care plan"],
    for: "Solo practices and small offices that need one clear page: insurance, referrals, directions.",
  },
  {
    code: "02",
    name: "Growth",
    kind: "Local authority",
    time: "3–4 weeks",
    price: "$2,500",
    color: "bg-sage",
    hole: "bg-paper",
    items: [
      "3–5 pages, each written from a recorded conversation",
      "A page for each provider and location",
      "A full Spanish version at /es/",
    ],
    not: [],
    for: "Practices with several providers or locations, or patients who need Spanish.",
  },
  {
    code: "03",
    name: "Flagship",
    kind: "Custom system",
    time: "4–6 weeks",
    price: "$5,000",
    color: "bg-sky",
    hole: "bg-paper",
    items: [
      "Custom design built around your brand",
      "Links into your patient portal or scheduler",
      "Built to WCAG 2.1 AA, with nothing that collects patient information",
      "I stay on it for 90 days after launch",
    ],
    not: [],
    for: "Groups that need a custom design, or links into a patient portal or scheduler.",
  },
];

export const care = [
  { name: "No plan", price: "$0", blurb: "Pay nothing monthly. You're all set." },
  { name: "Care Plan", price: "$99", blurb: "Hosting, security updates and routine changes: hours, providers, insurance plans." },
  { name: "Care Plus", price: "$249", blurb: "Everything in Care, plus new content and local SEO tuning." },
];


export const faqs = [
  {
    q: "Is the website HIPAA-compliant?",
    a: "It doesn't collect patient information, so there's no patient data on it to protect: no forms, no ad trackers, no logins. Anything that needs patient details, like intake forms or messages, stays in the system you already use for it, such as your patient portal. This isn't legal advice: your compliance person has the final word, and I'm glad to walk them through it.",
  },
  {
    q: "We're booked out for months. Why would we need this?",
    a: "It isn't about more patients. It's about the right ones arriving prepared: on a plan you take, with the referral and records you need, at the right suite. And fewer calls asking where records go or whether a referral came through.",
  },
  {
    q: "Who owns the website and the domain once it's live?",
    a: "You do, completely, from day one. The code, the domain and the hosting account are all in your name. Plenty of companies keep your site on their system and charge monthly to keep it switched on — cancel and you lose everything. Not here. If you ever want someone else to take over, hand it to them and walk.",
  },
  {
    q: "Can we keep our patient portal or scheduler?",
    a: "Yes. If it gives you a link, and most do, it goes on the page without slowing anything down. Tell me what you use and I'll confirm before you pay anything.",
  },
];

// --- Schema.org Structured Metadata ---
// Only things shown on the page. Google expects structured data to match what visitors see.
export const knowsAbout = [
  "Web design",
  "Local SEO",
  "Website speed",
  "Web accessibility (WCAG 2.1 AA)",
  "Websites for medical practices",
  "HIPAA-aware web design",
  "Bilingual English and Spanish websites",
];

// Mirrors the price tags in `plans`.
export const hasOfferCatalog = {
  "@type": "OfferCatalog",
  "name": "Websites",
  "itemListElement": [
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "1500",
      "priceCurrency": "USD",
      "description": "A one-page website, built by hand and live in about a week. You own the code and the domain.",
    },
    {
      "@type": "Offer",
      "name": "Growth",
      "price": "2500",
      "priceCurrency": "USD",
      "description": "3–5 pages written from a recorded conversation, a page for each provider and location, and a full Spanish version.",
    },
    {
      "@type": "Offer",
      "name": "Flagship",
      "price": "5000",
      "priceCurrency": "USD",
      "description": "A custom design with links into your patient portal or scheduler, built to WCAG 2.1 AA, with 90 days of support after launch.",
    },
  ],
};

export const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://cloviswebdesign.com/#business",
      "name": "Clovis Web Design",
      "url": "https://cloviswebdesign.com",
      "telephone": "+15595753014",
      "priceRange": "$1,500 - $5,000",
      "image": "https://cloviswebdesign.com/images/hero.jpg",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Clovis",
        "addressRegion": "CA",
        "postalCode": "93612",
        "addressCountry": "US",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 36.8252,
        "longitude": -119.7029,
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "07:00",
          "closes": "19:00",
        },
      ],
      "founder": {
        "@type": "Person",
        "@id": "https://cloviswebdesign.com/#adam",
        "name": "Adam Youssef",
        "jobTitle": "Founder & Lead Developer",
        "knowsAbout": knowsAbout,
      },
      // No Wikidata links: the old IDs pointed at Rhodes, Greece and a district of St. Petersburg.
      // No sameAs: only add profiles Adam has confirmed are his.
      "areaServed": [
        { "@type": "City", "name": "Clovis, CA" },
        { "@type": "City", "name": "Fresno, CA" },
        { "@type": "City", "name": "Madera, CA" },
      ],
      "knowsAbout": knowsAbout,
      "hasOfferCatalog": hasOfferCatalog,
    },
  ],
};


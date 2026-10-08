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
    headline: "A medical site that never touches patient data — and scores a perfect 100.",
    problem: "The old forms asked patients for health details a website shouldn't be holding.",
    planted: ["Zero patient data collected online", "Printable registration & direct referral routing", "Accessible guides patients actually understand"],
    stack: ["Astro", "English + Español", "WCAG 2.1 AA", "No-PHI design"],
    quote: {
      text: "HIPAA was my big worry. Most web people I talked to didn't really know what it meant for a website. Adam did. Our site doesn't collect any patient information, it looks professional, and referrals from other doctors are up more than 40%.",
      name: "Dr. Sheikh Mohammad Masood, MD",
      role: "Founding President & Medical Director",
    },
    yields: [
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
      { value: 40, prefix: "+", suffix: "%", label: "Provider referrals, by Dr. Masood's count" },
      { value: 0, suffix: "", label: "Online forms collecting patient data (Zero PHI risk)" },
      { value: 12.6, suffix: ":1", label: "Text contrast ratio (WCAG 2.1 AA)", decimals: 1 },
    ],
  },
  {
    no: "02",
    client: "Big Bros Dumpster Rentals",
    url: "https://bigbrosdumpster.com",
    urlDisplay: "bigbrosdumpster.com",
    trade: "Roll-off dumpster rental",
    place: "Fresno & Clovis, CA",
    year: "2025",
    img: "/images/bigbros.jpg",
    previewImg: "/images/big-bros-preview.webp",
    photoImg: "/images/bigbros.jpg",
    tint: "bg-blush",
    headline: "Number one on Google for “dumpster rental Fresno.”",
    problem: "National brokers were outranking the company that actually owns the trucks.",
    planted: ["Dedicated service area pages for Fresno & Clovis", "Upfront flat pricing on the page", "Driveway protection highlighted for trust"],
    stack: ["Local SEO", "English + Español", "Text-to-book", "PageSpeed 100"],
    quote: {
      text: "The national brokers were getting the calls and taking a cut of every rental. Since Adam redid our site, contractors and homeowners in Fresno and Clovis just text us straight. We had to buy 4 more trucks to keep up.",
      name: "William Maldonado Ramirez",
      role: "Co-Owner & Head of Operations",
    },
    yields: [
      { value: 1, prefix: "#", suffix: "", label: "On Google for “dumpster rental Fresno”" },
      { value: 4, prefix: "+", suffix: "", label: "Trucks added to keep up with demand" },
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
      { value: 1.5, suffix: "", label: "Avg. position on high-intent searches (1–2)", decimals: 1, display: "1–2" },
    ],
  },
];

export const seasons = [
  {
    key: "discovery",
    name: "Discovery",
    title: "Discovery — we talk strategy",
    when: "Day 1",
    body:
      "Forty-five minutes on the phone or at your shop. What you do, who calls you, what they ask before they book, and what you keep explaining twice. I analyze who currently ranks for your trade across Clovis and Fresno — then tell you, in plain English, exactly what the site needs to convert. If one simple page is enough, that's what I'll recommend.",
  },
  {
    key: "design",
    name: "Design & Copy",
    title: "Design direction — see it before it's built",
    when: "Days 2–3",
    body:
      "I write every word of copy from the recording of our conversation — in your authentic voice, not generic marketing fluff — and lay out the mobile and desktop experience. Nobody hands you a blank 20-page document to fill in. We remove the writing bottleneck that stalls most projects for months.",
  },
  {
    key: "build",
    name: "Custom Build",
    title: "Custom build — zero bloat",
    when: "Days 3–5",
    body:
      "No drag-and-drop page builders, no 40 bloated plugins, and nothing that slows down your mobile load time. Your phone and SMS buttons are positioned where thumbs naturally tap, and every page is structured so Google and AI search engines instantly recognize your trade and service radius.",
  },
  {
    key: "launch",
    name: "Launch",
    title: "Launch & 90-day guarantee",
    when: "Day 6 onward",
    body:
      "I connect your domain, deploy the high-speed code, and verify your presence in Google Search Console and Google Maps. For 90 days, any bugs or fixes are handled free — text me directly and it's resolved.",
  },
];

export const compare = [
  {
    q: "Who actually builds it?",
    them: ["An account manager", "You meet the senior people once, at the pitch. Then your site goes to whoever's free that week."],
    me: ["Me. Start to finish.", "I design it, build it and put it live. When you call, the person who wrote the code picks up."],
  },
  {
    q: "Who owns it when you walk away?",
    them: ["They hold the keys", "It lives on their system. Stop paying and it goes dark — design and content included."],
    me: ["You hold the keys", "Code and domain are in your name from day one. Move it anywhere, no permission needed."],
  },
  {
    q: "How does it behave on a phone?",
    them: ["People leave first", "A heavy template with dozens of plugins. Out in the field, it loads long enough for people to give up."],
    me: ["It's there before they wait", "Nothing in it that doesn't need to be, so it's up before anyone thinks about leaving."],
  },
  {
    q: "Who writes the words?",
    them: ["You do, somehow", "A blank questionnaire and a deadline — or machine-written copy that sounds like everyone else."],
    me: ["I do", "We talk for 45 minutes, I record it, and write the site from what you said about your own trade."],
  },
  {
    q: "When you need a change?",
    them: ["A ticket and a wait", "Submit a request, wait for a change order, get invoiced for a paragraph."],
    me: ["A text message", "Small things I just do. Big things, I tell you before I start — not after."],
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
      "Your number everywhere — one tap to call or text",
      "Loads in under 1 second on mobile devices",
      "Set up so Google knows who & where you are",
      "One full round of revisions included",
    ],
    not: ["No multi-page site or blog", "No logo or brand design", "No ongoing SEO — that's the care plan"],
    for: "Contractors, shops, and one-person trades who need high conversion today.",
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
      "A page for every town you serve, built for local Google searches",
      "A full Spanish version at /es/",
    ],
    not: [],
    for: "Established businesses with more than one service — or who need Spanish alongside English.",
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
      "Booking, quoting — whatever your customers need",
      "Built to your industry's accessibility & privacy rules",
      "I stay on it for 90 days after launch",
    ],
    not: [],
    for: "Medical practices, multi-location operators, anyone with compliance to satisfy.",
  },
];

export const care = [
  { name: "No plan", price: "$0", blurb: "Pay nothing monthly. You're all set." },
  { name: "Care Plan", price: "$99", blurb: "Hosting, security updates and small changes, handled." },
  { name: "Care Plus", price: "$249", blurb: "Everything in Care, plus new content and local SEO tuning." },
];


export const faqs = [
  {
    q: "Who owns the website and the domain once it's live?",
    a: "You do, completely, from day one. The code, the domain and the hosting account are all in your name. Plenty of companies keep your site on their system and charge monthly to keep it switched on — cancel and you lose everything. Not here. If you ever want someone else to take over, hand it to them and walk.",
  },
  {
    q: "Can we keep our existing booking or ordering system?",
    a: "Usually, yes. If it gives you a link or an embed — most do — I can put it on the page without slowing things down. Tell me what you run and I'll confirm before you pay anything.",
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
      "description": "3–5 pages written from a recorded conversation, a page for every town you serve, and a full Spanish version.",
    },
    {
      "@type": "Offer",
      "name": "Flagship",
      "price": "5000",
      "priceCurrency": "USD",
      "description": "A custom design with booking or quoting, built to your industry's accessibility and privacy rules, with 90 days of support after launch.",
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


export const PHONE_DISPLAY = "(559) 575-3014";
export const PHONE_TEL = "+15595753014";
// A text with the first message already written. "?&body=" works on both iOS and Android.
export const smsTo = (body: string) => `sms:${PHONE_TEL}?&body=${encodeURIComponent(body)}`;
export const SMS_LINK = smsTo("Hi Adam, I'm interested in a website for my business. Can we talk?");
export const EMAIL = "adam@cloviswebdesign.com";
// The desktop stand-in for smsTo: most computers can't open an sms: link.
export const mailTo = (subject: string, body = "") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body && `&body=${encodeURIComponent(body)}`}`;

export const cases = [
  {
    no: "01",
    client: "Kidney Specialist Inc.",
    url: "https://www.kidneyspecialistinc.com",
    urlDisplay: "kidneyspecialistinc.com",
    trade: "Nephrology practice",
    place: "Madera & Fresno, CA",
    year: "2025",
    caseStudyPath: "/case-studies/kidney-specialist-fresno/",
    img: "/images/kidney.jpg",
    previewImg: "/images/kidney-preview.webp",
    photoImg: "/images/kidney.jpg",
    photoWidth: 1600,
    photoHeight: 995,
    tint: "bg-sky",
    headline: "A medical site that never touches patient data — and scores a perfect 100.",
    problem: "The old forms asked patients for health details a website shouldn't be holding.",
    planted: ["Zero patient data collected online", "Printable registration & direct referral routing", "Accessible guides patients actually understand"],
    stack: ["English + Español"],
    quote: {
      text: "HIPAA was my big worry. Most web people I talked to didn't really know what it meant for a website. Adam did. Our site doesn't collect any patient information, it looks professional, and referrals from other doctors are up more than 40%.",
      name: "Dr. Sheikh Mohammad Masood, MD",
      role: "Founding President & Medical Director",
    },
    // Two numbers per case: the business result, then the one that explains the headline.
    yields: [
      { value: 40, prefix: "+", suffix: "%", label: "Provider referrals, by Dr. Masood's count" },
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
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
    caseStudyPath: "/case-studies/dumpster-rental-fresno/",
    img: "/images/bigbros-truck.webp",
    previewImg: "/images/big-bros-preview.webp",
    photoImg: "/images/bigbros-truck.webp",
    photoWidth: 1067,
    photoHeight: 730,
    tint: "bg-blush",
    headline: "Number one on Google for “dumpster rental Fresno.”",
    problem: "National brokers were outranking the company that actually owns the trucks.",
    planted: ["Dedicated service area pages for Fresno & Clovis", "Upfront flat pricing on the page", "Driveway protection highlighted for trust"],
    stack: ["English + Español", "Text-to-book"],
    quote: {
      text: "The national brokers were getting the calls and taking a cut of every rental. Since Adam redid our site, contractors and homeowners in Fresno and Clovis just text us straight. We had to buy 4 more trucks to keep up.",
      name: "William Maldonado Ramirez",
      role: "Co-Owner & Head of Operations",
    },
    yields: [
      { value: 1, prefix: "#", suffix: "", label: "On Google for “dumpster rental Fresno”" },
      { value: 4, prefix: "+", suffix: "", label: "Trucks added to keep up with demand" },
    ],
  },
];

// Condensed from the longer step copy; same facts, one sentence or two each.
export const steps = [
  {
    name: "Discovery",
    when: "Day 1",
    body: "A quick 15-minute call about what you do, who calls you, and what a new customer is worth to you. If a new site won't clearly pay for itself, I'll tell you right there.",
  },
  {
    name: "Words & layout",
    when: "Days 2–3",
    body: "I write every word from that call and send you a working preview to try on your phone. If you don't like it, you don't pay.",
  },
  {
    name: "Build",
    when: "Days 3–5",
    body: "No page builders or plugins. Your call and text buttons go right where thumbs land, and pages open in under a second.",
  },
  {
    name: "Launch",
    when: "Day 6+",
    body: "Your site goes live and gets connected to Google Search and Maps. Fixes in the first 90 days are free.",
  },
];

export const compare = [
  {
    q: "Who actually builds it?",
    them: ["An account manager", "You meet the senior people once, at the pitch. Then your site goes to whoever's free that week."],
    me: ["Me. Start to finish.", "I design it, build it and put it live. When you call, the person who wrote the code picks up."],
  },
  {
    q: "Who owns it?",
    them: ["They do", "It lives on their system. Stop paying and it goes dark — design and content included."],
    me: ["You do", "Code and domain are in your name from day one. Move it anywhere, no permission needed."],
  },
  {
    q: "How does it behave on a phone?",
    them: ["People leave first", "A heavy template with dozens of plugins. Out in the field, it loads long enough for people to give up."],
    me: ["It opens fast", "No extra code slowing it down, so it opens before anyone gives up."],
  },
  {
    q: "Who writes the words?",
    them: ["You do, somehow", "A blank questionnaire and a deadline — or machine-written copy that sounds like everyone else."],
    me: ["I do", "We talk for 15 minutes, I record it, and write the site from what you said about your own trade."],
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
      "One-page custom design, live in about a week",
      "Working phone preview before you pay",
      "Done-for-you words from a 15-minute call",
      "Tap-to-call, direct text & Google Search tracking",
      "90 days of free fixes after launch",
      "You own the code, domain, and keys on day one",
    ],
    not: [],
    for: "Local shops, restaurants, trades, and new businesses that want more calls now.",
  },
  {
    code: "02",
    name: "Growth",
    kind: "Multi-page site",
    time: "3–4 weeks",
    price: "$2,500",
    color: "bg-sage",
    hole: "bg-paper",
    items: [
      "3–5 pages with dedicated service & town areas",
      "Working phone preview before you pay",
      "Done-for-you words from a 15-minute call",
      "Call, text & Google Search tracking",
      "Full Spanish version at /es/",
      "90 days of free fixes after launch",
      "You own the code, domain, and keys on day one",
    ],
    not: [],
    for: "Growing businesses with multiple services, locations, or Spanish-speaking customers.",
  },
  {
    code: "03",
    name: "Flagship",
    kind: "Custom system",
    time: "4–6 weeks",
    price: "From $3,500",
    terms: "scoped to your needs · $0 preview",
    cta: "Ask about Flagship",
    color: "bg-sky",
    hole: "bg-paper",
    items: [
      "Custom multi-page or multi-location design",
      "Working phone preview before you pay",
      "Done-for-you words from a 15-minute call",
      "Call, form & Google Search tracking",
      "Custom booking, intake, or HIPAA/privacy compliance",
      "90 days of free fixes after launch",
      "You own the code, domain, and keys on day one",
    ],
    not: [],
    for: "Medical practices, multi-location companies, or any business needing custom booking or compliance.",
  },
];

export const care = [
  {
    name: "Care Plan",
    price: "$99",
    blurb: "Same-day text-me updates (new photos, hours, prices, seasonal promos), fast hosting, and a monthly call & search check-in.",
  },
  {
    name: "Care Plus",
    price: "$249",
    blurb: "Everything in Care, plus new town and service pages and monthly Google Maps & AI visibility tuning.",
  },
];


export const faqs = [
  {
    q: "How does payment work? What if I don't like the design?",
    a: "You don't pay a deposit just to see what I'd build. First we talk for 15 minutes, and I put together a working preview with your real words so you can try it on your phone. If you don't like how it looks and reads, we stop there and you owe nothing. And if it looks to me like a new site won't clearly earn back what it costs for your business, I'll tell you that on our first call.",
  },
  {
    q: "Who owns the website and the domain once it's live?",
    a: "You do, completely, from day one. The code, the domain and the hosting account are all in your name. Plenty of companies keep your site on their system and charge monthly to keep it switched on — cancel and you lose everything. Not here. If you ever want someone else to take over, hand it to them.",
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
      "description": "A custom one-page website, live in about a week. Includes working phone preview before payment, done-for-you words, call & search tracking, 90 days of free fixes, and full ownership.",
    },
    {
      "@type": "Offer",
      "name": "Growth",
      "price": "2500",
      "priceCurrency": "USD",
      "description": "3–5 pages with dedicated town and service pages and full Spanish version. Includes working phone preview, done-for-you words, call & search tracking, 90 days of free fixes, and full ownership.",
    },
    {
      "@type": "Offer",
      "name": "Flagship",
      "price": "3500",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "3500",
        "priceCurrency": "USD",
        "minPrice": "3500",
      },
      "description": "Custom multi-page or multi-location design with booking or intake, built to accessibility and privacy rules, with working phone preview, call & search tracking, and 90 days of free fixes.",
    },
  ],
};

export const business = {
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://cloviswebdesign.com/#business",
  "name": "Clovis Web Design",
  "url": "https://cloviswebdesign.com",
  "telephone": "+15595753014",
  "email": EMAIL,
  "priceRange": "From $1,500",
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
    // First name only, everywhere on the site.
    "name": "Adam",
    "jobTitle": "Founder & Lead Developer",
    "knowsAbout": knowsAbout,
  },
  "hasMap": "https://maps.google.com/?cid=5133720235419656762",
  "sameAs": ["https://maps.google.com/?cid=5133720235419656762"],
  "areaServed": [
    { "@type": "City", "name": "Clovis, CA" },
    { "@type": "City", "name": "Fresno, CA" },
    { "@type": "City", "name": "Madera, CA" },
  ],
  "knowsAbout": knowsAbout,
  "hasOfferCatalog": hasOfferCatalog,
};

export const offer = (name: string) => hasOfferCatalog.itemListElement.find((o) => o.name === name)!;

export type Faq = { q: string; a: string };

// One Service per URL, each with its own audience, so no two pages claim the same thing.
// FAQPage only from questions the page shows; Google drops markup that isn't visible.
export function pageSchema(path: string, service: { name: string; serviceType: string; audience: string; description: string; offers?: object[] }, pageFaqs: Faq[] = []) {
  const url = `https://cloviswebdesign.com${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      ...(path === "/"
        ? [{
            "@type": "WebSite",
            "@id": "https://cloviswebdesign.com/#website",
            "url": "https://cloviswebdesign.com/",
            "name": "Clovis Web Design",
            "publisher": { "@id": business["@id"] },
            "inLanguage": "en-US",
          }]
        : [{
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Clovis Web Design",
                "item": "https://cloviswebdesign.com/",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": service.name,
                "item": url,
              },
            ],
          }]),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        "url": url,
        "name": service.name,
        "serviceType": service.serviceType,
        "description": service.description,
        "provider": { "@id": business["@id"] },
        "areaServed": business.areaServed,
        "audience": { "@type": "BusinessAudience", "audienceType": service.audience },
        ...(service.offers && { "offers": service.offers }),
      },
      ...(pageFaqs.length
        ? [{
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            "url": url,
            "mainEntity": pageFaqs.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
          }]
        : []),
    ],
  };
}

export function caseStudySchema(path: string, cs: {
  title: string;
  description: string;
  client: string;
  trade: string;
}) {
  const url = `https://cloviswebdesign.com${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Clovis Web Design",
            "item": "https://cloviswebdesign.com/",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Case Studies",
            "item": "https://cloviswebdesign.com/#harvest",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": cs.title,
            "item": url,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        "url": url,
        "headline": cs.title,
        "description": cs.description,
        "author": { "@id": business.founder["@id"] },
        "publisher": { "@id": business["@id"] },
        "about": { "@id": business["@id"] },
      },
    ],
  };
}



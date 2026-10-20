export const PHONE_DISPLAY = "(559) 628-0142";
export const PHONE_TEL = "+15596280142";
// A text with the first message already written. "?&body=" works on both iOS and Android.
export const smsTo = (body: string) => `sms:${PHONE_TEL}?&body=${encodeURIComponent(body)}`;
export const SMS_LINK = smsTo("Hi Adam, I'm interested in growing my business online. Can we talk?");
export const EMAIL = "adam@cloviswebdesign.com";
// The desktop stand-in for smsTo: most computers can't open an sms: link.
export const mailTo = (subject: string, body = "") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body && `&body=${encodeURIComponent(body)}`}`;

export const services = [
  {
    code: "01",
    title: "Custom Web Design & Engineering",
    who: "Any business · Multi-page · Bilingual /es/ · Booking & intake",
    what: "Hand-coded websites that open in under 0.4 seconds on mobile, score 100/100 on Google PageSpeed, and put tap-to-call, text, and booking right where thumbs land.",
    whyItMatters: "Over half of mobile visitors leave a page that takes 3–4 seconds to open, and AI search crawlers time out on slow WordPress templates before reading a single word.",
    href: "/#pricing",
    cta: "See website builds",
    tint: "bg-citrus",
  },
  {
    code: "02",
    title: "Search Engine & Google Maps SEO",
    who: "Google Maps 3-Pack · High-intent service & market pages · Authority",
    what: "Google Business Profile optimization, dedicated service and market pages, and review systems that put your business at the top of Google Search and the Maps 3-Pack.",
    whyItMatters: "When a customer searches for what you do, Google shows three map results before anything else — capturing ready-to-buy leads without paying per click.",
    href: "/services/local-seo-fresno/",
    cta: "See Search & Maps SEO",
    tint: "bg-sage",
  },
  {
    code: "03",
    title: "AI Search & Answer Optimization",
    who: "ChatGPT · Google Gemini · Claude · Perplexity · Apple Siri",
    what: "Four-directory profile alignment across Google, Bing, Apple Maps, and Yelp, connected business schema, and fact-dense answer sections built for AI citation.",
    whyItMatters: "Millions of buyers now ask AI who to hire. Unlike Google's ten blue links, AI assistants name only 1 to 3 businesses — and each AI checks a different directory.",
    href: "/services/local-seo-fresno/#ai-search",
    cta: "How AI picks businesses",
    tint: "bg-sky",
  },
  {
    code: "04",
    title: "AI & Search Lead Attribution",
    who: "Custom GA4 AI channel · Call, text & form tracking · Live audits",
    what: "Privacy-safe analytics that separate AI search referrals (ChatGPT, Gemini, Claude, Perplexity) from regular traffic and track every phone call, text, and form lead.",
    whyItMatters: "Default analytics buries AI referrals inside generic traffic. Clear attribution proves exactly which pages, searches, and AI answers generate your revenue.",
    href: "/#check",
    cta: "Run a live AI check",
    tint: "bg-blush",
  },
];

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
    name: "Discovery & Audit",
    when: "Day 1",
    body: "A 15-minute call about your business, your market, and what a new customer is worth to you — plus a live check of how you show up on Google Maps, ChatGPT, Gemini, and Claude. If I don't see a clear return on investment, I'll tell you right there.",
  },
  {
    name: "Words & Preview",
    when: "Days 2–4",
    body: "I write every word from our call and build a working preview you can try on your phone. For website builds, you see and approve the preview before you pay a dollar.",
  },
  {
    name: "Engineering & Sync",
    when: "Weeks 1–3",
    body: "Hand-coded pages that open in under 0.4 seconds on mobile, paired with connected business schema and aligned profiles across Google, Bing, Apple Maps, and Yelp.",
  },
  {
    name: "Launch & Attribution",
    when: "Launch + 90 Days",
    body: "Your site and search setup go live with phone call, text, form, and AI referral tracking in Google Analytics 4. Fixes in the first 90 days are included.",
  },
];

export const compare = [
  {
    q: "Who actually does the work?",
    them: ["An account manager", "You meet the senior strategist on the sales call. Then your website and SEO get handed off to a junior coordinator or template shop."],
    me: ["Me. Start to finish.", "I design the pages, write the code, configure the search schema, and wire the analytics myself. When you call or text, the person doing the work picks up."],
  },
  {
    q: "Who owns the website and accounts?",
    them: ["They do", "Your site lives on their proprietary system. Stop paying their monthly fee and your website, content, and search rankings disappear."],
    me: ["You do", "Your code, domain, hosting, and analytics accounts are in your name from day one. You never pay rent just to keep your website online."],
  },
  {
    q: "How does it perform for Google and AI?",
    them: ["Slow plugins & guesswork", "A heavy template with dozens of plugins that takes 4–5 seconds to load on mobile, times out when AI bots crawl it, and ignores Bing, Apple Maps, and Yelp."],
    me: ["Engineered for search & AI", "Pages open in under 0.4 seconds, score 100/100 on Google PageSpeed, and sync your business facts across the exact directories Google, ChatGPT, Gemini, Claude, and Siri check."],
  },
  {
    q: "Who writes the copy?",
    them: ["You do, somehow", "A blank questionnaire and a deadline — or generic machine-written filler that sounds like every other company in your industry."],
    me: ["I do", "We talk for 15 minutes. I write clear, specific copy that answers real buyer questions and gives search engines and AI assistants the exact facts they cite."],
  },
  {
    q: "How do you know if it's working?",
    them: ["A vague PDF report", "Monthly charts full of impressions that never tell you which searches or AI recommendations actually turned into paying customers."],
    me: ["Real lead attribution", "Every phone call, text message, form submission, and referral from ChatGPT, Gemini, Claude, or Google Maps is tracked cleanly so you see your actual return."],
  },
];

export const plans = [
  {
    code: "01",
    name: "Custom Website Build",
    kind: "Design & Engineering",
    time: "1–4 weeks",
    price: "Custom Scoped",
    terms: "one-time build · $0 until you approve the preview",
    cta: "Scope a website build",
    color: "bg-citrus",
    hole: "bg-paper",
    items: [
      "Custom hand-coded site (<0.4s mobile load, 100/100 PageSpeed)",
      "Working phone preview before you pay",
      "Done-for-you words from a 15-minute call",
      "Tap-to-call, text, form & Google Search tracking",
      "Optional full Spanish version (/es/) or compliant intake routing",
      "90 days of free fixes after launch",
      "You own the code, domain, and keys on day one",
    ],
    not: [],
    for: "Any business needing a fast, high-converting website they own outright — with zero monthly hostage fees.",
  },
  {
    code: "02",
    name: "Search & AI Visibility Setup",
    kind: "SEO & AI Optimization",
    time: "2–3 weeks",
    price: "Standalone or Add-On",
    terms: "one-time overhaul · works with your existing site or a new build",
    cta: "Request a visibility audit",
    color: "bg-sage",
    hole: "bg-paper",
    items: [
      "Four-directory sync across Google Maps, Bing, Apple Maps & Yelp",
      "Connected business, service & FAQ structured data",
      "Fact-dense answer sections written for ChatGPT, Gemini & Claude",
      "Machine-readable /llms.txt & AI agent discovery files",
      "Custom GA4 dashboard tracking AI referrals, calls & texts",
      "Before-and-after live AI & Google Maps citation audit",
    ],
    not: [],
    for: "Businesses with an existing website (or pairing with a new build) that want to rank on Google Maps and get recommended by AI.",
  },
  {
    code: "03",
    name: "Ongoing Search & AI Growth",
    kind: "Monthly Marketing Partnership",
    time: "Monthly · No lock-in",
    price: "Monthly Retainer",
    terms: "scoped to your market & ROI · cancel with one text",
    cta: "Discuss growth retainer",
    color: "bg-sky",
    hole: "bg-paper",
    items: [
      "New high-intent service, product, and market pages each month",
      "Ongoing Google Maps, ChatGPT, Gemini & Claude citation growth",
      "Review generation & reputation velocity systems",
      "Monthly lead attribution & ROI report (calls, texts, AI referrals)",
      "Same-day text-me updates for hours, promos, photos, or copy",
      "Priority engineering support & continuous conversion tuning",
    ],
    not: [],
    for: "Growth-focused companies in competitive markets that want compounding search traffic, AI recommendations, and measurable monthly ROI.",
  },
];

export const faqs = [
  {
    q: "Can I hire you just for SEO and AI search visibility if I already have a website?",
    a: "Yes. All four services are available individually or together. If your current website converts well and loads fast, we can start with a standalone Search & AI Visibility Setup — aligning your Google Business Profile, Bing Places, Apple Business Connect, and Yelp listings, adding connected business schema, and setting up AI referral tracking.",
  },
  {
    q: "How does pricing work, and why don't you list fixed package prices?",
    a: "Every project is scoped to what your business actually needs and the return it can generate. A focused website build requires very different work than a multi-market search and AI campaign. On our first 15-minute call, I look at your goals and market competition, tell you plainly what will move the needle, and give you a straight upfront quote.",
  },
  {
    q: "What if I don't like the website design?",
    a: "You don't pay a deposit just to see what I'd build. For website projects, we talk for 15 minutes and I put together a working preview with your real words so you can try it on your phone. If you don't like how it looks and reads, we stop there and you owe nothing.",
  },
  {
    q: "Who owns the website, domain, and marketing accounts?",
    a: "You do, completely, from day one. The code, the domain, your Google Business Profile, and your analytics accounts are all in your name. Plenty of agencies keep your site on their system and charge monthly just to keep it switched on — cancel and you lose everything. Not here. Any ongoing monthly work is strictly month-to-month.",
  },
];

// --- Schema.org Structured Metadata ---
// Only things shown on the page. Google expects structured data to match what visitors see.
export const knowsAbout = [
  "Custom web design and development",
  "Search engine optimization (SEO)",
  "Google Maps and Local SEO",
  "Generative Engine Optimization (GEO) and AI search visibility",
  "AI search analytics and lead attribution",
  "Website speed and Core Web Vitals optimization",
  "Web accessibility (WCAG 2.1 AA)",
  "Websites for medical practices and HIPAA-aware web design",
  "Bilingual English and Spanish websites",
];

// Mirrors the engagement models in `plans`.
export const hasOfferCatalog = {
  "@type": "OfferCatalog",
  "name": "Web Design, Search & AI Marketing Services",
  "itemListElement": [
    {
      "@type": "Offer",
      "name": "Custom Website Build",
      "description": "Custom hand-coded website opening in under 0.4s on mobile with 100/100 Google PageSpeed, working phone preview before payment, done-for-you copywriting, call & search tracking, 90 days of free fixes, and 100% client ownership.",
    },
    {
      "@type": "Offer",
      "name": "Search & AI Visibility Setup",
      "description": "Standalone or add-on Search and AI Optimization (SEO & GEO): four-directory sync across Google Business Profile, Bing Places, Apple Business Connect, and Yelp, connected JSON-LD schema, fact-dense answer architecture, and GA4 AI referral tracking.",
    },
    {
      "@type": "Offer",
      "name": "Ongoing Search & AI Growth",
      "description": "Month-to-month search and AI marketing partnership: new high-intent service and market pages, Google Maps and AI citation growth, review systems, monthly lead attribution reporting, and same-day updates.",
    },
  ],
};

export const business = {
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://cloviswebdesign.com/#business",
  "name": "Clovis Web Design",
  "url": "https://cloviswebdesign.com",
  "telephone": "+15596280142",
  "email": EMAIL,
  "priceRange": "$$",
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
    { "@type": "State", "name": "California" },
    { "@type": "Country", "name": "United States" },
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

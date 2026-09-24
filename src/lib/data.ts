export const PHONE_DISPLAY = "(559) 575-3014";
export const PHONE_TEL = "+15595753014";
export const SMS_LINK = `sms:${PHONE_TEL}`;

export const VIDEO_ORCHARD = "https://videos.pexels.com/video-files/855231/855231-hd_1920_1080_24fps.mp4";
export const VIDEO_SHADOW = "https://videos.pexels.com/video-files/35084306/14863152_1920_1080_60fps.mp4";

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
    planted: ["No patient data on the web", "Printable forms instead of online ones", "Guides patients actually use"],
    stack: ["Astro", "English + Español", "WCAG 2.1 AA", "No-PHI design"],
    yields: [
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
      { value: 140, prefix: "+", suffix: "%", label: "Provider referrals, by Dr. Masood's count" },
      { value: 0, suffix: "", label: "Online forms collecting patient data" },
      { value: 12.6, suffix: ":1", label: "Text contrast ratio", decimals: 1 },
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
    planted: ["A page for every service area", "Flat prices, right on the page", "Driveway protection, said out loud"],
    stack: ["Local SEO", "English + Español", "Text-to-book", "PageSpeed 100"],
    yields: [
      { value: 1, prefix: "#", suffix: "", label: "On Google for “dumpster rental Fresno”" },
      { value: 4, prefix: "+", suffix: "", label: "Trucks bought to keep up with demand" },
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
      { value: 1.5, suffix: "", label: "Avg. position on high-intent searches (1–2)", decimals: 1, display: "1–2" },
    ],
  },
];

export const seasons = [
  {
    key: "seed",
    name: "Seed",
    title: "Discovery — we talk",
    when: "Day 1",
    body:
      "Forty-five minutes on the phone or at your shop. What you do, who calls you, what they ask before they book, and what you keep explaining twice. I look at who else shows up when someone searches your trade around here — then tell you, in plain English, what the site needs. If you need less than you came for, I'll say that too.",
    gets: [
      "A plain-English rundown of what the site should do and why",
      "An honest look at who you're up against locally",
      "Cost and timeline, before you pay anything",
      "A straight answer on whether you need me at all",
    ],
  },
  {
    key: "sprout",
    name: "Sprout",
    title: "Design direction — see it before it's built",
    when: "Days 2–3",
    body:
      "I write the copy from the recording of our conversation — in your words, not mine — and lay out how the page will look. Nobody hands you a blank document to fill in. That's the step that stalls most website projects for months, so I do it.",
    gets: [
      "Real copy from what you actually said — no lorem ipsum",
      "The layout, so you know exactly what's coming",
      "Colour and type tuned for reading at arm's length",
      "One round of changes built into the price",
    ],
  },
  {
    key: "grow",
    name: "Grow",
    title: "Build — by hand",
    when: "Days 3–5",
    body:
      "No page builder, no template, nothing bolted on that slows it down. Your number goes everywhere it should, and the whole thing is built to come up fast on a phone with two bars of signal — because that's where most people will see it.",
    gets: [
      "Hand-written code, zero CMS lock-in, nothing to log into",
      "One tap to call or text you from anywhere on the page",
      "Marked up so Google reads your trade, your area, your number",
      "Checked on a real phone, not just a desktop window",
    ],
  },
  {
    key: "harvest",
    name: "Harvest",
    title: "Launch & 90 days of tending",
    when: "Day 6 onward",
    body:
      "I point the domain, get it into Google, and tidy up your Google listing. For 90 days, anything genuinely broken I fix free — you text, I sort it. After that the site is still yours and still works. The care plan's there if you want it; no hard feelings if you don't.",
    gets: [
      "Domain pointed, site live, Google told it exists",
      "Code and domain in your name — handed over, not lent",
      "90 days of free repairs, by text, direct to me",
      "An optional care plan, never a hostage fee",
    ],
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
    me: ["It's there before they wait", "Nothing in it that doesn't need to be. Fast on real signal, not office wifi."],
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
    name: "Seedling",
    kind: "Landing page",
    time: "1 week",
    price: "$500",
    was: "$750",
    note: "Launch price · first 5 Central Valley businesses",
    color: "bg-citrus",
    hole: "bg-paper",
    items: [
      "One page, hand-built, live in a week",
      "Your number everywhere — one tap to call or text",
      "Loads before anyone gets bored",
      "Set up so Google knows who & where you are",
      "Yours on day one — code, domain, the lot",
      "One round of changes",
    ],
    not: ["No multi-page site or blog", "No logo or brand design", "No ongoing SEO — that's the care plan"],
    for: "Contractors, shops and one-person trades who need a real page today.",
  },
  {
    code: "02",
    name: "Grove",
    kind: "Local authority",
    time: "3–4 weeks",
    price: "$2,500",
    color: "bg-sage",
    hole: "bg-paper",
    items: [
      "3–5 pages, each written from a recorded conversation",
      "A page for every town you serve, built for local searches",
      "A full Spanish version at /es/",
      "Still yours on day one, still no lock-in",
    ],
    not: [],
    for: "Established businesses with more than one service — or who need Spanish alongside English.",
  },
  {
    code: "03",
    name: "Orchard",
    kind: "Flagship",
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
  { name: "No plan", price: "$0", blurb: "Take the keys and go. The site is yours and keeps working without me." },
  { name: "Care Plan", price: "$99", blurb: "Hosting, updates and small changes handled. Cancel any month — the site stays yours." },
  { name: "Care Plus", price: "$249", blurb: "Everything in Care, plus the site keeps growing. Same deal: cancel any month." },
];

export const letters = [
  {
    quote:
      "My main concern was compliance with HIPAA, HITECH and CMIA regulations. Adam was very knowledgeable and experienced with handling these regulations. He made a professional-grade website that looked stunning while protecting the rights of my patients and protecting my practice. And our provider referrals are up over 140%!",
    name: "Dr. Sheikh Mohammad Masood, MD",
    role: "Founding President & Medical Director",
    place: "Madera, CA",
    stamp: "bg-sky",
  },
  {
    quote:
      "Before Adam rebuilt our site, national brokers were taking a huge chunk of every rental. Now, contractors and homeowners in Fresno and Clovis text us directly. We've had to buy 4 more trucks just to keep up with the volume.",
    name: "William Maldonado Ramirez",
    role: "Co-Owner & Head of Operations, Big Bros Dumpster Rentals",
    place: "Fresno, CA",
    stamp: "bg-blush",
  },
];

export const faqs = [
  {
    q: "Who owns the website and the domain once it's live?",
    a: "You do, completely, from day one. The code, the domain and the hosting account are all in your name. Plenty of companies keep your site on their system and charge monthly to keep it switched on — cancel and you lose everything. Not here. If you ever want someone else to take over, hand it to them and walk.",
  },
  {
    q: "What do I actually get for $500?",
    a: "One page, built by hand, live in about a week. Your number sits at the top, the bottom, and on a bar that follows people down the page. It loads fast on a phone, Google understands who you are and where you work, and it's yours the day it goes live. It isn't a multi-page site, a blog or a logo — if you need those, I'll quote them properly.",
  },
  {
    q: "Why $500 when everyone else wants thousands?",
    a: "It's a launch offer limited to the first five businesses, and one page really is about a day of my time once we've talked. After those five it goes to $750 — still less than most shops charge for a template. Bigger builds cost more because they take longer. No trick.",
  },
  {
    q: "Do I have to write all the words myself?",
    a: "No. We talk for about forty-five minutes, I record it, and I write the site from what you actually said. The blank twenty-page questionnaire is what kills most website projects, so I skip it for you.",
  },
  {
    q: "Do I have to sign up for anything monthly?",
    a: "No. The $99 care plan covers hosting, backups, security updates and small changes if you want it — but the site is yours either way. Cancel any month, no notice period, no penalty.",
  },
  {
    q: "Can we keep our existing booking or ordering system?",
    a: "Usually, yes. If it gives you a link or an embed — most do — I can put it on the page without slowing things down. Tell me what you run and I'll confirm before you pay anything.",
  },
  {
    q: "What happens if something breaks after launch?",
    a: `You text me and I fix it — ${"(559) 575-3014"}, not a ticket queue. For the first ninety days anything genuinely broken is free. After that, small things I'll usually just do; real work gets a price before I start.`,
  },
  {
    q: "We're a medical practice. How do you handle patient privacy?",
    a: "By not collecting patient information on the website at all. The site routes people to a phone call or referral fax — channels your practice already handles correctly. Nothing sensitive is stored on the web server, because nothing sensitive is collected there.",
  },
];

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
    planted: ["Zero patient data collected online", "Printable registration & direct referral routing", "Accessible guides patients actually understand"],
    stack: ["Astro", "English + Español", "WCAG 2.1 AA", "No-PHI design"],
    yields: [
      { value: 100, suffix: "/100", label: "Google PageSpeed" },
      { value: 140, prefix: "+", suffix: "%", label: "Provider referrals, by Dr. Masood's count" },
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
    gets: [
      "A plain-English rundown of what the site needs and why",
      "A clear audit of your top local competitors on Google",
      "Fixed cost and timeline upfront, before you pay a dime",
      "An honest answer on whether you need a new website yet",
    ],
  },
  {
    key: "design",
    name: "Design & Copy",
    title: "Design direction — see it before it's built",
    when: "Days 2–3",
    body:
      "I write every word of copy from the recording of our conversation — in your authentic voice, not generic marketing fluff — and lay out the mobile and desktop experience. Nobody hands you a blank 20-page document to fill in. We remove the writing bottleneck that stalls most projects for months.",
    gets: [
      "Done-for-you copy drawn directly from how you talk to clients",
      "Interactive layout so you see exactly what's coming",
      "Typography and contrast engineered for readability in bright sunlight",
      "Full revision round included to fine-tune details",
    ],
  },
  {
    key: "build",
    name: "Custom Build",
    title: "Hand-coded build — zero bloat",
    when: "Days 3–5",
    body:
      "No drag-and-drop page builders, no 40 bloated plugins, and nothing that slows down your mobile load time. Your phone and SMS buttons are positioned where thumbs naturally tap, and every page is structured so Google and AI search engines instantly recognize your trade and service radius.",
    gets: [
      "Clean, hand-written code with zero CMS lock-in or login bloat",
      "One tap to call or text from anywhere on the page",
      "Local schema markup so Google reads your trade, city, and phone",
      "Tested rigorously on real mobile devices under slow cell signal",
    ],
  },
  {
    key: "launch",
    name: "Launch",
    title: "Launch & 90-day guarantee",
    when: "Day 6 onward",
    body:
      "I connect your domain, deploy the high-speed code, and verify your presence in Google Search Console and Google Maps. For 90 days, any bugs or fixes are handled free — text me directly and it's resolved. When we launch, you receive 100% of the code and credentials. The site is yours to keep forever.",
    gets: [
      "Live site launched, domain configured, and Google index submitted",
      "Full ownership of code, domain, and hosting handed to you",
      "90 days of direct-text warranty support with the builder",
      "Optional maintenance plan — never a monthly hostage fee",
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
    name: "Starter",
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
      "Loads in under 1 second on mobile devices",
      "Set up so Google knows who & where you are",
      "Yours on day one — code, domain, the lot",
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
      "Still yours on day one, still no lock-in",
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
  { name: "No plan", price: "$0", blurb: "Take full ownership and go. The site is 100% yours and keeps working without me." },
  { name: "Care Plan", price: "$99", blurb: "Hosting, security updates and small changes handled. Cancel anytime — the site stays yours." },
  { name: "Care Plus", price: "$249", blurb: "Everything in Care, plus new content additions and local SEO tuning. Cancel anytime." },
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

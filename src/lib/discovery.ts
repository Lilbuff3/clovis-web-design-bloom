import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, business, cases, plans, services } from "./data.ts";

const SITE_ORIGIN = business.url;

export type CanonicalRoute = {
  path: string;
  url: string;
  changefreq: "weekly" | "monthly";
  priority: string;
  title: string;
  description: string;
};

const bigBrosCase = cases.find((c) => c.caseStudyPath.includes("dumpster-rental"))!;
const kidneyCase = cases.find((c) => c.caseStudyPath.includes("kidney-specialist"))!;

export const CANONICAL_ROUTES: CanonicalRoute[] = [
  {
    path: "/",
    url: `${SITE_ORIGIN}/`,
    changefreq: "weekly",
    priority: "1.0",
    title: `${business.name} — Services & Engagement Models`,
    description: `Overview of our five lifecycle services (${services.map((s) => s.title).join(", ")}), client case studies, and engagement models.`,
  },
  {
    path: "/services/",
    url: `${SITE_ORIGIN}/services/`,
    changefreq: "monthly",
    priority: "0.9",
    title: "Services & Capabilities Overview",
    description: `Full breakdown of our five lifecycle services: ${services.map((s) => s.title).join(", ")}.`,
  },
  {
    path: "/packages/",
    url: `${SITE_ORIGIN}/packages/`,
    changefreq: "monthly",
    priority: "0.9",
    title: "Packages & Engagement Models",
    description: `How engagements are scoped to your business and ROI: ${plans.map((p) => p.name).join(", ")}.`,
  },
  {
    path: "/services/medical-web-design/",
    url: `${SITE_ORIGIN}/services/medical-web-design/`,
    changefreq: "monthly",
    priority: "0.9",
    title: "Medical & Dental Practice Web Design",
    description:
      "Zero-patient-data website architecture, WCAG 2.1 AA accessibility, and referring-physician portals for medical and dental practices.",
  },
  {
    path: "/services/contractor-websites/",
    url: `${SITE_ORIGIN}/services/contractor-websites/`,
    changefreq: "monthly",
    priority: "0.9",
    title: "Contractor & Trade Website Design",
    description:
      "Sub-second mobile websites and Google Maps / AI search setup for contractors and home service businesses.",
  },
  {
    path: "/services/local-seo-fresno/",
    url: `${SITE_ORIGIN}/services/local-seo-fresno/`,
    changefreq: "monthly",
    priority: "0.8",
    title: "Search, Google Maps & AI Search Marketing (SEO & GEO)",
    description:
      "How Google Search, Gemini, ChatGPT, Claude, Perplexity, and Apple Siri verify and recommend businesses across the four core directories.",
  },
  {
    path: bigBrosCase.caseStudyPath,
    url: `${SITE_ORIGIN}${bigBrosCase.caseStudyPath}`,
    changefreq: "monthly",
    priority: "0.8",
    title: `Case Study: ${bigBrosCase.client}`,
    description: `How ${bigBrosCase.client} reached #1 on Google for 'dumpster rental Fresno' and added 4 trucks.`,
  },
  {
    path: kidneyCase.caseStudyPath,
    url: `${SITE_ORIGIN}${kidneyCase.caseStudyPath}`,
    changefreq: "monthly",
    priority: "0.8",
    title: `Case Study: ${kidneyCase.client}`,
    description: `How ${kidneyCase.client} increased referring-physician volume by 40% with zero patient data collected online and 100/100 PageSpeed.`,
  },
];

export const CANONICAL_URLS: string[] = CANONICAL_ROUTES.map((r) => r.url);

const cityNames = business.areaServed
  .filter((a) => a["@type"] === "City")
  .map((a) => a.name.replace(/,\s*CA$/i, ""));

const hoursSpec = business.openingHoursSpecification[0];
const is24x7 =
  hoursSpec.dayOfWeek.length === 7 && hoursSpec.opens === "00:00" && hoursSpec.closes === "23:59";
const HOURS_SUMMARY = is24x7
  ? "Open 24/7 (Sunday – Saturday, 00:00 – 23:59 PT)"
  : `${hoursSpec.dayOfWeek[0]} – ${hoursSpec.dayOfWeek[hoursSpec.dayOfWeek.length - 1]}, ${hoursSpec.opens} – ${hoursSpec.closes} PT`;

export function buildLlmsTxt(): string {
  return `# ${business.name}

> End-to-end brand positioning, custom web design, Google Maps SEO, AI search optimization (ChatGPT, Gemini, Claude, Perplexity, Siri), and lead attribution & retention for growth-minded businesses across industries. Built and operated by ${business.founder.name} in Clovis, California.

${business.name} is an independent brand, web engineering, and search/AI marketing studio operated by ${business.founder.name} in Clovis, California, serving businesses in Fresno, Clovis, the Central Valley, and across the United States. Sites are hand-coded with modern web standards (Astro, React, Tailwind CSS) for sub-0.4-second mobile loading, 100/100 Google PageSpeed, Google Maps 3-Pack rankings, and AI answer engine citations. No WordPress templates, no page builders, zero monthly hostage fees, and 100% client asset ownership from day one.

## Contact Information
- Location: Clovis, CA (serving ${cityNames.join(", ")}, California, and the US)
- Phone / Text: ${PHONE_DISPLAY}
- Email: ${EMAIL}
- Hours: ${HOURS_SUMMARY}
- [${business.name} Homepage](${SITE_ORIGIN}/): Overview of services, client results, and engagement models.
- [Services & Capabilities Overview](${SITE_ORIGIN}/services/): Full breakdown of custom web engineering, Google Maps SEO, AI search optimization (GEO), and GA4 AI lead tracking.
- [Packages & Engagement Models](${SITE_ORIGIN}/packages/): How custom website builds, Search & AI visibility setups, and ongoing monthly growth partnerships are scoped.
- [Verified Google Maps Profile](${business.hasMap}): Official Google Business Profile in Clovis, CA.
- [Full AI Documentation](${SITE_ORIGIN}/llms-full.txt): Comprehensive technical and service reference.
- [AI Resource Catalog](${SITE_ORIGIN}/.well-known/ai-catalog.json): Machine-readable resource and tool catalog.

## Five Lifecycle Services (Available Individually or Combined)
- [${services[0].title}](${SITE_ORIGIN}/services/): Clear brand positioning, visual direction, and customer-facing copy written from a 15-minute interview so buyers understand within three seconds what you do and why they should pick you.
- [${services[1].title}](${SITE_ORIGIN}/services/): Hand-coded static websites opening in under 0.4s on mobile, scoring 100/100 on Google PageSpeed, built to WCAG 2.1 AA accessibility, with optional full Spanish (/es/) and compliant intake routing. Over half of mobile visitors abandon pages that take 3–4 seconds to load, and live AI search crawlers time out on slow templates before reading a single word.
- [${services[2].title}](${SITE_ORIGIN}/services/local-seo-fresno/): Google Business Profile optimization, dedicated high-intent service and market pages, and review velocity systems to rank in the Google Maps 3-Pack and organic search results. Captures ready-to-buy searchers at the top of Google without paying per click.
- [${services[3].title} (GEO)](${SITE_ORIGIN}/services/local-seo-fresno/#ai-search): Four-directory entity sync across Google Business Profile, Bing Places, Apple Business Connect, and Yelp, connected JSON-LD @graph schema, fact-dense answer blocks, and /llms.txt discovery files so ChatGPT, Google Gemini, Claude, Perplexity, and Apple Siri recommend the business.
- [${services[4].title}](${SITE_ORIGIN}/#check): Custom Google Analytics 4 (GA4) channel configuration isolating referrals from ChatGPT, Gemini, Claude, and Perplexity alongside phone call, SMS, form conversion tracking, and automated review/lead retention flows.

## Specialized Playbooks
- [Search, Google Maps & AI Marketing](${SITE_ORIGIN}/services/local-seo-fresno/): Full breakdown of how Google, ChatGPT, Gemini, Claude, and Siri verify and recommend businesses.
- [Medical & Dental Practice Web Design](${SITE_ORIGIN}/services/medical-web-design/): Websites for clinics, physicians, and dentists that collect zero patient health information online, built to WCAG 2.1 AA accessibility standards.
- [Contractor & Trade Websites](${SITE_ORIGIN}/services/contractor-websites/): Built for contractors and home service companies with tap-to-call and tap-to-text on every screen and sub-second field cellular loading.

## Engagement Models
- [${plans[0].name}](${SITE_ORIGIN}/packages/): Brand positioning and hand-coded custom website (<0.4s mobile load, 100/100 PageSpeed), working phone preview before you pay anything ($0 if you don't approve the preview), done-for-you copywriting from a 15-minute discovery call, tap-to-call/SMS/search tracking, 90 days of free fixes after launch, and 100% client ownership of code, domain, and hosting.
- [${plans[1].name}](${SITE_ORIGIN}/packages/): Standalone overhaul or add-on including four-directory profile sync across Google Maps, Bing Places, Apple Business Connect, and Yelp, connected LocalBusiness/Service/FAQPage JSON-LD structured data, fact-dense answer architecture, /llms.txt discovery files, and custom GA4 AI referral tracking.
- [${plans[2].name}](${SITE_ORIGIN}/packages/): Modular month-to-month partnership including new high-intent service and market pages each month, ongoing Google Maps, ChatGPT, Gemini, and Claude citation and review growth, monthly lead attribution reporting, and same-day text-me website updates. Cancel anytime with one text.

## Verified Case Studies
- [${bigBrosCase.client} Case Study](${SITE_ORIGIN}${bigBrosCase.caseStudyPath}): ${bigBrosCase.trade} in ${bigBrosCase.place}. Ranked #1 on Google for "dumpster rental Fresno" and added 4 trucks to keep up with calls.
- [${kidneyCase.client} Case Study](${SITE_ORIGIN}${kidneyCase.caseStudyPath}): ${kidneyCase.trade} medical practice in ${kidneyCase.place}. Zero patient data collected online, 100/100 Google PageSpeed, and doctor referrals up 40% by ${kidneyCase.quote.name}'s count.
`;
}

export function buildLlmsFullTxt(): string {
  return `# ${business.name} — Full Technical & Service Reference

> Brand positioning, custom web design, Google Maps SEO, AI search optimization (GEO), and GA4 AI lead attribution for growth-minded businesses. Built and operated by ${business.founder.name} in Clovis, California.

## 1. Studio Identity & Contact
- Studio Name: ${business.name}
- Founder & Lead Developer: ${business.founder.name}
- Headquarters: Clovis, CA ${business.address.postalCode} (${business.geo.latitude}° N, ${Math.abs(business.geo.longitude)}° W)
- Service Area: ${cityNames.join(", ")}, California's Central Valley, and businesses nationwide across the United States
- Phone / Direct SMS: ${PHONE_DISPLAY} (${PHONE_TEL})
- Email: ${EMAIL}
- Hours: ${HOURS_SUMMARY}
- Website: ${SITE_ORIGIN}/
- Services Overview: ${SITE_ORIGIN}/services/
- Packages & Engagement Models: ${SITE_ORIGIN}/packages/
- Google Maps CID: ${business.hasMap}

## 2. How Modern Search & AI Discovery Works (The Four Directories)
Each major search and AI answer engine verifies businesses against a different primary directory before recommending them:
- Google Search, AI Overviews & Google Gemini: Grounded in Google Business Profile and Google Maps, cross-checked against website NAP consistency, service pages, and review responses.
- ChatGPT & Perplexity: Grounded in Bing Web Search, Bing Places, Yelp, and Foursquare, requiring sub-second static HTML (<0.4s so live RAG crawlers do not time out), semantic tables, and specific service/pricing facts.
- Claude (Anthropic): Grounded in Brave Search and independent web citations, favoring direct question-and-answer blocks and verified customer quotes.
- Apple Maps & Siri: Grounded in Apple Business Connect and Yelp, verifying operating hours, address/service area, and tap-to-call routing.

## 3. Five Lifecycle Services (Unbundled or Combined)
- Full breakdown: ${SITE_ORIGIN}/services/
1. ${services[0].title}
   - Deliverables: Market and competitor positioning audit, core value proposition, 15-minute founder interview extraction, high-intent buyer copywriting, visual identity direction, and above-the-fold conversion architecture.
2. ${services[1].title}
   - Stack: Astro static output, React islands, Tailwind CSS, self-hosted WOFF2 typography, inlined critical CSS.
   - Performance: Under 0.4s mobile load, 100/100 Google PageSpeed, WCAG 2.1 AA accessibility, zero plugins, 100% client code and domain ownership.
3. ${services[2].title} (${SITE_ORIGIN}/services/local-seo-fresno/)
   - Deliverables: Google Business Profile optimization, dedicated high-intent service and market pages, semantic internal linking, and review velocity workflows.
4. ${services[3].title} (GEO) (${SITE_ORIGIN}/services/local-seo-fresno/#ai-search)
   - Deliverables: Four-directory profile alignment (Google, Bing, Apple Maps, Yelp), connected JSON-LD @graph (LocalBusiness + Service + FAQPage), fact-dense answer architecture (40–60 word direct answers + HTML tables), /llms.txt, and /.well-known/ai-catalog.json.
5. ${services[4].title}
   - Deliverables: Custom GA4 channel group isolating referrals from ChatGPT, Gemini, Claude, Perplexity, Copilot, DeepSeek, Grok, and Meta AI, paired with phone call, SMS, form conversion tracking, and automated review/retention flows.

## 4. Engagement Models (${SITE_ORIGIN}/packages/)
- ${plans[0].name}: One-time custom website project with working phone preview before payment, done-for-you copywriting from a 15-minute interview, 90 days of free post-launch fixes, and 100% ownership.
- ${plans[1].name}: Standalone one-time overhaul for an existing site or paired with a new build. Includes four-directory sync, JSON-LD @graph, AI answer blocks, /llms.txt, and GA4 AI lead tracking.
- ${plans[2].name}: Month-to-month retainer scoped to market competition and ROI. Includes monthly service/market page expansion, citation and review velocity, monthly Google Maps and AI visibility audits, and same-day text-me updates.

## 5. Specialized Playbooks & Verified Case Studies
- Medical & Dental Practice Web Design: ${SITE_ORIGIN}/services/medical-web-design/
- Contractor & Trade Website Design: ${SITE_ORIGIN}/services/contractor-websites/
- ${bigBrosCase.client} (${SITE_ORIGIN}${bigBrosCase.caseStudyPath}): Ranked #1 on Google for "dumpster rental Fresno" and added 4 roll-off trucks to keep up with demand.
- ${kidneyCase.client} (${SITE_ORIGIN}${kidneyCase.caseStudyPath}): Zero patient health information collected online, 100/100 Google PageSpeed, and +40% provider referrals by ${kidneyCase.quote.name}'s count.
`;
}

export function buildSitemapXml(): string {
  const entries = CANONICAL_ROUTES.map(
    (r) => `  <url>
    <loc>${r.url}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export function buildAiCatalog() {
  return {
    $schema: "https://json.schemastore.org/ard-schema.json",
    version: "1.0",
    name: business.name,
    description: `Brand positioning, custom web design, Google Maps SEO, AI search optimization (GEO), and GA4 AI lead attribution for growth-minded businesses. Operated by ${business.founder.name} in Clovis, California.`,
    url: `${SITE_ORIGIN}/`,
    llmsTxtUrl: `${SITE_ORIGIN}/llms.txt`,
    llmsFullTxtUrl: `${SITE_ORIGIN}/llms-full.txt`,
    resources: CANONICAL_ROUTES.map((r) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    })),
    tools: [
      {
        name: "audit_ai_visibility",
        description:
          "Live Google Gemini + Google Maps lookup that checks whether AI recommends a business for its industry and city.",
        endpoint: `${SITE_ORIGIN}/api/ask-gemini/`,
        method: "POST",
      },
      {
        name: "contact_adam",
        description: `Send a project or audit inquiry directly to ${business.founder.name} at ${business.name}.`,
        endpoint: `${SITE_ORIGIN}/api/contact`,
        method: "POST",
      },
    ],
  };
}

/** Writes all four Discovery Manifests into `public/` from canonical data in `src/lib/data.ts`. */
export function syncDiscoveryManifests(
  publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public")
): void {
  fs.writeFileSync(path.join(publicDir, "llms.txt"), buildLlmsTxt(), "utf8");
  fs.writeFileSync(path.join(publicDir, "llms-full.txt"), buildLlmsFullTxt(), "utf8");
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemapXml(), "utf8");
  fs.writeFileSync(
    path.join(publicDir, ".well-known", "ai-catalog.json"),
    JSON.stringify(buildAiCatalog(), null, 2) + "\n",
    "utf8"
  );
}

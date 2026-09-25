import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("Error: dist/index.html does not exist. Run vite build first.");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf-8");

// 1. Replace Title
html = html.replace(
  /<title>.*?<\/title>/s,
  "<title>Conversion Boost™ — Clovis Web Design | Mobile Speed &amp; Local SEO Audit</title>"
);

// 2. Replace Canonical
html = html.replace(
  /<link rel="canonical" href="https:\/\/cloviswebdesign\.com\/?" \/>/,
  '<link rel="canonical" href="https://cloviswebdesign.com/boost" />'
);

// 3. Replace Meta Description
html = html.replace(
  /<meta name="description" content=".*?" \/>/s,
  '<meta name="description" content="Stop losing local calls to a four-second mobile lag. Hand-built websites that score 100/100 on Google PageSpeed for Fresno &amp; Clovis businesses. Launch the loss calculator." />'
);

// 4. Replace OpenGraph Tags
html = html.replace(
  /<meta property="og:url" content=".*?" \/>/,
  '<meta property="og:url" content="https://cloviswebdesign.com/boost" />'
);
html = html.replace(
  /<meta property="og:title" content=".*?" \/>/,
  '<meta property="og:title" content="Conversion Boost™ — Stop Losing Local Calls | Clovis Web Design" />'
);
html = html.replace(
  /<meta property="og:description" content=".*?" \/>/,
  '<meta property="og:description" content="Hand-built websites scoring 100/100 on Google PageSpeed for Fresno &amp; Clovis businesses. Built by Adam Youssef in Clovis, CA." />'
);

// 5. Replace Twitter Tags
html = html.replace(
  /<meta name="twitter:url" content=".*?" \/>/,
  '<meta name="twitter:url" content="https://cloviswebdesign.com/boost" />'
);
html = html.replace(
  /<meta name="twitter:title" content=".*?" \/>/,
  '<meta name="twitter:title" content="Conversion Boost™ — Clovis Web Design" />'
);
html = html.replace(
  /<meta name="twitter:description" content=".*?" \/>/,
  '<meta name="twitter:description" content="Hand-built websites scoring 100/100 on Google PageSpeed for Fresno &amp; Clovis businesses." />'
);

// 6. Deep Schema.org JSON-LD tailored specifically for /boost
const boostSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": "https://cloviswebdesign.com/#business",
      "name": "Clovis Web Design",
      "alternateName": [
        "Clovis Web Design Studio",
        "ClovisWebDesign",
        "Clovis Web Design by Adam Youssef"
      ],
      "url": "https://cloviswebdesign.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cloviswebdesign.com/images/clovis-web-design-logo.png",
        "width": 1024,
        "height": 1024,
        "caption": "Clovis Web Design Logo"
      },
      "image": [
        "https://cloviswebdesign.com/images/clovis-cover.jpg",
        "https://cloviswebdesign.com/images/clovis-logo.jpg",
        "https://cloviswebdesign.com/images/clovis-web-design-logo.png"
      ],
      "description": "Fast, hand-built websites grown in Clovis, CA by Adam Youssef. Landing pages from $500, live in a week. 100/100 Google PageSpeed scores, zero lock-in, and local SEO built in for Central Valley small businesses and medical practices.",
      "telephone": "+15595753014",
      "email": "hello@cloviswebdesign.com",
      "priceRange": "$500 - $5,000",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card, Check, ACH, Invoice",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Clovis",
        "addressRegion": "CA",
        "postalCode": "93619",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 36.8346,
        "longitude": -119.6596
      },
      "founder": {
        "@type": "Person",
        "@id": "https://cloviswebdesign.com/#founder",
        "name": "Adam Youssef",
        "jobTitle": "Founder & Lead Web Engineer",
        "url": "https://cloviswebdesign.com",
        "telephone": "+15595753014",
        "email": "hello@cloviswebdesign.com"
      },
      "sameAs": [
        "https://github.com/Lilbuff3/clovis-web-design-bloom"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://cloviswebdesign.com/#website",
      "url": "https://cloviswebdesign.com",
      "name": "Clovis Web Design",
      "publisher": {
        "@id": "https://cloviswebdesign.com/#business"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "WebPage",
      "@id": "https://cloviswebdesign.com/boost#webpage",
      "url": "https://cloviswebdesign.com/boost",
      "name": "Conversion Boost™ — Speed & Local Search Audit | Clovis Web Design",
      "isPartOf": {
        "@id": "https://cloviswebdesign.com/#website"
      },
      "about": {
        "@id": "https://cloviswebdesign.com/#business"
      },
      "mainEntity": {
        "@id": "https://cloviswebdesign.com/boost#service"
      },
      "description": "Stop losing local calls to a four-second mobile lag. Hand-built websites that score 100/100 on Google PageSpeed for Fresno & Clovis businesses. Launch the loss calculator.",
      "breadcrumb": {
        "@id": "https://cloviswebdesign.com/boost#breadcrumbs"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "Service",
      "@id": "https://cloviswebdesign.com/boost#service",
      "name": "Conversion Boost™ — Speed & Local Search Audit",
      "serviceType": "Web Performance Optimization & Local SEO Rebuild",
      "provider": {
        "@id": "https://cloviswebdesign.com/#business"
      },
      "url": "https://cloviswebdesign.com/boost",
      "description": "Speed rebuild and local SEO boost for businesses losing calls to mobile load lag. Hand-built lightweight architecture scoring 100/100 on Google PageSpeed, sub-second interactive paint on cellular LTE, and local map 3-pack optimization.",
      "offers": {
        "@type": "Offer",
        "price": "500",
        "priceCurrency": "USD",
        "url": "https://cloviswebdesign.com/boost",
        "availability": "https://schema.org/InStock",
        "validFrom": "2026-01-01"
      },
      "areaServed": [
        {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 36.8252,
            "longitude": -119.7029
          },
          "geoRadius": "55000"
        },
        {
          "@type": "City",
          "name": "Clovis"
        },
        {
          "@type": "City",
          "name": "Fresno"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Central Valley, California"
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://cloviswebdesign.com/boost#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://cloviswebdesign.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Conversion Boost™",
          "item": "https://cloviswebdesign.com/boost"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://cloviswebdesign.com/boost#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why does mobile page speed matter for local businesses in Clovis and Fresno?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Over 70% of local service searches in Fresno and Clovis happen on mobile devices with fluctuating cellular reception. When a site takes longer than 3 seconds to load, over 53% of mobile visitors abandon the page. A 100/100 PageSpeed site loads instantaneously, keeping visitors on your page and converting them directly into phone calls."
          }
        },
        {
          "@type": "Question",
          "name": "What is included in the Conversion Boost™ package?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Conversion Boost™ includes a comprehensive speed audit, elimination of bloated plugins and render-blocking scripts, hand-coded lightweight architecture scoring 100/100 on Google PageSpeed, mobile tap-to-call/text optimization, and local SEO configuration for the Google Local 3-Pack."
          }
        },
        {
          "@type": "Question",
          "name": "How quickly can my site be boosted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Conversion Boost builds are completed and live in approximately 7 days from our initial recorded consultation."
          }
        },
        {
          "@type": "Question",
          "name": "Will my Google rankings improve after a Conversion Boost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Google uses Core Web Vitals (Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift) as explicit ranking factors in both organic search and mobile local search. Faster sites with clear local schema rank higher and convert more visitors."
          }
        }
      ]
    }
  ]
};

const jsonLdRegex = /<script type="application\/ld\+json">.*?<\/script>/s;
html = html.replace(
  jsonLdRegex,
  `<script type="application/ld+json">\n    ${JSON.stringify(boostSchema, null, 2)}\n    </script>`
);

// Ensure all relative asset links are root-relative so /boost/ resolves correctly
html = html.replace(/href="\.\//g, 'href="/');
html = html.replace(/src="\.\//g, 'src="/');

// 7. Write dist/boost/index.html & dist/boost.html
const boostDir = path.join(distDir, "boost");
if (!fs.existsSync(boostDir)) {
  fs.mkdirSync(boostDir, { recursive: true });
}

fs.writeFileSync(path.join(boostDir, "index.html"), html, "utf-8");
fs.writeFileSync(path.join(distDir, "boost.html"), html, "utf-8");

console.log("PASS: Successfully generated dist/boost/index.html and dist/boost.html with dedicated SEO & Schema.org!");

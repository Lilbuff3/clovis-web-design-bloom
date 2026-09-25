// Build-time render (scripts/prerender.js) so crawlers that don't run JS still see the page.
// Pages with a `head` get their own copy of index.html with these tags swapped in.
import { renderToString } from "react-dom/server";
import App from "./App";
import { BoostPage } from "./components/BoostPage";
import { MedicalPage } from "./components/MedicalPage";
import { medical, plans, studio } from "./data/content";

const SITE = "https://cloviswebdesign.com";
const business = { "@id": `${SITE}/#business` };

function medicalJsonLd() {
  const url = SITE + medical.path;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        ...business,
        name: studio.name,
        url: SITE,
        telephone: studio.phoneHref.replace("tel:", ""),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: medical.seo.title,
        description: medical.seo.description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: business,
        mainEntity: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumbs` },
        inLanguage: "en-US",
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "Medical practice website design",
        serviceType: "Website design for medical, dental and therapy practices",
        provider: business,
        url,
        description: medical.seo.description,
        areaServed: [
          { "@type": "City", name: "Fresno" },
          { "@type": "City", name: "Madera" },
          { "@type": "City", name: "Clovis" },
          { "@type": "AdministrativeArea", name: "Central Valley, California" },
        ],
        offers: { "@type": "Offer", price: plans[2].price.replace(/\D/g, ""), priceCurrency: "USD", url },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Medical practice websites", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: medical.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

const boost = () => renderToString(<BoostPage onNavigate={() => {}} />);

export const pages = [
  { file: "dist/index.html", render: () => renderToString(<App />) },
  { file: "dist/boost.html", render: boost },
  { file: "dist/boost/index.html", render: boost },
  {
    file: `dist${medical.path}.html`,
    render: () => renderToString(<MedicalPage />),
    head: { url: SITE + medical.path, ...medical.seo, jsonLd: medicalJsonLd() },
  },
];

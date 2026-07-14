import { siteConfig, specializations, branches } from "@/data/content";

// Hosted on Vercel Blob because the logo files under /public have spaces and
// diacritics in their filenames — this is the same clean URL the transactional
// emails already use.
const LOGO_URL =
  "https://mg49vxtan6zvbcsp.public.blob.vercel-storage.com/tarus-logo-email.png";

// Returned as an array — JSON-LD allows multiple top-level entities in one
// <script> block, and Google parses each independently.
export function getStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: "cs",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    getBusinessStructuredData(),
  ];
}

function getBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: LOGO_URL,
    image: `${siteConfig.url}/og-image.png`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressCountry: "CZ",
    },
    // Sales operates from Olomouc, but delivery/service covers the whole
    // country — matters for how search engines scope "near me"-style intent.
    areaServed: [
      { "@type": "Country", name: "Česká republika" },
      { "@type": "AdministrativeArea", name: "Olomoucký kraj" },
      { "@type": "AdministrativeArea", name: "Moravskoslezský kraj" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "sales",
      areaServed: "CZ",
      availableLanguage: "Czech",
    },
    // Links the e-shop as the same business entity — helps search engines
    // connect the two properties instead of treating eshop.tarus.cz as
    // unrelated.
    sameAs: [siteConfig.shopUrl],
    // Second physical branch (Krnov) — surfaced as a department of the same
    // organization so search engines can resolve local intent for both
    // locations instead of only the Olomouc HQ.
    department: branches
      .filter((b) => b.id !== "olomouc")
      .map((b) => ({
        "@type": "HardwareStore",
        name: b.name,
        telephone: b.phone,
        ...(b.email ? { email: b.email } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address.split(",")[0]?.trim(),
          addressLocality: b.address.split(",").slice(1).join(",").trim(),
          addressCountry: "CZ",
        },
      })),
    // Topical relevance signal: the exact categories of material/hardware
    // this distributor is knowledgeable about and sells.
    knowsAbout: [
      "Tesařské kování",
      "Konstrukční kování pro krovy a dřevěné skelety",
      "Terasové systémy",
      "Fasádní systémy",
      "Nerezové spojovací prvky",
      "Materiál pro dřevostavby",
      "Materiál pro roubenky",
      "Materiál pro šikmé střechy",
    ],
    // Ties each specialization into the structured data as a concrete
    // service offering, reusing the same copy shown on the page (single
    // source of truth — data/content.ts).
    makesOffer: specializations.map((spec) => ({
      "@type": "Offer",
      url: `${siteConfig.url}/${spec.id}`,
      itemOffered: {
        "@type": "Service",
        name: spec.label,
        description: spec.description,
      },
    })),
  };
}

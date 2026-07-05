import { siteConfig, specializations } from "@/data/content";

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
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
      itemOffered: {
        "@type": "Service",
        name: spec.label,
        description: spec.description,
      },
    })),
  };
}

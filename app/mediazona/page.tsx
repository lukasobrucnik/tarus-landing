import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactModalProvider } from "@/components/ContactModal";
import { CtaButton } from "@/components/CtaButton";
import { ArticleList } from "@/components/mediazona/ArticleList";
import { NewsletterForm } from "@/components/mediazona/NewsletterForm";
import { getArticles, mediazonaConfig } from "@/data/mediazona";
import { siteConfig } from "@/data/content";
import { getSectionImages } from "@/lib/getSectionImages";

const url = `${siteConfig.url}/mediazona`;

export const metadata: Metadata = {
  title: { absolute: mediazonaConfig.title },
  description: mediazonaConfig.description,
  alternates: { canonical: url },
  openGraph: {
    title: mediazonaConfig.title,
    description: mediazonaConfig.description,
    url,
    type: "website",
    locale: "cs_CZ",
    siteName: siteConfig.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: mediazonaConfig.title }],
  },
  twitter: { card: "summary_large_image", title: mediazonaConfig.title, description: mediazonaConfig.description, images: ["/og-image.png"] },
};

export default function MediazonaPage() {
  const tarusImages = getSectionImages("tarus");
  const navLogoSrc = tarusImages.find((f) => f.includes("bile")) ?? null;
  const footerLogoSrc = tarusImages.find((f) => f.includes("kompletní")) ?? null;
  const list = getArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: mediazonaConfig.title,
    description: mediazonaConfig.description,
    url,
    inLanguage: "cs",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    hasPart: list
      .filter((a) => a.status === "publikovano")
      .map((a) => ({ "@type": "Article", headline: a.title, url: `${url}/${a.slug}` })),
  };

  return (
    <ContactModalProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar logoSrc={navLogoSrc} solid />
      <main id="main" className="bg-paper px-5 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-[1100px]">
          <header className="mb-10 md:mb-12">
            <h1 className="mb-4 font-display-lg text-4xl font-extrabold leading-[1.08] tracking-tight text-ink md:text-6xl">
              Mediazóna
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate" style={{ textWrap: "pretty" }}>
              Nechte si poradit s výběrem od profesionálů z praxe. Návody, recenze a porovnání materiálů i
              nejnovější novinky z TARUS.
            </p>
          </header>

          <ArticleList articles={list} />

          <section className="mb-4 flex flex-col gap-6 border border-slate/15 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="mb-1 font-display-lg text-xl font-bold text-ink">Nenašli jste odpověď?</h2>
              <p className="text-slate">Napište nám dotaz. Z nejčastějších otázek děláme další články.</p>
            </div>
            <CtaButton className="shrink-0">Zeptat se</CtaButton>
          </section>

          <NewsletterForm source="mediazóna – přehled" />
        </div>
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </ContactModalProvider>
  );
}

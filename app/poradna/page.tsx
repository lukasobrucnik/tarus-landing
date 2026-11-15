import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactModalProvider } from "@/components/ContactModal";
import { CtaButton } from "@/components/CtaButton";
import { ArticleCard } from "@/components/poradna/ArticleCard";
import { NewsletterForm } from "@/components/poradna/NewsletterForm";
import { getArticles, poradnaConfig } from "@/data/poradna";
import { siteConfig } from "@/data/content";
import { getSectionImages } from "@/lib/getSectionImages";

const url = `${siteConfig.url}/poradna`;

export const metadata: Metadata = {
  title: { absolute: poradnaConfig.title },
  description: poradnaConfig.description,
  alternates: { canonical: url },
  openGraph: {
    title: poradnaConfig.title,
    description: poradnaConfig.description,
    url,
    type: "website",
    locale: "cs_CZ",
    siteName: siteConfig.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: poradnaConfig.title }],
  },
  twitter: { card: "summary_large_image", title: poradnaConfig.title, description: poradnaConfig.description, images: ["/og-image.png"] },
};

export default function PoradnaPage() {
  const tarusImages = getSectionImages("tarus");
  const navLogoSrc = tarusImages.find((f) => f.includes("bile")) ?? null;
  const footerLogoSrc = tarusImages.find((f) => f.includes("kompletní")) ?? null;
  const list = getArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: poradnaConfig.title,
    description: poradnaConfig.description,
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
          <header className="mb-14 grid gap-8 border-b border-slate/10 pb-12 md:mb-16 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="mb-4 font-label-md text-label-md uppercase tracking-wider text-brand-deep">Poradna TARUS</p>
              <h1
                className="font-display-lg text-4xl font-extrabold leading-[1.08] tracking-tight text-ink md:text-6xl"
                style={{ textWrap: "balance" }}
              >
                Jaký materiál vybrat a jak ho správně namontovat
              </h1>
            </div>
            <p className="text-lg leading-relaxed text-slate" style={{ textWrap: "pretty" }}>
              Porovnání, recenze a návody od lidí, kteří materiál pro dřevostavby denně prodávají a řeší s
              realizačními firmami na stavbách. Krátce, s videem a s odkazem rovnou na produkt.
            </p>
          </header>

          <div className="mb-20 grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>

          <section className="mb-16 flex flex-col gap-6 border border-slate/15 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="mb-1 font-display-lg text-xl font-bold text-ink">Nenašli jste odpověď?</h2>
              <p className="text-slate">Napište nám dotaz. Z nejčastějších otázek děláme další články.</p>
            </div>
            <CtaButton className="shrink-0">Zeptat se</CtaButton>
          </section>

          <NewsletterForm source="poradna – přehled" />
        </div>
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </ContactModalProvider>
  );
}

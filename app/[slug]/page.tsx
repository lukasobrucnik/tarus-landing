import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactModalProvider } from "@/components/ContactModal";
import { CtaButton } from "@/components/CtaButton";
import { Placeholder } from "@/components/ui/Placeholder";
import { specializations, siteConfig } from "@/data/content";
import { getSectionImages } from "@/lib/getSectionImages";

type Props = { params: Promise<{ slug: string }> };

// Pre-renders exactly one static page per specialization (tesarske-kovani,
// terasove-systemy, fasadni-systemy, nerez) — any other slug 404s via the
// notFound() call below, it never becomes a general catch-all.
export function generateStaticParams() {
  return specializations.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spec = specializations.find((s) => s.id === slug);
  if (!spec) return {};

  const title = `${spec.label} — skladem, expedice do 24 hodin`;
  const description = `${spec.description} V nabídce: ${spec.subcategories.join(", ").toLowerCase()}.`;
  const url = `${siteConfig.url}/${spec.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // images must be repeated here — Next.js replaces the parent segment's
    // openGraph/twitter objects wholesale, it does not deep-merge them, so
    // omitting images would ship these pages without any og-image.
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "cs_CZ",
      siteName: siteConfig.name,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: spec.label }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}

export default async function SpecializacePage({ params }: Props) {
  const { slug } = await params;
  const specIndex = specializations.findIndex((s) => s.id === slug);
  const spec = specializations[specIndex];
  if (!spec) notFound();

  const images = getSectionImages("specializace");
  const tarusImages = getSectionImages("tarus");
  const navLogoSrc = tarusImages.find((f) => f.includes("bile")) ?? null;
  const footerLogoSrc = tarusImages.find((f) => f.includes("kompletní")) ?? null;
  const others = specializations.filter((s) => s.id !== spec.id);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "TARUS", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: spec.label, item: `${siteConfig.url}/${spec.id}` },
    ],
  };

  return (
    <ContactModalProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar logoSrc={navLogoSrc} solid />
      <main className="bg-paper px-5 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-[900px]">
          <a
            href="/#specializace"
            className="mb-6 inline-flex items-center gap-1.5 font-label-md text-label-md uppercase tracking-wider text-slate transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> Zpět na přehled specializací
          </a>

          <h1
            className="mb-6 font-display-lg text-4xl font-extrabold leading-tight text-ink md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            {spec.label}
          </h1>

          <p
            className="mb-10 max-w-2xl font-body-lg text-lg leading-relaxed text-slate"
            style={{ textWrap: "pretty" }}
          >
            {spec.description}
          </p>

          <div className="relative mb-10 h-[280px] w-full overflow-hidden md:h-[420px]">
            {images[specIndex] ? (
              <Image
                src={images[specIndex]}
                alt={spec.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            ) : (
              <Placeholder alt={spec.imageAlt} variant={spec.variant} className="h-full w-full" />
            )}
          </div>

          <h2 className="mb-4 font-display-lg text-2xl font-bold text-ink">
            Co v kategorii {spec.label.toLowerCase()} najdete
          </h2>
          <ul className="mb-10 space-y-2">
            {spec.subcategories.map((sub) => (
              <li key={sub} className="flex items-start gap-3 text-slate">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span>{sub}</span>
              </li>
            ))}
          </ul>

          <div className="mb-16 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CtaButton>Poptat {spec.label.toLowerCase()}</CtaButton>
            <a
              href={siteConfig.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-slate/30 px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-ink transition-all duration-150 hover:border-brand hover:bg-brand/5 active:scale-[0.98]"
            >
              Přejít do e-shopu <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="border-t border-slate/10 pt-10">
            <h2 className="mb-4 font-label-md text-sm uppercase tracking-wider text-slate">
              Další specializace
            </h2>
            <div className="flex flex-wrap gap-3">
              {others.map((o) => (
                <a
                  key={o.id}
                  href={`/${o.id}`}
                  className="border border-slate/20 px-4 py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {o.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </ContactModalProvider>
  );
}

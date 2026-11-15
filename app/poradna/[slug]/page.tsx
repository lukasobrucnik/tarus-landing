import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactModalProvider } from "@/components/ContactModal";
import { CtaButton } from "@/components/CtaButton";
import { ArticleBody } from "@/components/poradna/ArticleBody";
import { ArticleCard } from "@/components/poradna/ArticleCard";
import { NewsletterForm } from "@/components/poradna/NewsletterForm";
import {
  articles,
  formatDate,
  getArticle,
  getArticles,
  kindLabels,
  poradnaConfig,
  readingMinutes,
} from "@/data/poradna";
import { siteConfig, specializations } from "@/data/content";
import { getSectionImages } from "@/lib/getSectionImages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `${siteConfig.url}/poradna/${article.slug}`;
  const image = article.cover?.src ?? "/og-image.png";

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    robots: article.status === "koncept" ? { index: false, follow: true } : undefined,
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      locale: "cs_CZ",
      siteName: siteConfig.name,
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
      authors: [article.author.name],
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const tarusImages = getSectionImages("tarus");
  const navLogoSrc = tarusImages.find((f) => f.includes("bile")) ?? null;
  const footerLogoSrc = tarusImages.find((f) => f.includes("kompletní")) ?? null;

  const url = `${siteConfig.url}/poradna/${article.slug}`;
  const toc = article.body.filter((b) => b.type === "h2");
  const related = getArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);
  const spec = specializations.find((s) => s.id === article.specializationId);
  const videos = article.body.filter((b) => b.type === "video" && b.youtubeId);

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      abstract: article.answer,
      inLanguage: "cs",
      datePublished: article.published,
      dateModified: article.updated ?? article.published,
      mainEntityOfPage: url,
      image: `${siteConfig.url}${article.cover?.src ?? "/og-image.png"}`,
      author: { "@type": "Person", name: article.author.name, jobTitle: article.author.role, worksFor: { "@id": `${siteConfig.url}/#organization` } },
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "TARUS", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: poradnaConfig.name, item: `${siteConfig.url}/poradna` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];
  if (article.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  for (const v of videos) {
    if (v.type !== "video") continue;
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.title,
      description: article.description,
      thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
      uploadDate: article.published,
      embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
    });
  }

  return (
    <ContactModalProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar logoSrc={navLogoSrc} solid />
      <main id="main" className="bg-paper px-5 pb-24 pt-28 md:px-16 md:pb-32 md:pt-36">
        <article className="mx-auto max-w-[760px]">
          {article.status === "koncept" && (
            <p className="mb-8 border border-timber/40 bg-timber/5 px-4 py-3 text-sm text-timber">
              Ukázkový článek — obsah čeká na doplnění a schválení. Stránka se zatím neindexuje.
            </p>
          )}

          <nav aria-label="Drobečková navigace" className="mb-8 font-label-md text-label-md uppercase tracking-wider text-slate">
            <Link href="/" className="hover:text-ink">TARUS</Link>
            <span className="mx-2 text-slate/40" aria-hidden="true">/</span>
            <Link href="/poradna" className="hover:text-ink">Poradna</Link>
          </nav>

          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-label-md text-xs uppercase tracking-[0.14em]">
            <span className="text-brand-deep">{kindLabels[article.kind]}</span>
            <span className="text-slate/40" aria-hidden="true">/</span>
            <span className="text-slate">{readingMinutes(article)} min čtení</span>
          </div>

          <h1
            className="mb-8 font-display-lg text-3xl font-extrabold leading-[1.12] tracking-tight text-ink md:text-5xl"
            style={{ textWrap: "balance" }}
          >
            {article.title}
          </h1>

          {/* Answer-first: the self-contained paragraph search engines and
              AI assistants quote. Keep it the first content after the H1. */}
          <div className="mb-8 border-l-2 border-brand bg-paper-dim px-6 py-5">
            <p className="mb-2 font-label-md text-label-md uppercase tracking-wider text-brand-deep">Krátká odpověď</p>
            <p className="text-lg leading-relaxed text-ink" style={{ textWrap: "pretty" }}>
              {article.answer}
            </p>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate/10 pb-6 text-sm text-slate">
            <span>
              <span className="font-semibold text-ink">{article.author.name}</span>, {article.author.role}
            </span>
            <span>
              {article.updated ? "Aktualizováno " : "Publikováno "}
              <time dateTime={article.updated ?? article.published}>{formatDate(article.updated ?? article.published)}</time>
            </span>
          </div>

          {toc.length > 2 && (
            <nav aria-label="Obsah článku" className="mb-4">
              <p className="mb-3 font-label-md text-label-md uppercase tracking-wider text-slate">V článku</p>
              <ol className="space-y-1.5">
                {toc.map((h) =>
                  h.type === "h2" ? (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-ink underline decoration-slate/30 underline-offset-4 hover:decoration-brand">
                        {h.text}
                      </a>
                    </li>
                  ) : null
                )}
              </ol>
            </nav>
          )}

          <ArticleBody blocks={article.body} slug={article.slug} />

          {article.faq && article.faq.length > 0 && (
            <section className="mt-16" aria-labelledby="faq">
              <h2 id="faq" className="mb-4 font-display-lg text-2xl font-bold text-ink md:text-3xl">
                Časté dotazy
              </h2>
              <div className="border-t border-slate/15">
                {article.faq.map((f) => (
                  <details key={f.q} className="group border-b border-slate/15">
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="shrink-0 text-xl text-brand-deep transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="pb-5 leading-relaxed text-slate">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 flex flex-col gap-6 border border-slate/15 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <h2 className="mb-1 font-display-lg text-xl font-bold text-ink">Řešíte konkrétní stavbu?</h2>
              <p className="text-slate">
                Pošlete nám skladbu nebo výkres, doporučíme materiál a připravíme nabídku.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <CtaButton>Poradit se</CtaButton>
              {spec && (
                <a
                  href={`/${spec.id}`}
                  className="inline-flex min-h-[44px] items-center justify-center border border-slate/30 px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-ink hover:border-brand"
                >
                  {spec.label}
                </a>
              )}
            </div>
          </section>
        </article>

        <div className="mx-auto mt-20 max-w-[1100px]">
          {related.length > 0 && (
            <section className="mb-16" aria-labelledby="related">
              <h2 id="related" className="mb-6 font-display-lg text-2xl font-bold text-ink">
                Další z Poradny
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          )}
          <NewsletterForm source={`článek: ${article.slug}`} />
        </div>
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </ContactModalProvider>
  );
}

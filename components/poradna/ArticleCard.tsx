import Link from "next/link";
import { type Article, formatDate, kindLabels, readingMinutes } from "@/data/poradna";
import { cn } from "@/lib/utils";

// Text-first card: most articles won't have a cover photo at launch, and a
// grid of empty grey boxes looks worse than none. The kind label + title
// carry the card; the cover is an optional extra.
export function ArticleCard({
  article,
  tone = "light",
}: {
  article: Article;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={`/poradna/${article.slug}`}
      className={cn(
        "group flex h-full flex-col border p-6 transition-colors md:p-8",
        dark
          ? "border-paper/15 hover:border-brand"
          : "border-slate/15 bg-paper hover:border-brand"
      )}
    >
      <div className="mb-5 flex items-center gap-3 font-label-md text-xs uppercase tracking-[0.14em]">
        <span className={dark ? "text-brand" : "text-brand-deep"}>{kindLabels[article.kind]}</span>
        <span className={dark ? "text-paper/40" : "text-slate/50"} aria-hidden="true">
          /
        </span>
        <span className={dark ? "text-paper/60" : "text-slate"}>{readingMinutes(article)} min čtení</span>
      </div>
      <h3
        className={cn(
          "mb-4 font-display-lg text-xl font-bold leading-snug md:text-2xl",
          dark ? "text-paper" : "text-ink"
        )}
        style={{ textWrap: "balance" }}
      >
        {article.title}
      </h3>
      <p
        className={cn("mb-6 line-clamp-3 text-sm leading-relaxed md:text-base", dark ? "text-paper/65" : "text-slate")}
      >
        {article.answer}
      </p>
      <div
        className={cn(
          "mt-auto flex items-center justify-between font-label-md text-label-md uppercase tracking-wider",
          dark ? "text-paper/60" : "text-slate"
        )}
      >
        <time dateTime={article.published}>{formatDate(article.published)}</time>
        <span
          className={cn(
            "transition-transform group-hover:translate-x-1",
            dark ? "text-paper" : "text-ink"
          )}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}

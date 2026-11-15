import Link from "next/link";
import { ArticleCard } from "@/components/mediazona/ArticleCard";
import { getArticles } from "@/data/mediazona";

// Compact homepage strip — a doorway into /mediazona, not a second blog index.
// Shows the newest articles only; hidden entirely if there are none yet.
export function MediazonaTeaser() {
  const latest = getArticles().slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section id="mediazona" className="bg-ink px-5 py-16 text-paper md:px-16 md:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-3 font-display-lg text-3xl font-extrabold leading-tight md:text-5xl">Mediazóna</h2>
            <p className="text-paper/65 md:text-lg" style={{ textWrap: "pretty" }}>
              Nechte si poradit s výběrem od profesionálů z praxe. Návody, recenze a porovnání materiálů i
              nejnovější novinky z TARUS.
            </p>
          </div>
          <Link
            href="/mediazona"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 font-label-md text-label-md uppercase tracking-wider text-paper/80 transition-colors hover:text-brand"
          >
            Všechny články <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={`grid gap-4 ${latest.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} tone="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}

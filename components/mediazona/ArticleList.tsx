"use client";

import * as React from "react";
import { ArticleCard } from "@/components/mediazona/ArticleCard";
import { type Article, type ArticleKind, kindFilterLabels } from "@/data/mediazona";
import { cn } from "@/lib/utils";
import { LIST_URL_KEY } from "@/components/mediazona/BackLink";

// Remembers the list URL (incl. ?stitek=) so "Zpět do Mediazóny" on an
// article returns to the same filtered view.
function rememberListUrl() {
  try {
    sessionStorage.setItem(LIST_URL_KEY, window.location.pathname + window.location.search);
  } catch {
    // storage blocked — back link falls back to /mediazona
  }
}

const KINDS = Object.keys(kindFilterLabels) as ArticleKind[];

// Client-side tag filter. The selected tag is mirrored into ?stitek= so a
// filtered view can be shared or bookmarked; all articles stay in the
// server-rendered HTML for crawlers regardless of the filter.
export function ArticleList({ articles }: { articles: Article[] }) {
  const [active, setActive] = React.useState<ArticleKind | null>(null);

  React.useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("stitek");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from URL on mount
    if (tag && (KINDS as string[]).includes(tag)) setActive(tag as ArticleKind);
    rememberListUrl();
  }, []);

  function select(kind: ArticleKind | null) {
    setActive(kind);
    const url = new URL(window.location.href);
    if (kind) url.searchParams.set("stitek", kind);
    else url.searchParams.delete("stitek");
    window.history.replaceState(null, "", url);
    rememberListUrl();
  }

  const visible = active ? articles.filter((a) => a.kind === active) : articles;
  const count = (k: ArticleKind) => articles.filter((a) => a.kind === k).length;

  const chip = (selected: boolean) =>
    cn(
      "inline-flex min-h-[40px] items-center gap-2 border px-4 font-label-md text-label-md uppercase tracking-wider transition-colors",
      selected ? "border-ink bg-ink text-paper" : "border-slate/20 text-slate hover:border-ink hover:text-ink"
    );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrovat podle štítku">
        <button type="button" aria-pressed={active === null} onClick={() => select(null)} className={chip(active === null)}>
          Vše
          <span className="opacity-50">{articles.length}</span>
        </button>
        {KINDS.map((k) => (
          <button key={k} type="button" aria-pressed={active === k} onClick={() => select(k)} className={chip(active === k)}>
            {kindFilterLabels[k]}
            <span className="opacity-50">{count(k)}</span>
          </button>
        ))}
      </div>

      <div className="mb-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </>
  );
}

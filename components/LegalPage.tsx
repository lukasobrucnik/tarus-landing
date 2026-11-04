import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-32 md:px-16">
      <Link
        href="/"
        aria-label="Zavřít a vrátit se na web"
        className="fixed right-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center border border-ink/15 bg-paper text-ink shadow-sm transition-colors hover:border-ink/40 hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep md:right-8 md:top-8"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </Link>
      <h1 className="mb-2 font-display-lg text-3xl font-extrabold md:text-5xl">{title}</h1>
      <p className="mb-10 text-sm text-slate/70">Účinné od {updated}</p>
      <div className="space-y-4 font-body-lg leading-relaxed text-slate [&_h2]:mt-10 [&_h2]:font-display-lg [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:text-brand-deep [&_a]:underline [&_a:hover]:text-brand">
        {children}
      </div>
      <Link href="/" className="mt-12 inline-block text-sm text-slate underline hover:text-ink">
        ← Zpět na hlavní stránku
      </Link>
    </main>
  );
}

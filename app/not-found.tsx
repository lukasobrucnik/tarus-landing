import Link from "next/link";
import { specializations } from "@/data/content";

export const metadata = {
  title: "Stránka nenalezena",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-paper px-5 py-24 text-center">
      <p className="mb-3 font-label-md text-label-md uppercase tracking-widest text-brand-deep">
        Chyba 404
      </p>
      <h1
        className="mb-6 max-w-xl font-display-lg text-4xl font-extrabold leading-tight text-ink md:text-6xl"
        style={{ textWrap: "balance" }}
      >
        Tahle stránka neexistuje
      </h1>
      <p className="mb-10 max-w-md font-body-lg text-slate" style={{ textWrap: "pretty" }}>
        Odkaz je nejspíš zastaralý nebo obsahuje překlep. Zkuste hlavní
        stránku, nebo rovnou jednu z našich specializací.
      </p>
      <Link
        href="/"
        className="mb-10 inline-flex min-h-[44px] items-center justify-center bg-brand px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-ink transition-colors hover:bg-brand-deep"
      >
        Zpět na hlavní stránku
      </Link>
      <div className="flex flex-wrap justify-center gap-3">
        {specializations.map((spec) => (
          <Link
            key={spec.id}
            href={`/${spec.id}`}
            className="border border-slate/20 px-4 py-2 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
          >
            {spec.label}
          </Link>
        ))}
      </div>
    </main>
  );
}

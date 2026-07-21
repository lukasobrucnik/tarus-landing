"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-paper px-5 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-center"
      >
        <p className="mb-3 font-label-md text-label-md uppercase tracking-widest text-brand-deep">
          Něco se pokazilo
        </p>
        <h1
          className="mb-6 max-w-xl font-display-lg text-4xl font-extrabold leading-tight text-ink md:text-6xl"
          style={{ textWrap: "balance" }}
        >
          Stránku se nepodařilo načíst
        </h1>
        <p className="mb-10 max-w-md font-body-lg text-slate" style={{ textWrap: "pretty" }}>
          Omlouváme se, došlo k neočekávané chybě. Zkuste to prosím znovu,
          nebo se vraťte na hlavní stránku.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center bg-brand px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-ink transition-colors hover:bg-brand-deep"
          >
            Zkusit znovu
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center border border-slate/20 px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

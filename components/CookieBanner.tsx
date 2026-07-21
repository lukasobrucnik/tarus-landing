"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "tarus-cookie-consent";
const EASE = [0.22, 1, 0.36, 1] as const;

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it never competes with LoadingScreen/hero entrance.
      const t = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(t);
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Nastavení cookies"
          className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:px-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="flex w-full max-w-sm flex-col gap-3 border border-white/10 bg-ink px-5 py-4 text-paper shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="text-sm leading-relaxed text-paper/70">
              Používáme pouze technické cookies nezbytné pro chod webu. Žádná
              data nesdílíme s třetími stranami.{" "}
              <Link href="/privacy" className="text-paper/90 underline underline-offset-2 hover:text-brand">
                Více informací
              </Link>
              .
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="min-h-[36px] flex-1 bg-brand px-4 text-sm font-medium text-ink transition-colors hover:bg-brand-deep"
              >
                Rozumím
              </button>
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="min-h-[36px] px-3 text-sm text-paper/50 transition-colors hover:text-paper/80"
              >
                Odmítnout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

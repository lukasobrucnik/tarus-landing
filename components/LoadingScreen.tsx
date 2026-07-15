"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Shown once per real page load (mounted in the root layout, so client-side
// navigations between pages sharing that layout never re-trigger it).
//
// Purpose: on a slow connection the page can sit half-rendered (missing
// fonts/images/video poster) for a couple of seconds — this covers that
// gap with an on-brand screen instead of a flash of broken layout.
//
// The progress bar always completes at least one full 0→100% lap before the
// screen is allowed to close — MIN_VISIBLE_MS is set just past one lap
// duration so it's never cut off mid-fill (would look broken/unfinished).
// SAFETY_TIMEOUT_MS guarantees it never blocks the site indefinitely if the
// load event is ever delayed.
const LAP_MS = 900;
const MIN_VISIBLE_MS = LAP_MS + 150;
const SAFETY_TIMEOUT_MS = 4500;

export function LoadingScreen({ logoSrc }: { logoSrc?: string | null }) {
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const start = performance.now();
    let settled = false;

    function reveal() {
      if (settled) return;
      settled = true;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setReady(true), remaining);
    }

    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
    }
    const safety = window.setTimeout(reveal, SAFETY_TIMEOUT_MS);

    return () => {
      window.removeEventListener("load", reveal);
      window.clearTimeout(safety);
    };
  }, []);

  // Lock scroll only while the overlay is actually covering the page.
  useEffect(() => {
    if (ready) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ready]);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {!ready && (
        <motion.div
          key="loading-screen"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-ink"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-8">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <motion.img
                src={logoSrc}
                alt="TARUS"
                className="h-10 w-auto object-contain md:h-12"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0, 1, 1, 0.9, 1], scale: 1 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.3 }
                    : { duration: 2.2, times: [0, 0.25, 0.6, 0.8, 1], repeat: Infinity, ease: "easeInOut" }
                }
              />
            ) : (
              <span className="font-display-lg text-2xl font-extrabold uppercase tracking-[0.15em] text-paper md:text-3xl">
                TARUS
              </span>
            )}

            <div className="h-[3px] w-36 overflow-hidden rounded-full bg-paper/10">
              {prefersReducedMotion ? (
                <div className="h-full w-full rounded-full bg-brand/40" />
              ) : (
                <motion.div
                  className="h-full origin-left rounded-full bg-brand"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  transition={{
                    duration: LAP_MS / 1000,
                    times: [0, 0.75, 0.85, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
          </div>
          <span className="sr-only">Načítání stránky…</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/data/content";
import { CtaButton } from "@/components/CtaButton";
import { cn } from "@/lib/utils";

export function Navbar({ logoSrc }: { logoSrc?: string | null }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full border-b border-slate/0 transition-all duration-300",
        scrolled
          ? "border-slate/20 bg-ink/95 py-2 backdrop-blur-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-16">
        <a
          href="#hero"
          aria-label="TARUS — domů"
          className="flex items-center"
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt="TARUS"
              className="h-6 w-auto object-contain -translate-y-0.5"
            />
          ) : (
            <span className="font-display-lg text-xl font-bold text-paper">TARUS</span>
          )}
        </a>

        <div className="hidden items-center gap-12 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label-md text-label-md uppercase tracking-wider text-paper transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
          <a
            href={siteConfig.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-md text-label-md uppercase tracking-wider text-paper/50 transition-colors hover:text-paper/80"
          >
            E-shop <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <CtaButton className="!px-6 !py-3 !text-xs" />
          </div>

          {/* Mobile compact CTA — appears when scrolled past hero, hides when menu opens */}
          {scrolled && !mobileOpen && (
            <div className="md:hidden">
              <CtaButton className="!px-4 !py-2 !text-xs" />
            </div>
          )}

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-paper md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 border-t border-slate/20 bg-ink px-5 py-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-label-md text-sm uppercase tracking-wider text-paper transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
            <a
              href={siteConfig.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 font-label-md text-sm uppercase tracking-wider text-paper/50 hover:text-paper/80"
            >
              E-shop <span aria-hidden="true">↗</span>
            </a>
            <CtaButton className="mt-3 w-full justify-center" />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

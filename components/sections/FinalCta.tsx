"use client";

import { motion } from "framer-motion";
import { CtaButton } from "@/components/CtaButton";
import { siteConfig } from "@/data/content";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 pt-24 pb-16 text-center text-paper md:px-16 md:pt-32 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(var(--color-brand) 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      {/* Soft brand glow behind the heading — depth without glassmorphism */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(0,167,231,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <h2 className="mb-6 font-display-lg text-3xl font-extrabold md:text-5xl" style={{ textWrap: "balance" }}>
          Potřebujete materiál na čas. My to zajistíme.
        </h2>
        <p className="mb-10 font-body-lg text-paper/60" style={{ textWrap: "pretty" }}>
          Kompletní materiálový servis od spojovacích prvků, funkčních
          membrán až po certifikovaná systémová řešení. Doručení do 24
          hodin, technická podpora od odborníků z terénu a v neposlední
          řadě stabilní cenová politika. Řekněte nám, co stavíte.
        </p>
        {/* Primary + secondary CTA: row on desktop, column on mobile */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CtaButton className="!px-12 !py-5" />
          <a
            href={siteConfig.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-paper/25 px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-paper/80 transition-all duration-150 hover:border-paper/50 hover:bg-paper/5 hover:text-paper active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
          >
            Přejít do e-shopu <span aria-hidden="true">↗</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

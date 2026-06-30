"use client";

import { motion } from "framer-motion";
import { CtaButton } from "@/components/CtaButton";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-24 text-center text-paper md:px-16 md:py-32">
      <div className="absolute left-0 top-0 h-1 w-full bg-brand" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(var(--color-brand) 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
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
        <h2 className="mb-6 font-display-lg text-3xl font-bold md:text-5xl" style={{ textWrap: "balance" }}>
          Potřebujete materiál na čas. My to zajistíme.
        </h2>
        <p className="mb-10 font-body-lg text-paper/60" style={{ textWrap: "pretty" }}>
          Kompletní materiálový servis od statiky po poslední šroub, expedice
          do 24 hodin, technická podpora od odborníků z terénu. Řekněte nám,
          co stavíte.
        </p>
        <CtaButton className="!px-12 !py-5" />
      </motion.div>
    </section>
  );
}

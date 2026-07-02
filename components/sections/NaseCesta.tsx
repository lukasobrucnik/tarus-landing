"use client";

import { motion } from "framer-motion";
import { milestones } from "@/data/content";

export function NaseCesta() {
  return (
    <section id="nase-cesta" className="overflow-hidden border-y border-slate/10 bg-paper-dim px-5 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-20 text-center">
          <h2 className="font-display-lg text-3xl font-extrabold md:text-5xl" style={{ textWrap: "balance" }}>Naše cesta</h2>
        </div>

        <div className="relative grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-7 md:gap-8">
          <div
            className="absolute left-0 top-12 hidden h-px w-full bg-slate/20 lg:block"
            aria-hidden="true"
          />

          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <div
                className={`mb-8 flex h-24 w-24 items-center justify-center border-4 border-paper-dim font-display-lg text-2xl font-bold shadow-lg ${
                  m.highlighted ? "bg-brand text-ink" : "bg-ink text-paper"
                }`}
              >
                {m.year}
              </div>
              <h3 className="mb-3 font-display-lg text-lg font-bold">{m.title}</h3>
              <p className="text-sm leading-relaxed text-slate">{m.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { whyTarusCards } from "@/data/content";

export function WhyTarus({ wordmarkSrc }: { wordmarkSrc?: string | null }) {
  return (
    <section id="proc-my" className="overflow-x-hidden bg-paper px-5 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        {/* Section header: asymmetric 2-col, H2 now visible and large */}
        <div className="mb-16 grid grid-cols-1 items-start gap-10 border-b border-slate/10 pb-16 md:mb-20 md:grid-cols-2">
          <h2
            className="font-display-lg text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-6xl"
            style={{ textWrap: "balance" }}
          >
            Proč firmy objednávají právě u{" "}
            {wordmarkSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wordmarkSrc}
                alt="TARUS"
                className="inline-block h-[0.75em] w-auto object-contain align-middle"
              />
            ) : (
              <span>TARUS</span>
            )}
          </h2>
          <p
            className="text-base leading-relaxed text-slate md:text-lg"
            style={{ textWrap: "pretty" }}
          >
            Jsme distributor materiálů, který staví na rychlosti, dostupnosti
            a praxi. Materiál držíme skladem v centrálním skladu, dodáváme ho
            jako jednu kompletní zásilku a doručujeme na stavbu do 24 hodin.
            Nabízíme stabilní cenovou politiku, více než 20 značek v portfoliu
            a technickou podporu od odborníků z terénu. Naše služby dlouhodobě
            využívají stovky realizačních firem po celé ČR.
          </p>
        </div>

        {/* Editorial stat list — no cards, numbers hang left like a spec sheet */}
        <div>
          {whyTarusCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group grid grid-cols-[7.5rem_1fr] items-baseline gap-6 border-b border-slate/10 py-8 md:grid-cols-[13rem_1fr] md:gap-12 md:py-10"
            >
              <span className="whitespace-nowrap font-display-lg text-5xl font-extrabold leading-none tracking-tight text-timber transition-colors duration-300 group-hover:text-brand-deep md:text-6xl">
                {card.value}
              </span>
              <div>
                <h3 className="mb-1 font-display-lg text-xl font-bold text-ink">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed text-slate">
                  {card.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

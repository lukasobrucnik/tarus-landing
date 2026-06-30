"use client";

import { motion } from "framer-motion";
import { whyTarusCards } from "@/data/content";

export function WhyTarus() {
  return (
    <section id="proc-my" className="bg-paper px-5 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        {/* Section header: asymmetric 2-col, H2 now visible and large */}
        <div className="mb-16 grid grid-cols-1 items-end gap-10 border-b border-slate/10 pb-16 md:mb-20 md:grid-cols-2">
          <h2
            className="font-display-lg text-6xl font-extrabold leading-none tracking-tight text-ink md:text-8xl"
            style={{ textWrap: "balance" }}
          >
            Proč<br />TARUS
          </h2>
          <p
            className="max-w-sm text-lg leading-relaxed text-slate md:text-xl"
            style={{ textWrap: "pretty" }}
          >
            Neříkáme jen, že jsme rychlí a spolehliví. Garantujeme to —
            a tisíce realizací nás potvrzují.
          </p>
        </div>

        {/* Editorial stat list — no cards, numbers hang left like a spec sheet */}
        <div>
          {whyTarusCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid items-baseline gap-6 border-b border-slate/10 py-8 md:gap-12 md:py-10"
              style={{ gridTemplateColumns: "auto 1fr" }}
            >
              <span className="font-display-lg text-5xl font-extrabold leading-none text-timber md:text-6xl">
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

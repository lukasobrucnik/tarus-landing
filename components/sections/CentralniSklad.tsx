"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Placeholder } from "@/components/ui/Placeholder";
import { CtaButton } from "@/components/CtaButton";
import { cn } from "@/lib/utils";

const benefits = [
  "Doručení na stavbu do 24 hodin",
  "Centrální sklad v Olomouci",
  "Distribuce po celé České republice",
  "Kompletní objednávka na jedné paletě",
] as const;

export function CentralniSklad({ images = [] }: { images?: string[] }) {
  return (
    <section
      id="sklad"
      className="overflow-hidden bg-paper py-24 md:py-32"
      aria-label="Centrální sklad"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">

          {/* Left col: two stacked photos */}
          <div className="flex flex-col gap-3 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[300px] overflow-hidden sm:h-[380px] lg:h-[430px]"
            >
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt="Centrální sklad TARUS — Olomouc"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <Placeholder
                  alt="Centrální sklad TARUS — exteriér"
                  variant={1}
                  className="h-full w-full"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[180px] overflow-hidden lg:h-[210px]"
            >
              {images[1] ? (
                <Image
                  src={images[1]}
                  alt="Interiér skladu TARUS"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <Placeholder
                  alt="Centrální sklad TARUS — interiér"
                  variant={2}
                  className="h-full w-full"
                />
              )}
            </motion.div>
          </div>

          {/* Right col: text + benefits + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center lg:col-span-5"
          >
            <h2
              className="mb-6 font-display-lg text-3xl font-extrabold leading-tight md:text-5xl"
              style={{ textWrap: "balance" }}
            >
              Náš centrální sklad
            </h2>

            <p
              className="mb-5 font-body-lg leading-relaxed text-slate"
              style={{ textWrap: "pretty" }}
            >
              Veškeré zboží expedujeme z našeho centrálního skladu v Olomouci.
              Díky vysoké skladové dostupnosti a vlastní logistice doručujeme
              materiál zákazníkům po celé České republice do 24 hodin.
            </p>
            <p
              className="mb-10 font-body-lg leading-relaxed text-slate"
              style={{ textWrap: "pretty" }}
            >
              Kompletní objednávky připravujeme tak, aby materiál přijel na
              stavbu pohromadě bez zbytečného rozdělování do několika zásilek.
            </p>

            {/* Benefit list */}
            <ul className="mb-10 space-y-3 border-t border-slate/10 pt-8">
              {benefits.map((b, i) => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className="mt-px flex-shrink-0 font-bold text-brand"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className={cn(
                    "text-sm leading-relaxed",
                    i === 0 ? "font-semibold text-ink" : "text-slate"
                  )}>{b}</span>
                </li>
              ))}
            </ul>

            {/* Secondary CTA — opens Contact Modal */}
            <div>
              <CtaButton variant="outline">Poptat materiál</CtaButton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

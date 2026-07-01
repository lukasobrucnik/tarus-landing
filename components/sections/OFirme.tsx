"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { aboutParagraphs } from "@/data/content";
import { Placeholder } from "@/components/ui/Placeholder";

export function OFirme({ images = [] }: { images?: string[] }) {
  return (
    <section id="o-nas" className="bg-paper px-5 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="md:pr-8"
        >
          <h2
            className="mb-6 font-display-lg text-3xl font-extrabold leading-tight md:text-5xl"
            style={{ textWrap: "balance" }}
          >
            Odbornost postavená na reálných základech
          </h2>
          <div className="space-y-5 font-body-lg text-slate" style={{ textWrap: "pretty" }}>
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        <div className="relative h-[420px] md:h-[600px]">
          {images[0] ? (
            <Image
              src={images[0]}
              alt="Tým TARUS na stavbě"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <Placeholder alt="tým TARUS na stavbě — placeholder" variant={2} className="h-full w-full" />
          )}
        </div>
      </div>
    </section>
  );
}

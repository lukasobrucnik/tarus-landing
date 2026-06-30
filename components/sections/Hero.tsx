"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/content";
import { CtaButton } from "@/components/CtaButton";
import { Placeholder } from "@/components/ui/Placeholder";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero({ images = [] }: { images?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // max 8% zoom — subtle, scroll-linked parallax (respects reduced-motion
  // via Framer Motion's automatic prefers-reduced-motion handling)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex h-screen w-full flex-col justify-end overflow-hidden bg-ink"
      aria-label="Úvod"
    >
      <motion.div className="absolute inset-0 z-0" style={{ scale, willChange: "transform" }}>
        {images[0] ? (
          <Image
            src={images[0]}
            alt="TARUS — realizace dřevěné konstrukce"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <Placeholder
            alt="fotka realizace krovu/dřevostavby"
            className="absolute inset-0 h-full w-full"
            showTag={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-16"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
      >
        <motion.span
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 inline-block font-label-md text-label-md uppercase tracking-widest text-brand"
        >
          {siteConfig.tagline}
        </motion.span>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 max-w-4xl font-display-lg text-[3rem] font-extrabold leading-[1.02] tracking-tight text-paper md:text-[5.5rem]"
          style={{ textWrap: "balance" }}
        >
          Stavíte rychle.{" "}
          <span className="text-brand">My dodáváme ještě rychleji.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-xl font-body-lg text-base text-paper/70 md:text-lg"
          style={{ textWrap: "pretty" }}
        >
          Jsme technickým partnerem pro realizační firmy. Zajišťujeme
          kompletní materiálový servis od statiky po poslední šroub, s
          garancí expedice do 24 hodin.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-4"
        >
          <CtaButton />
          {/* Secondary: instant tel: access + outcome hint for CTA above */}
          <a
            href={siteConfig.phoneHref}
            className="group inline-flex items-baseline gap-1.5 text-sm text-paper/50 transition-colors hover:text-paper/80"
          >
            nebo zavolejte přímo:
            <span className="font-medium text-paper/70 transition-colors group-hover:text-paper">
              {siteConfig.phone}
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

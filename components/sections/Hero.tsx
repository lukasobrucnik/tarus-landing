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
      {/*
        Top vignette — navbar readability on bright Hero images.
        Lives OUTSIDE the parallax motion.div (z-0) so it does not scale or
        shift with the image. Sits at z-[1] — above image, below text content.
        ~30 % black fading to transparent over 160 px; imperceptible on dark
        images, just enough contrast on bright ones.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[260px] bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />

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
          className="mb-8 max-w-4xl font-display-lg text-[3rem] font-extrabold leading-[1.06] tracking-tight text-paper md:text-[5.5rem] md:leading-[1.02]"
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
          {/* Primary + secondary CTA: row on desktop, column on mobile */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CtaButton />
            <a
              href={siteConfig.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-paper/25 px-8 py-4 font-label-md text-label-md uppercase tracking-wider text-paper/55 transition-all duration-150 hover:border-paper/50 hover:bg-paper/5 hover:text-paper active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
            >
              Přejít do e-shopu <span aria-hidden="true">↗</span>
            </a>
          </div>
          {/* Tel: fallback — instant access, below button row */}
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

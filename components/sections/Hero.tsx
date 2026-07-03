"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { siteConfig } from "@/data/content";
import { CtaButton } from "@/components/CtaButton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero({ images = [] }: { images?: string[] }) {
  // images prop kept for API compatibility — video is now the background
  void images;

  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle scroll-linked parallax — same as before
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Pause the background video when the user prefers reduced motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {
        // autoplay blocked (e.g. browser policy) — video stays paused, bg-ink shows
      });
    }
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex h-screen w-full flex-col justify-end overflow-hidden bg-ink"
      aria-label="Úvod"
    >
      {/*
        Top vignette — navbar readability over video.
        Sits at z-[1], above the parallax div (z-0) but below text (z-10).
        ~70% black fading to transparent over 260px.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[260px] bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />

      {/* Parallax wrapper — same 8% scale on scroll as before */}
      <motion.div className="absolute inset-0 z-0" style={{ scale, willChange: "transform" }}>
        {/* Background video: autoplay, loop, muted (required for autoplay), playsInline (iOS) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/images/hero/tarus-hero.mp4" type="video/mp4" />
        </video>

        {/* Bottom gradient overlay — identical to the image version */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </motion.div>

      {/* Text + CTAs */}
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
          style={{
            textWrap: "balance",
            textShadow:
              "0 0 2px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8), 0 4px 32px rgba(0,0,0,0.7), 0 8px 60px rgba(0,0,0,0.5)",
          }}
        >
          Český výrobce a distributor pro{" "}
          <span className="text-brand">dřevostavby, roubenky a šikmé střechy.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-xl font-body-lg text-base text-paper/70 md:text-lg"
          style={{ textWrap: "pretty" }}
        >
          Jsme technickým partnerem realizačních firem. Dodáváme kompletní
          materiál pro dřevostavby a střechy od konstrukčního kování až po
          poslední vrut. Na stavbu vám zboží doručíme do 24 hodin.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-4"
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}

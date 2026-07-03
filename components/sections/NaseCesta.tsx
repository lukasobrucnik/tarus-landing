"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { milestones } from "@/data/content";
import { cn } from "@/lib/utils";
import type { MotionValue } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring" as const, damping: 32, stiffness: 380, mass: 0.85 };
const N = milestones.length;

// ── Ghost-year count-up ──────────────────────────────────────────────────────
// When the row enters the viewport, ticks (yearTarget - 4) → yearTarget in ~300ms.
// Fires once, delay-matched to the ghost year's fade-in so the count plays while
// the number is still translucent.
function useYearCountUp(
  yearTarget: number,
  startDelay: number // seconds — matches ghost fade-in delay
) {
  const [display, setDisplay] = useState(yearTarget - 4);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let rafId: number;
    let timerId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        timerId = setTimeout(() => {
          const from = yearTarget - 4;
          const t0 = performance.now();
          const dur = 300;

          function tick(now: number) {
            const t = Math.min((now - t0) / dur, 1);
            const eased = 1 - (1 - t) * (1 - t); // ease-out-quad
            setDisplay(Math.round(from + (yearTarget - from) * eased));
            if (t < 1) rafId = requestAnimationFrame(tick);
          }

          rafId = requestAnimationFrame(tick);
        }, startDelay * 1000);
      },
      { threshold: 0.05, rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [yearTarget, startDelay]);

  return { display, spanRef };
}

// ── Per-milestone ghost year ─────────────────────────────────────────────────
interface GhostYearProps {
  m: (typeof milestones)[number];
  delay: number;
}

function GhostYear({ m, delay }: GhostYearProps) {
  const yearNum = parseInt(m.year);
  const isNumeric = !isNaN(yearNum);

  // Always call the hook; for non-numeric years yearNum falls back to 0 and we
  // never attach the ref, so the side-effect is harmless.
  const { display, spanRef } = useYearCountUp(isNumeric ? yearNum : 0, delay + 0.42);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: delay + 0.42, ease: EASE }}
      className="pointer-events-none absolute inset-y-0 right-0 flex items-center"
      aria-hidden="true"
    >
      <span
        ref={isNumeric ? spanRef : undefined}
        className={cn(
          "select-none font-display-lg text-[5.5rem] font-extrabold leading-none tracking-tight transition-[color] duration-500 md:text-[8rem]",
          m.highlighted
            ? "text-brand/[0.07] group-hover:text-brand/[0.115]"
            : "text-ink/[0.04] group-hover:text-ink/[0.068]"
        )}
      >
        {isNumeric ? display : m.year}
      </span>
    </motion.div>
  );
}

// ── Milestone row ────────────────────────────────────────────────────────────
interface MilestoneItemProps {
  m: (typeof milestones)[number];
  i: number;
  isLast: boolean;
  scrollYProgress: MotionValue<number>;
}

function MilestoneItem({ m, i, isLast, scrollYProgress }: MilestoneItemProps) {
  const delay = i * 0.055;

  // Scroll-synchronized dot: activates as the spine fill reaches this row
  const activationStart = (i / (N - 1)) * 0.86;
  const activationEnd = Math.min(activationStart + 0.08, 1);
  const activation = useTransform(scrollYProgress, [activationStart, activationEnd], [0, 1], {
    clamp: true,
  });

  const dotBorderColor = useTransform(
    activation,
    [0, 1],
    m.highlighted
      ? ["rgba(0,167,231,0.40)", "rgba(0,167,231,0.90)"]
      : ["rgba(73,88,86,0.18)", "rgba(0,167,231,0.58)"]
  );
  const dotInnerBg = useTransform(
    activation,
    [0, 1],
    m.highlighted
      ? ["rgb(0,167,231)", "rgb(0,167,231)"]
      : ["rgba(73,88,86,0.28)", "rgb(0,167,231)"]
  );
  const dotGlowOpacity = useTransform(activation, [0, 1], [0, m.highlighted ? 1 : 0.78]);
  // Tactile scale pulse: compressed → overshoot → settled
  const dotInnerScale = useTransform(activation, [0, 0.55, 1], [0.55, 1.3, 1]);

  // Year label brightens as the spine passes it, then settles slightly brighter
  const yearLabelColor = useTransform(
    activation,
    [0, 0.5, 1],
    m.highlighted
      ? ["rgb(0,167,231)", "rgb(0,167,231)", "rgb(0,167,231)"]
      : ["rgba(16,23,27,0.40)", "rgba(16,23,27,0.76)", "rgba(16,23,27,0.48)"]
  );

  return (
    <div className="group relative overflow-hidden">

      {/* "Již brzy" — ambient brand-glow pulse behind the future milestone */}
      {m.highlighted && (
        <motion.div
          className="pointer-events-none absolute -inset-x-2 -inset-y-3 rounded-2xl"
          animate={{ opacity: [0.22, 0.58, 0.22] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 6% 55%, rgba(0,167,231,0.08) 0%, rgba(0,167,231,0.02) 58%, transparent 80%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Ghost year — count-up animation, hover-reveal */}
      <GhostYear m={m} delay={delay} />

      {/* Dot — spring entry + scroll-synchronized color activation */}
      <div
        className="absolute -left-10 top-0 hidden h-6 w-5 -translate-x-1/2 items-center justify-center md:flex"
        aria-hidden="true"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={SPRING}
          className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
          style={{ borderColor: dotBorderColor }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ opacity: dotGlowOpacity, boxShadow: "0 0 0 4px rgba(0,167,231,0.14)" }}
            aria-hidden="true"
          />
          <motion.div
            className="h-2 w-2 rounded-full"
            style={{ background: dotInnerBg, scale: dotInnerScale }}
          />
        </motion.div>
      </div>

      {/* Year label + rule */}
      <div className="flex h-6 items-center gap-4">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay, ease: EASE }}
          className="shrink-0 font-label-md text-xs font-bold uppercase tracking-[0.18em]"
          style={m.highlighted ? undefined : { color: yearLabelColor }}
        >
          {m.highlighted ? (
            <span className="text-brand">
              {m.year}
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-brand"
                aria-hidden="true"
              />
            </span>
          ) : (
            m.year
          )}
        </motion.span>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: delay + 0.08, ease: EASE }}
          className="h-px flex-1 origin-left"
          style={
            m.highlighted
              ? {
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(0,167,231,0.4) 0px, rgba(0,167,231,0.4) 5px, transparent 5px, transparent 11px)",
                }
              : { backgroundColor: "rgba(73,88,86,0.15)" }
          }
          aria-hidden="true"
        />
      </div>

      {/* Content — y-spring wrapper, title clips in L→R, body clears from blur */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ ...SPRING, delay: delay + 0.18 }}
        whileHover={{ y: -2, transition: { duration: 0.18, ease: EASE } }}
        className={cn(
          "pt-4 md:grid md:grid-cols-[260px_1fr] md:gap-16",
          isLast ? "pb-0" : "pb-9 md:pb-11"
        )}
      >
        {/* Title: clip-path wipe from left — reveals like a stamp being pressed */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.54, delay: delay + 0.27, ease: EASE_EXPO }}
          className="mb-2 md:mb-0"
        >
          <h3
            className={cn(
              "font-display-lg text-xl font-bold leading-snug md:text-2xl",
              m.highlighted ? "text-brand" : "text-ink"
            )}
          >
            {m.title}
          </h3>
        </motion.div>

        {/* Body: blur-to-clear — data materializing, consistent with technical brand */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.62, delay: delay + 0.38, ease: EASE }}
          className="text-sm leading-relaxed text-slate md:text-base"
        >
          {m.text}
        </motion.p>
      </motion.div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────
export function NaseCesta() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 25%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Glow orb: rides the tip of the fill as you scroll
  const glowTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.04, 0.93, 1], [0, 1, 1, 0]);

  return (
    <section
      id="nase-cesta"
      className="overflow-hidden border-y border-slate/10 bg-paper-dim px-5 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-20 font-display-lg text-3xl font-extrabold md:mb-24 md:text-5xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          Naše cesta
        </motion.h2>

        <div ref={containerRef} className="relative">

          {/* ── Vertical spine: faint track + scroll-driven gradient fill ──── */}
          <div
            className="absolute inset-y-0 left-0 hidden w-px overflow-hidden md:block"
            aria-hidden="true"
          >
            <div className="h-full w-full bg-slate/[0.07]" />
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top"
              style={{
                scaleY: lineScaleY,
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(73,88,86,0.4) 15%, rgba(73,88,86,0.5) 62%, rgba(5,129,173,0.55) 85%, rgba(0,167,231,0.75) 100%)",
              }}
            />
          </div>

          {/* ── Spine glow orb — brand dot that rides the fill tip ─────────── */}
          {/* Positioned absolute within containerRef (no overflow-hidden here) */}
          <motion.div
            className="pointer-events-none absolute left-0 hidden md:block"
            style={{ top: glowTop, opacity: glowOpacity, translateY: "-50%" }}
            aria-hidden="true"
          >
            <div className="h-3 w-3 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_16px_8px_rgba(0,167,231,0.36),0_0_4px_2px_rgba(0,167,231,0.82)]" />
          </motion.div>

          {/* ── Milestone rows ──────────────────────────────────────────────── */}
          <div className="md:pl-10">
            {milestones.map((m, i) => (
              <MilestoneItem
                key={m.year}
                m={m}
                i={i}
                isLast={i === milestones.length - 1}
                scrollYProgress={scrollYProgress}
              />
            ))}

            {/* Closing rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.04, ease: EASE }}
              className="h-px w-full origin-left bg-slate/15"
              aria-hidden="true"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

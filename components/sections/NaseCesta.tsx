"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { milestones } from "@/data/content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
// Emil Kowalski: tight spring, subtle displacement, no bounce
const SPRING = { type: "spring" as const, damping: 32, stiffness: 380, mass: 0.85 };

// Double-ring dot node — outer border ring + inner filled circle + optional glow
function TimelineDot({ highlighted }: { highlighted?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={SPRING}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
        highlighted
          ? "border-brand/50 shadow-[0_0_0_4px_rgba(0,167,231,0.09)]"
          : "border-slate/25"
      )}
    >
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          highlighted ? "bg-brand" : "bg-ink/30"
        )}
      />
    </motion.div>
  );
}

export function NaseCesta() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven spine: maps scroll progress to scaleY 0→1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 25%"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
          style={{ textWrap: "balance" }}
        >
          Naše cesta
        </motion.h2>

        {/* Timeline container — spine is anchored to this */}
        <div ref={containerRef} className="relative">

          {/* ── Vertical gradient spine (desktop only) ─────────────────────────
               Track: always visible, very faint
               Fill: scroll-driven scaleY 0→1, gradient neutral→brand           */}
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

          {/* ── Items ──────────────────────────────────────────────────────── */}
          <div className="md:pl-10">
            {milestones.map((m, i) => {
              const isLast = i === milestones.length - 1;
              const delay = i * 0.055;
              // Alternate entrance: even items enter from left, odd from right
              const xFrom = i % 2 === 0 ? -14 : 14;

              return (
                <div key={m.year} className="relative overflow-hidden">

                  {/* Ghost year — background typographic layer.
                      Opacity is deliberately near-invisible (texture, not text).
                      Revealed last in the stagger so it doesn't distract from content. */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1.1, delay: delay + 0.45, ease: EASE }}
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center"
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "select-none font-display-lg text-[5.5rem] font-extrabold leading-none tracking-tight md:text-[8rem]",
                        m.highlighted ? "text-brand/[0.07]" : "text-ink/[0.04]"
                      )}
                    >
                      {m.year}
                    </span>
                  </motion.div>

                  {/* Dot — centred on the spine at left:0 of containerRef
                      -left-10 reverses the md:pl-10 offset; -translate-x-1/2
                      centres the 20px dot on the 1px line.                   */}
                  <div
                    className="absolute -left-10 top-0 hidden h-6 w-5 -translate-x-1/2 items-center justify-center md:flex"
                    aria-hidden="true"
                  >
                    <TimelineDot highlighted={m.highlighted} />
                  </div>

                  {/* Year label + horizontal rule ─────────────────────────── */}
                  <div className="flex h-6 items-center gap-4">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.3, delay, ease: EASE }}
                      className={cn(
                        "shrink-0 font-label-md text-xs font-bold uppercase tracking-[0.18em]",
                        m.highlighted ? "text-brand" : "text-ink/40"
                      )}
                    >
                      {m.year}
                      {/* Live pulse — highlighted / future item only */}
                      {m.highlighted && (
                        <motion.span
                          animate={{ opacity: [1, 0.15, 1] }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5,
                          }}
                          className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-brand"
                          aria-hidden="true"
                        />
                      )}
                    </motion.span>

                    {/* Rule: solid for history, dashed for "Již brzy" */}
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

                  {/* Content — spring entrance from alternating direction ──── */}
                  <motion.div
                    initial={{ opacity: 0, x: xFrom }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ ...SPRING, delay: delay + 0.2 }}
                    className={cn(
                      "pt-4 md:grid md:grid-cols-[260px_1fr] md:gap-16",
                      isLast ? "pb-0" : "pb-9 md:pb-11"
                    )}
                  >
                    <h3
                      className={cn(
                        "mb-2 font-display-lg text-xl font-bold leading-snug md:mb-0 md:text-2xl",
                        m.highlighted ? "text-brand" : "text-ink"
                      )}
                    >
                      {m.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate md:text-base">
                      {m.text}
                    </p>
                  </motion.div>

                </div>
              );
            })}

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

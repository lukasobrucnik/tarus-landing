"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { specializations } from "@/data/content";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

export function Specializace({ images = [] }: { images?: string[] }) {
  const [active, setActive] = React.useState(0);

  return (
    <section
      id="specializace"
      className="overflow-hidden bg-ink px-5 py-24 text-paper md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display-lg text-3xl font-extrabold md:text-5xl" style={{ textWrap: "balance" }}>
            Materiály pro profesionální použití
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Labels — also the interactive control: hover (desktop) or
              click/tap/keyboard (everywhere) switches the active image.
              order-2/lg:order-1: on mobile the image leads (above), labels follow.
              Mobile: compact accordion — headings sit close together, only the
              active one expands its description inline (below it), so tapping
              a later item (e.g. "Nerez") never needs a big scroll to reach it. */}
          <div className="order-2 flex flex-col gap-3 md:gap-4 lg:order-1 lg:gap-10" role="tablist" aria-label="Specializace">
            {specializations.map((spec, i) => {
              const isActive = i === active;
              return (
                <React.Fragment key={spec.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`spec-panel-${spec.id}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group cursor-pointer text-left"
                >
                  <h3
                    className={cn(
                      "font-display-lg text-2xl font-extrabold transition-colors duration-300 sm:text-3xl lg:text-6xl",
                      isActive ? "text-brand" : "text-paper/60"
                    )}
                  >
                    {spec.label}
                  </h3>
                  {/* Underline: full brand on active, dim hint on inactive to signal tappability */}
                  <span
                    className={cn(
                      "mt-1.5 block h-0.5 origin-left transition-all duration-500 ease-out lg:mt-2",
                      isActive ? "w-10 bg-brand opacity-100" : "w-6 bg-paper/20 opacity-100"
                    )}
                    aria-hidden="true"
                  />
                  {/* Mobile/tablet: accordion — description only rendered for the
                      active item, animates open/closed under lg. */}
                  <div className="lg:hidden">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 max-w-md font-body-lg text-paper/60">
                            {spec.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Desktop: full on active, single truncated dim line on inactive —
                      signals each item is interactive on hover.
                      "hidden lg:block" lives on its own wrapper — tailwind-merge
                      treats "hidden" and "line-clamp-1" as the same conflict
                      group (both set `display`) and silently drops "hidden"
                      if they're merged in the same cn() call. */}
                  <div className="hidden lg:block">
                    <p
                      className={cn(
                        "mt-4 max-w-md font-body-lg text-paper/60 transition-all duration-500",
                        isActive
                          ? "max-h-20 opacity-60"
                          : "max-h-6 overflow-hidden opacity-[0.22] line-clamp-1"
                      )}
                    >
                      {spec.description}
                    </p>
                  </div>
                </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Image stack — clip-path mask reveal between variants.
              order-1/lg:order-2: appears above labels on mobile, right column on desktop. */}
          <div className="relative order-1 h-[180px] w-full sm:h-[220px] lg:order-2 lg:h-[600px]">
            {specializations.map((spec, i) => (
              <div
                key={spec.id}
                id={`spec-panel-${spec.id}`}
                role="tabpanel"
                aria-hidden={i !== active}
                className="absolute inset-0 h-full w-full overflow-hidden transition-[clip-path] duration-700"
                style={{
                  clipPath: i === active ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                  transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
                  zIndex: i === active ? 10 : 0,
                }}
              >
                {images[i] ? (
                  <Image
                    src={images[i]}
                    alt={spec.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <Placeholder
                    alt={spec.imageAlt}
                    variant={spec.variant}
                    className="h-full w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

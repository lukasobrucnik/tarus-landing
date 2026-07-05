"use client";

import * as React from "react";
import Image from "next/image";
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
        <div className="mb-16 md:mb-24">
          <h2 className="font-display-lg text-3xl font-extrabold md:text-5xl" style={{ textWrap: "balance" }}>
            Materiály pro profesionální použití
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Labels — also the interactive control: hover (desktop) or
              click/tap/keyboard (everywhere) switches the active image.
              order-2/lg:order-1: on mobile the image leads (above), labels follow. */}
          <div className="order-2 flex flex-col gap-8 md:gap-10 lg:order-1" role="tablist" aria-label="Specializace">
            {specializations.map((spec, i) => {
              const isActive = i === active;
              return (
                <button
                  key={spec.id}
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
                      "font-display-lg text-4xl font-extrabold transition-colors duration-300 md:text-6xl",
                      isActive ? "text-brand" : "text-paper/60"
                    )}
                  >
                    {spec.label}
                  </h3>
                  {/* Underline: full brand on active, dim hint on inactive to signal tappability */}
                  <span
                    className={cn(
                      "mt-2 block h-0.5 origin-left transition-all duration-500 ease-out",
                      isActive ? "w-10 bg-brand opacity-100" : "w-6 bg-paper/20 opacity-100"
                    )}
                    aria-hidden="true"
                  />
                  {/* Description: full on active, single truncated dim line on inactive —
                      gives mobile users a preview that signals each item is interactive */}
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
                </button>
              );
            })}
          </div>

          {/* Image stack — clip-path mask reveal between variants.
              order-1/lg:order-2: appears above labels on mobile, right column on desktop. */}
          <div className="relative order-1 h-[260px] w-full lg:order-2 lg:h-[600px]">
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
        </div>
      </div>
    </section>
  );
}

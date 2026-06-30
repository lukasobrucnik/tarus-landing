"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/content";
import { Placeholder } from "@/components/ui/Placeholder";

export function Realizace({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  function go(delta: 1 | -1) {
    setDirection(delta);
    setIndex((i) => (i + delta + projects.length) % projects.length);
  }

  const project = projects[index];

  return (
    <section id="realizace" className="overflow-hidden bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-16">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display-lg text-2xl font-bold md:text-4xl" style={{ textWrap: "balance" }}>
              Vybrané realizace
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Předchozí realizace"
              className="group border border-slate/20 p-4 transition-all hover:bg-brand hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ArrowLeft size={18} className="transition-transform group-active:scale-90" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Další realizace"
              className="group border border-slate/20 p-4 transition-all hover:bg-brand hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ArrowRight size={18} className="transition-transform group-active:scale-90" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/*
          Mobile: motion.div is relative (natural flow) — parent grows with content.
          AnimatePresence mode="wait" means exit fully completes before enter starts,
          so slides never overlap and we don't need absolute positioning on mobile.
          Desktop (md+): absolute inset-0 within fixed-height container.
        */}
        <div className="relative w-full md:h-[600px] md:overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={project.id}
              custom={direction}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full grid grid-cols-1 gap-6 md:absolute md:inset-0 lg:grid-cols-12"
            >
              <div className="relative h-[320px] overflow-hidden lg:col-span-7 lg:h-full">
                {images[index] ? (
                  <Image
                    src={images[index]}
                    alt={project.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                ) : (
                  <Placeholder alt={project.imageAlt} variant={project.variant} className="h-full w-full" />
                )}
              </div>
              <div className="flex flex-col justify-center bg-paper-dim p-8 lg:col-span-5 lg:h-full lg:p-12">
                <span className="mb-4 block font-label-md text-brand-deep">
                  {project.location}
                </span>
                <h3 className="mb-6 font-display-lg text-2xl font-bold">
                  {project.title}
                </h3>
                <p className="mb-8 font-body-lg text-slate">{project.description}</p>
                <div className="mt-auto flex gap-12 border-t border-slate/10 pt-8">
                  {project.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs uppercase text-slate">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators: 44×44px hit area with visual dot inside — WCAG 2.5.5 */}
        <div className="mt-4 flex justify-center" role="tablist" aria-label="Vyberte realizaci">
          {projects.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === index}
              aria-label={p.title}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="flex h-11 w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-brand" : "w-2 bg-slate/30"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

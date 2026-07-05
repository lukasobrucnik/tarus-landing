"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { CtaButton } from "@/components/CtaButton";
import { cn } from "@/lib/utils";

const benefits = [
  "Doručení na stavbu do 24 hodin",
  "Centrální sklad v Olomouci",
  "Distribuce po celé České republice",
  "Kompletní objednávka na jedné paletě",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Dot-matrix map of the Czech Republic ─────────────────────────────
   Border polygon in a 760×440 viewBox (lon 12.09–18.86 / lat 48.55–51.06
   projected linearly). Dots are generated individually — only points
   safely inside the border are rendered, so no dot is ever clipped in
   half. On scroll-into-view a brand wave expands from Olomouc across
   the whole country, then keeps pulsing — a literal picture of
   "expedice do 24 hodin kamkoliv po ČR". */

// Clockwise from the western tip (Aš). ~45 vertices for a recognizable
// silhouette: Ašský, Šluknovský, Frýdlantský, Broumovský, Osoblažský
// and Jablunkovský výběžek are all present.
const CZ_OUTLINE: [number, number][] = [
  [0, 142],   // západní cíp (Aš / Krásná)
  [20, 107],  // vrchol Ašského výběžku
  [46, 116],  // Kraslice
  [102, 98],  // Klínovec
  [164, 60],  // Krušné hory
  [220, 32],  // Děčín / Labe
  [243, 11],  // Šluknovský výběžek — západ
  [262, 0],   // Šluknovský výběžek — vrchol
  [282, 37],  // Šluknovský výběžek — východ
  [308, 33],  // Lužické hory
  [324, 28],  // Hrádek nad Nisou
  [346, 7],   // Frýdlantský výběžek
  [358, 28],  // Frýdlant — východ
  [400, 49],  // Jizerské hory / Krkonoše
  [422, 67],  // Sněžka — východ
  [478, 70],  // Broumovský výběžek
  [455, 105], // Kladská kotlina (zářez u Náchoda)
  [500, 140], // Orlické hory
  [528, 109], // Králicko
  [596, 130], // Zlaté Hory / Jeseník
  [632, 133], // Osoblažský výběžek
  [635, 172], // Osoblaha — východ
  [658, 177], // Opavsko
  [692, 190], // Hlučínsko
  [701, 198], // Bohumín
  [725, 209], // Karviná
  [733, 230], // Český Těšín
  [760, 270], // východní cíp (Hrčava)
  [731, 291], // Jablunkov — jih
  [686, 312], // Beskydy
  [669, 352], // Vlárský průsmyk
  [647, 373], // Bílé Karpaty
  [596, 393], // Strážnicko
  [545, 428], // Břeclav / soutok Dyje a Moravy
  [512, 418], // Mikulov
  [445, 406], // Dyje — západ
  [394, 387], // Vranovsko
  [366, 365], // Slavonice
  [338, 365], // Nová Bystřice
  [321, 403], // České Velenice
  [293, 431], // Stropnicko
  [252, 440], // jižní cíp (Vyšší Brod)
  [220, 426], // Lipno
  [198, 401], // Plechý / Šumava
  [164, 361], // Kvilda
  [128, 338], // Železná Ruda
  [85, 303],  // Folmava / Domažlice
  [52, 244],  // Rozvadov
  [40, 191],  // Dyleň
  [24, 177],  // Chebsko
];

/* The hand-drawn outline is deliberately coarse (~50 vertices). For a
   natural-looking border we refine it with midpoint subdivision: each
   edge is split and the midpoint nudged perpendicularly by a small,
   seeded-random amount (scaled down on short edges so the výběžky keep
   their shape). Three passes → ~400 vertices with coastline-like
   detail. Deterministic, so SSR and client render identically. */
function refineOutline(
  base: [number, number][],
  iterations: number,
  amplitude: number
): [number, number][] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647 - 0.5;
  };
  let pts = base;
  let amp = amplitude;
  for (let it = 0; it < iterations; it++) {
    const next: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      next.push([ax, ay]);
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const off = rand() * 2 * amp * Math.min(1, len / 30);
      next.push([(ax + bx) / 2 - (dy / len) * off, (ay + by) / 2 + (dx / len) * off]);
    }
    pts = next;
    amp *= 0.55;
  }
  return pts;
}

const CZ_DETAILED = refineOutline(CZ_OUTLINE, 3, 7);

const CZ_PATH =
  CZ_DETAILED.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z";

function pointInPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function minBorderDist(x: number, y: number, poly: [number, number][]) {
  let min = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const d = distToSegment(x, y, poly[j][0], poly[j][1], poly[i][0], poly[i][1]);
    if (d < min) min = d;
  }
  return min;
}

const DOT_SPACING = 15;
const DOT_R = 2.4;
// Dots closer than this to the border are dropped — never a half-cut dot
const BORDER_MARGIN = 5;

// Olomouc (17.25°E, 49.59°N) and Krnov (17.70°E, 50.09°N) in viewBox space
const OLOMOUC = { x: 579, y: 258 };
const KRNOV = { x: 630, y: 170 };

// Zones under the HTML labels + markers — dots there are removed entirely
// (a partially covered dot looks worse than no dot at all)
/* Dot rows sit at y = 7.5 + 15k. Each label is vertically centered on
   the dot grid (see the top offsets on the label spans) so the gap above
   and below the text stays identical. Olomouc (larger text) clears two
   rows; Krnov (smaller text) sits exactly on one row and clears only
   that one — its dots therefore hug the text noticeably tighter. */
const CLEAR_RECTS = [
  { x1: 330, y1: 240, x2: 571, y2: 270 }, // „Centrální sklad · Olomouc“ (rows 247.5 + 262.5)
  { x1: 496, y1: 168, x2: 624, y2: 177 }, // „Pobočka · Krnov“ (row 172.5 only)
];
const CLEAR_CIRCLES = [
  { x: OLOMOUC.x, y: OLOMOUC.y, r: 15 },
  { x: KRNOV.x, y: KRNOV.y, r: 9 },
];

function isCleared(x: number, y: number) {
  for (const r of CLEAR_RECTS) {
    if (x > r.x1 && x < r.x2 && y > r.y1 && y < r.y2) return true;
  }
  for (const c of CLEAR_CIRCLES) {
    if (Math.hypot(x - c.x, y - c.y) < c.r + DOT_R) return true;
  }
  return false;
}

const DOTS: { x: number; y: number }[] = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let y = DOT_SPACING / 2; y < 440; y += DOT_SPACING) {
    for (let x = DOT_SPACING / 2; x < 760; x += DOT_SPACING) {
      if (
        pointInPolygon(x, y, CZ_DETAILED) &&
        minBorderDist(x, y, CZ_DETAILED) > BORDER_MARGIN &&
        !isCleared(x, y)
      ) {
        pts.push({ x, y });
      }
    }
  }
  return pts;
})();

// Farthest border point from Olomouc is the western tip (~590 units)
const FULL_R = 640;
const WAVE_DELAY = 0.3;
const WAVE_DURATION = 1.6;
// Shared pulse cycle — the map wave and the marker ping both run on this
// period with the same delay, so they always fire in sync
const WAVE_CYCLE = 3;

function CoverageMap() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const waveOn = inView && !prefersReducedMotion;
  // Reduced motion (or SSR-safe fallback): country rendered fully covered
  const brandRadius = prefersReducedMotion ? FULL_R : inView ? FULL_R : 0;

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox="0 0 760 440"
        className="h-auto w-full"
        role="img"
        aria-label="Mapa České republiky — expedice z centrálního skladu v Olomouci do 24 hodin po celé ČR"
      >
        <defs>
          <clipPath id="cz-clip">
            <path d={CZ_PATH} />
          </clipPath>
          <clipPath id="cz-wave-clip">
            <motion.circle
              cx={OLOMOUC.x}
              cy={OLOMOUC.y}
              initial={false}
              animate={{ r: brandRadius }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: WAVE_DURATION, delay: WAVE_DELAY, ease: EASE }
              }
            />
          </clipPath>
          {/* Soft radial band — transparent core, brand ring near the edge,
              fades out again. Scales with the circle's r, so the gradient
              band rides the expanding wavefront. */}
          <radialGradient id="cz-wave-grad">
            <stop offset="62%" stopColor="var(--color-brand)" stopOpacity="0" />
            <stop offset="82%" stopColor="var(--color-brand)" stopOpacity="0.45" />
            <stop offset="94%" stopColor="var(--color-brand-deep)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base layer — quiet slate dots, individually placed (never clipped) */}
        <g className="fill-slate/30">
          {DOTS.map((d) => (
            <circle key={`b-${d.x}-${d.y}`} cx={d.x} cy={d.y} r={DOT_R} />
          ))}
        </g>

        {/* Brand layer — same dots, revealed by the expanding wave from Olomouc */}
        <g clipPath="url(#cz-wave-clip)" className="fill-brand" opacity={0.85}>
          {DOTS.map((d) => (
            <circle key={`w-${d.x}-${d.y}`} cx={d.x} cy={d.y} r={DOT_R} />
          ))}
        </g>

        {/* Continuous delivery pulses — soft gradient wavefronts expanding
            from Olomouc all the way to the western border. Clipped hard to
            the country outline (both on the group and each circle), so the
            wave never bleeds outside the map. */}
        {waveOn && (
          <g clipPath="url(#cz-clip)">
            {/* Single wavefront — 3s cycle: 2.7s travel + 0.3s breather.
                The marker ping below shares the exact same cycle + delay,
                so it always fires together with the wave, never on its own. */}
            <motion.circle
              cx={OLOMOUC.x}
              cy={OLOMOUC.y}
              fill="url(#cz-wave-grad)"
              clipPath="url(#cz-clip)"
              initial={{ r: 30, opacity: 0 }}
              animate={{ r: [30, FULL_R, FULL_R], opacity: [0.9, 0, 0] }}
              transition={{
                duration: WAVE_CYCLE,
                delay: WAVE_DELAY,
                repeat: Infinity,
                times: [0, 0.9, 1],
                ease: ["easeOut", "linear"],
              }}
            />
          </g>
        )}
      </svg>

      {/* ── Markers (HTML overlay — labels stay crisp at every size) ── */}

      {/* Olomouc — central warehouse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.4, delay: WAVE_DELAY, ease: EASE }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(OLOMOUC.x / 760) * 100}%`,
          top: `${(OLOMOUC.y / 440) * 100}%`,
        }}
        aria-hidden="true"
      >
        <span className="relative flex h-3.5 w-3.5">
          {/* Ping = the wave's local echo: identical cycle, delay, easing
              AND pacing (travels for the same 90% of the cycle as the map
              wave). Both launch in the exact same frame and move together. */}
          {waveOn && (
            <motion.span
              className="absolute inset-0 rounded-full bg-brand"
              animate={{ scale: [1, 4, 4], opacity: [0.6, 0, 0] }}
              transition={{
                duration: WAVE_CYCLE,
                delay: WAVE_DELAY,
                repeat: Infinity,
                times: [0, 0.9, 1],
                ease: ["easeOut", "linear"],
              }}
            />
          )}
          {/* Glowing orb — same treatment as the timeline spine orb */}
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand shadow-[0_0_18px_9px_rgba(0,167,231,0.36),0_0_5px_2px_rgba(0,167,231,0.82)]" />
        </span>
        {/* top offset centers the label between two dot rows (grid at 7.5+15k),
            so the cleared gap above and below the text is symmetric */}
        <span className="absolute right-full top-[calc(50%-3px)] mr-2.5 -translate-y-1/2 whitespace-nowrap px-1.5 py-0.5 font-label-md text-[14px] font-semibold uppercase tracking-wider text-ink">
          Centrální sklad · Olomouc
        </span>
      </motion.div>

      {/* Krnov — branch (visibly present, deliberately quieter than Olomouc) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{
          duration: 0.4,
          delay: prefersReducedMotion ? 0 : WAVE_DELAY + 0.45,
          ease: EASE,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(KRNOV.x / 760) * 100}%`,
          top: `${(KRNOV.y / 440) * 100}%`,
        }}
        aria-hidden="true"
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-brand/70 shadow-[0_0_8px_3px_rgba(0,167,231,0.25)]" />
        {/* centered exactly on dot row 172.5 — only that row is cleared,
            so the surrounding dots sit tight against the smaller label */}
        <span className="absolute right-full top-[calc(50%+2.5px)] mr-2 -translate-y-1/2 whitespace-nowrap px-1.5 py-0.5 font-label-md text-[11px] uppercase tracking-wider text-slate">
          Pobočka · Krnov
        </span>
      </motion.div>
    </div>
  );
}

export function CentralniSklad({ images = [] }: { images?: string[] }) {
  return (
    <section
      id="sklad"
      className="overflow-hidden bg-paper py-24 md:py-32"
      aria-label="Centrální sklad"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">

          {/* Left col: coverage map + subordinated photo */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <CoverageMap />
            </motion.div>

            {/* Two photos side by side — aspect 2:1 sits between 16:9 and
                the previous ultra-wide strip. Subordinate to the map. */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {([
                { src: images[0], alt: "Centrální sklad TARUS — Olomouc", variant: 1 as const },
                { src: images[1], alt: "Interiér skladu TARUS", variant: 2 as const },
              ]).map((photo, i) => (
                <motion.div
                  key={photo.alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
                  className="relative aspect-[2/1] overflow-hidden"
                >
                  {photo.src ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 29vw"
                    />
                  ) : (
                    <Placeholder
                      alt={photo.alt}
                      variant={photo.variant}
                      className="h-full w-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right col: text + benefits + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
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

            {/* Benefit list — same typographic register as the WhyTarus
                stat titles; the 24h promise stays the loudest row */}
            <ul className="mb-10 border-t border-slate/10">
              {benefits.map((b, i) => (
                <li
                  key={b}
                  className="flex items-center gap-4 border-b border-slate/10 py-4"
                >
                  <Check
                    size={22}
                    strokeWidth={2.5}
                    className="flex-shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span className={cn(
                    "font-display-lg text-lg font-bold leading-snug md:text-xl",
                    i === 0 ? "text-ink" : "text-slate"
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

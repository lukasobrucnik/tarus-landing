import { brands } from "@/data/content";

// Filenames in /public/images/brands are too messy to derive readable brand
// names from directly ("logomwk.png" is Milwaukee) — map filename fragments
// to proper names so logo alt text carries the actual brand for image
// search and screen readers.
const BRAND_ALT: Record<string, string> = {
  hikoki: "HiKOKI",
  klimas: "Klimas Wkręt-met",
  logomwk: "Milwaukee",
  mafell: "Mafell",
  reisser: "Reisser-Schraubentechnik",
  schueller: "Schuller",
  sihga: "SIHGA",
  tajima: "Tajima Tool",
  tarus: "TARUS",
  wera: "Wera",
};

function brandAltFromSrc(src: string): string {
  const base = decodeURIComponent(src.split("/").pop() ?? "").toLowerCase();
  const match = Object.keys(BRAND_ALT).find((key) => base.includes(key));
  return match ? `${BRAND_ALT[match]} — logo značky` : "Logo zastupované značky";
}

export function Brands({ images = [] }: { images?: string[] }) {
  // If logo images are provided, show them; otherwise fall back to text names.
  const items = images.length > 0 ? images : null;

  return (
    <section className="overflow-hidden border-y border-slate/10 bg-paper py-8 md:py-10">
      <div
        className="marquee-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        role="region"
        aria-label="Zastupované značky"
      >
        {/* py-5 = 20px top + bottom — gives 20 / 60 / 20 rhythm */}
        <div className="marquee-track flex w-max items-center gap-24 py-5">
          {items
            ? // Logo image mode: duplicate for seamless loop
              [...items, ...items].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i < items.length ? brandAltFromSrc(src) : ""}
                  aria-hidden={i >= items.length ? "true" : undefined}
                  className="h-[60px] w-auto max-w-[200px] object-contain opacity-70 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                />
              ))
            : // Text fallback mode
              [...brands, ...brands].map((brand, i) => (
                <span
                  key={`${brand}-${i}`}
                  aria-hidden={i >= brands.length ? "true" : undefined}
                  className="whitespace-nowrap text-2xl font-bold uppercase tracking-widest text-ink/70"
                >
                  {brand}
                </span>
              ))}
        </div>
      </div>
    </section>
  );
}

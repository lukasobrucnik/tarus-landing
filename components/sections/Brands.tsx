import { brands } from "@/data/content";

export function Brands({ images = [] }: { images?: string[] }) {
  // If logo images are provided, show them; otherwise fall back to text names.
  const items = images.length > 0 ? images : null;

  return (
    <section className="overflow-hidden border-y border-slate/10 bg-paper py-8 md:py-10">
      <div
        className="marquee-viewport overflow-hidden"
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
                  alt={i < items.length ? "brand logo" : ""}
                  aria-hidden={i >= items.length ? "true" : undefined}
                  className="h-[60px] w-auto max-w-[200px] object-contain"
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

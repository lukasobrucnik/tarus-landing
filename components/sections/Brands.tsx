import { brands } from "@/data/content";

export function Brands() {
  return (
    <section className="overflow-hidden border-y border-slate/10 bg-paper py-10">
      <div
        className="marquee-viewport overflow-hidden"
        role="region"
        aria-label="Zastupované značky"
      >
        <div className="marquee-track flex w-max items-center gap-24 py-4">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              aria-hidden={i >= brands.length ? "true" : undefined}
              className="whitespace-nowrap text-2xl font-bold uppercase tracking-widest text-ink/50"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

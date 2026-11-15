import Image from "next/image";
import { type ArticleBlock, type ProductRef, withUtm } from "@/data/poradna";
import { YouTubeEmbed } from "@/components/poradna/YouTubeEmbed";
import { IMAGE_BLUR_DATA_URL } from "@/lib/utils";

function ProductCard({ product, slug }: { product: ProductRef; slug: string }) {
  return (
    <a
      href={withUtm(product.url, slug)}
      target="_blank"
      rel="noopener"
      className="group flex items-center gap-4 border border-slate/15 bg-paper p-4 transition-colors hover:border-brand"
    >
      {product.image ? (
        // Remote e-shop image — plain <img> so no next/image remote config
        // is needed for a host this site doesn't control.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="h-16 w-16 shrink-0 bg-paper-dim object-contain"
        />
      ) : (
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center bg-paper-dim font-label-md text-xs uppercase tracking-wider text-slate/60"
          aria-hidden="true"
        >
          E-shop
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display-lg font-bold leading-snug text-ink">{product.name}</span>
        {product.note && <span className="mt-1 block text-sm text-slate">{product.note}</span>}
      </span>
      <span className="hidden shrink-0 font-label-md text-label-md uppercase tracking-wider text-brand-deep group-hover:text-ink sm:block">
        Do e-shopu <span aria-hidden="true">↗</span>
      </span>
      <span className="shrink-0 text-brand-deep sm:hidden" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export function ArticleBody({ blocks, slug }: { blocks: ArticleBlock[]; slug: string }) {
  return (
    <div className="text-[17px] leading-[1.75] text-slate md:text-lg">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={b.id}
                className="mb-4 mt-14 scroll-mt-28 font-display-lg text-2xl font-bold leading-snug text-ink md:text-3xl"
                style={{ textWrap: "balance" }}
              >
                {b.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="mb-5" style={{ textWrap: "pretty" }}>
                {b.text}
              </p>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className="mb-6 space-y-2">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </Tag>
            );
          }
          case "image":
            return (
              <figure key={i} className="my-10">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-dim">
                  <Image
                    src={b.src}
                    alt={b.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 760px"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                </div>
                {b.caption && <figcaption className="mt-3 text-sm text-slate">{b.caption}</figcaption>}
              </figure>
            );
          case "video":
            return <YouTubeEmbed key={i} id={b.youtubeId} title={b.title} duration={b.duration} />;
          case "tip":
            return (
              <aside key={i} className="my-8 border-l-2 border-timber bg-paper-dim px-6 py-5">
                <p className="mb-1 font-label-md text-label-md uppercase tracking-wider text-timber">
                  {b.title ?? "Tip z praxe"}
                </p>
                <p className="text-ink">{b.text}</p>
              </aside>
            );
          case "products":
            return (
              <section key={i} className="my-10" aria-label={b.title ?? "Doporučené produkty"}>
                <p className="mb-3 font-label-md text-label-md uppercase tracking-wider text-slate">
                  {b.title ?? "Doporučené produkty"}
                </p>
                <div className="flex flex-col gap-2">
                  {b.items.map((p) => (
                    <ProductCard key={p.url} product={p} slug={slug} />
                  ))}
                </div>
              </section>
            );
          case "table":
            return (
              <figure key={i} className="my-10">
                <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
                  <table className="w-full min-w-[560px] border-collapse text-left text-sm md:text-base">
                    {b.caption && (
                      <caption className="mb-3 text-left font-label-md text-label-md uppercase tracking-wider text-slate">
                        {b.caption}
                      </caption>
                    )}
                    <thead>
                      <tr className="border-b-2 border-ink">
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="py-3 pr-4 font-display-lg font-bold text-ink">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, r) => (
                        <tr key={r} className="border-b border-slate/15">
                          {row.map((cell, c) =>
                            c === 0 ? (
                              <th key={c} scope="row" className="py-3 pr-4 font-semibold text-ink">
                                {cell}
                              </th>
                            ) : (
                              <td key={c} className="py-3 pr-4">
                                {cell}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            );
        }
      })}
    </div>
  );
}

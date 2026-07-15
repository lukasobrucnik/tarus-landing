import { company, navLinks, siteConfig } from "@/data/content";

export function Footer({ logoSrc }: { logoSrc?: string | null }) {
  return (
    <footer id="kontakt" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-[1.6fr_1fr_1fr] md:gap-12 md:px-16">
        <div>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt="TARUS"
              className="mb-4 h-7 w-auto object-contain brightness-0 invert opacity-80"
            />
          ) : (
            <h3 className="mb-4 font-display-lg text-xl font-bold">TARUS</h3>
          )}
          <p className="max-w-md font-body-md text-paper/60">
            Jsme technickým partnerem realizačních firem. Dodáváme kompletní
            materiál od konstrukčního kování a spojovací techniky až po
            fasádní, terasové a nerezové systémy. Vše pořídíte na jednom
            místě bez zbytečného hledání dalších dodavatelů.
          </p>
          <p className="mt-4 max-w-md font-body-md text-paper/60">
            Díky vysoké skladové dostupnosti, logistice a zkušenému týmu z
            praxe doručujeme kompletní objednávky přímo na stavbu do 24
            hodin. Pomůžeme s výběrem správného řešení, technickými detaily
            i materiálovou skladbou, aby vaše stavba probíhala plynule, bez
            prostojů a zbytečných komplikací.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-wider text-paper/80">
            Odkazy
          </h4>
          {navLinks
            .filter((l) => l.href !== "/#kontakt")
            .map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-paper/60 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-deep"
              >
                {link.label}
              </a>
            ))}
          <a
            href={siteConfig.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/60 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-deep"
          >
            E-shop ↗
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-2 font-label-md text-label-md uppercase tracking-wider text-paper/80">
            Kontakt
          </h4>
          <p className="text-paper/60">
            {siteConfig.address.street}
            <br />
            {siteConfig.address.city}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-paper/60 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-deep"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 border-t border-paper/10 px-5 py-6 text-xs uppercase tracking-widest text-paper/55 md:flex-row md:px-16">
        {/* company.name ends with "s.r.o." — strip trailing period to avoid double-period */}
        <span>© {new Date().getFullYear()} {company.name.replace(/\.$/, '')}. Všechna práva vyhrazena.</span>
        <div className="flex flex-wrap justify-center gap-4">
          {/* min-h-[44px] on wrappers satisfies WCAG 2.5.5 touch target for these small links */}
          <a href={siteConfig.phoneHref} className="inline-flex min-h-[44px] items-center hover:text-brand">
            {siteConfig.phone}
          </a>
          <a href="/privacy" className="inline-flex min-h-[44px] items-center hover:text-brand">
            Ochrana soukromí
          </a>
          <a href="/terms" className="inline-flex min-h-[44px] items-center hover:text-brand">
            Obchodní podmínky
          </a>
        </div>
      </div>

      {/* Quiet personal credit — intentionally near-invisible at rest
          (low opacity, no border, blends into the footer bg) so it never
          competes with the brand, but readable and legible for anyone who
          looks closely or wants to reference who built the site. */}
      <div className="mx-auto max-w-[1440px] px-5 pb-6 text-center md:px-16">
        <span className="text-[10px] font-body-md tracking-wide text-paper/20 transition-colors duration-300 hover:text-paper/50">
          Created by Lukáš Obručník
        </span>
      </div>
    </footer>
  );
}

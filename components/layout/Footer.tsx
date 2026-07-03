import { company, navLinks, siteConfig } from "@/data/content";

export function Footer({ logoSrc }: { logoSrc?: string | null }) {
  return (
    <footer id="kontakt" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-3 md:px-16">
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
          <p className="max-w-xs font-body-md text-paper/60">
            Technický distributor pro dřevostavby a šikmé střechy. Váš
            partner od statiky po detail.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="mb-2 font-label-md uppercase tracking-wider text-paper/80">
            Odkazy
          </h4>
          {navLinks
            .filter((l) => l.href !== "#kontakt")
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
          <h4 className="mb-2 font-label-md uppercase tracking-wider text-paper/80">
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
    </footer>
  );
}

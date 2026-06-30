import { company, navLinks, siteConfig } from "@/data/content";

export function Footer() {
  return (
    <footer id="kontakt" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-3 md:px-16">
        <div>
          <h3 className="mb-4 font-display-lg text-xl font-bold">TARUS</h3>
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
                className="text-paper/60 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          <a
            href={siteConfig.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/60 transition-colors hover:text-brand"
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
            className="text-paper/60 transition-colors hover:text-brand"
          >
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.phoneHref}
            className="text-paper/60 transition-colors hover:text-brand"
          >
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 border-t border-paper/10 px-5 py-6 text-xs uppercase tracking-widest text-paper/40 md:flex-row md:px-16">
        <span>© {new Date().getFullYear()} {company.name}. Všechna práva vyhrazena.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand">
            Ochrana soukromí
          </a>
          <a href="#" className="hover:text-brand">
            Obchodní podmínky
          </a>
        </div>
      </div>
    </footer>
  );
}

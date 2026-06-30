# TARUS — produkční web (v1.3)

Plně funkční Next.js (App Router) aplikace, převedená z designového konceptu ze Stitch. Zachovává vizuální identitu a rozložení původního návrhu, ale je postavená jako reálná, typovaná, přístupná a SEO-optimalizovaná aplikace — ne statický export designu.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first konfigurace přes `@theme` v `app/globals.css` — žádný `tailwind.config.ts`, to je v4 standard)
- **Framer Motion** — pouze pro jemné animace (stagger reveal, crossfade, parallax)
- **Lucide Icons**
- Vlastní lehké UI komponenty v `components/ui/` (Button, Input, Textarea, Dialog) ve stylu shadcn/ui — bez plné shadcn CLI závislosti, protože naše sada potřeb (button/input/textarea/dialog) je malá a takto zůstává bundle menší.

## Jak spustit

```bash
npm install
npm run dev      # http://localhost:3000
```

Produkční build:

```bash
npm run build
npm run start
```

Ověřeno před odevzdáním: `npm run build`, `npx tsc --noEmit`, `npx eslint .` — všechno bez chyb.

## Fonty — důležitá technická poznámka

Fonty (Bricolage Grotesque, Inter) jsou **self-hosted lokálně** přes `next/font/local` (soubory v `app/fonts/`, woff2, subset `latin-ext` — nutné pro diakritiku). Vědomě **ne** přes `next/font/google`, který by za běhu/buildu stahoval fonty z `fonts.googleapis.com` — to je zbytečná závislost na vnější síti při buildu (a v CI/firemních sítích s omezeným přístupem by to build shodilo). Fonty pochází z balíčků `@fontsource/inter` a `@fontsource/bricolage-grotesque` (oba OFL licence, viz `app/fonts/`).

## Struktura

```
app/
  layout.tsx        root layout, fonty, metadata, JSON-LD
  page.tsx          sestavení všech sekcí
  globals.css       Tailwind v4 @theme (barvy, fonty, motion tokeny)
  robots.ts         /robots.txt
  sitemap.ts        /sitemap.xml
  icon.png, apple-icon.png, favicon.ico   — app-router ikony (auto-detekce)
  fonts/            self-hosted woff2 soubory

components/
  layout/           Navbar, Footer
  sections/         Hero, WhyTarus, Specializace, Realizace, OFirme,
                     NaseCesta, Brands, FinalCta — jedna sekce = jedna komponenta
  ui/                Button, Input, Textarea, Dialog, Placeholder
  ContactModal.tsx   kontaktní modal (telefon/e-mail/formulář), sdílený přes Context
  CtaButton.tsx      tlačítko "Poptat spolupráci", otevírá modal odkudkoliv

data/
  content.ts         VEŠKERÝ textový obsah webu — typované, jedno místo k editaci

lib/
  utils.ts            cn() pro merge Tailwind tříd
  structuredData.ts    JSON-LD (LocalBusiness)
```

## ⚠️ Co je PLACEHOLDER a musí se nahradit před nasazením

| Co | Kde | Poznámka |
|---|---|---|
| Telefon, e-mail, adresa | `data/content.ts` → `siteConfig` | převzato z designového konceptu, **neověřeno** |
| Rok založení (2009) a všechny milníky | `data/content.ts` → `milestones` | převzato z designu, **neověřeno** — nejde o reálnou historii firmy |
| Detaily realizací (lokace, m², tuny, roky) | `data/content.ts` → `projects` | ilustrační, ne reálné projekty |
| Všechny fotografie | `components/ui/Placeholder.tsx` | abstraktní gradient placeholdery, **nejsou to scrapnuté ani stock fotky** — žádná reálná fotka nebyla k dispozici. Až budou reálné fotky, nahraď `<Placeholder>` za `<Image>` (next/image) — je to jediné místo v kódu, kde se to řeší |
| Zastupované značky | `data/content.ts` → `brands` | jména z designového konceptu, ověřit se skutečným seznamem |
| Formulář v kontaktním modalu | `components/ContactModal.tsx` | **web nemá backend.** Odeslání otevře e-mailový klient s předvyplněnou zprávou (funguje bez serveru, ale je to dočasné řešení). Před nasazením nahradit za reálný endpoint (API route / Formspree / Netlify Forms) |
| OG obrázek, favicon | `public/og-image.png`, `app/icon.png` | vygenerováno programově s brand paletou, lze nahradit finální grafikou |

## Přístupnost (WCAG) — co je hotové

- Focus trap + Esc zavření v kontaktním modalu, návrat focusu na spouštěč
- `prefers-reduced-motion` respektováno globálně (animace, marquee, parallax)
- Marquee se zastaví na hover/focus i při reduced motion
- Specializace: přepínání funguje na hover (desktop) i klik/tap/klávesnice (touch, screen readery) — žádná funkce není vázaná jen na hover
- Skip-link, `aria-label`/`aria-selected`/`role` na interaktivních prvcích, kontrast textu nad fotkami řešen přes gradient overlay
- Min. tap target 44×44px na tlačítkách

## SEO — co je hotové

- Metadata, Open Graph, Twitter card, `robots.ts`, `sitemap.ts`
- JSON-LD `LocalBusiness` v `<head>`
- Sémantická hierarchie nadpisů (H1 v Hero, H2 per sekce)
- `viewport`/`themeColor` metadata

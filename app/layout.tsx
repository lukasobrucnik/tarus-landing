import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Barlow } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/content";
import { getStructuredData } from "@/lib/structuredData";
import { getSectionImages } from "@/lib/getSectionImages";
import { MotionProvider } from "./MotionProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollProgress } from "@/components/ScrollProgress";

const bricolage = localFont({
  variable: "--font-bricolage",
  src: [
    { path: "./fonts/bricolage-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/bricolage-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/bricolage-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/bricolage-800.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
});

// Barlow for UI labels (buttons, nav, footer headings):
// — uniform cap heights, no optical-size quirks, full Czech latin-ext coverage
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  keywords: [
    // Produktové kategorie — hlavní komerční záměr (firmy hledající konkrétní materiál)
    // "Dream 5" — konkurenční, ale nejsilnější možná shoda s tím, co prodáváme
    "tesařské kování",
    "materiál pro dřevostavby",
    "distributor stavebního materiálu",
    "terasové systémy",
    "fasádní systémy",
    "spojovací materiál pro dřevostavby",
    "konstrukční kování pro krovy",
    "kotevní technika pro tesaře",
    "terasové systémy",
    "fasádní systémy",
    "nerezové spojovací prvky",
    "materiál pro šikmé střechy",
    "materiál pro roubenky",
    "kování pro dřevostavby",
    "kotvy pro provětrávanou fasádu",
    // Pozicování distributora
    "distributor stavebního materiálu",
    "velkoobchod stavebního kování",
    "technický distributor dřevostaveb",
    "dodavatel materiálu pro tesařské firmy",
    "expedice stavebního materiálu do 24 hodin",
    "centrální sklad stavebního materiálu",
    "B2B distributor dřevostaveb",
    // Lokalita
    "distributor Olomouc",
    "stavební materiál Olomouc",
    "prodejna stavebnin Krnov",
    "distributor Moravskoslezský kraj",
    // Zastupované značky — "kde koupit" vyhledávání
    "Milwaukee nářadí",
    "Heco-Schrauben vruty",
    "Sihga kování",
    "Reisser spojovací technika",
    "Hikoki nářadí",
    // Poptávky spolupráce/partnerství
    "spolupráce s výrobci stavebního materiálu",
    "distribuce pro výrobce kování",
    "hledáme obchodní partnery stavebnictví",
    "dřevostavby",
    "roubenky",
    "šikmé střechy",
    "TARUS",
    // ── E-shop kategorie (eshop.tarus.cz) — méně konkurenční dlouhé fráze,
    // hlavní web na ně necílí přímo, ale mohou přivést návštěvníky k e-shopu.
    "spojovací materiál",
    "membrány pro dřevostavby",
    "tesařské kování a skryté spoje",
    "terasové a fasádní systémy",
    "stavební chemie",
    "nátěrové hmoty pro dřevostavby",
    "měřící a řezací technika",
    "příslušenství a doplňky pro stavebnictví",
    "nářadí pro tesaře",
    "OPP ochranné pracovní pomůcky",
    "broušení řezání vrtání",
    "zemní vruty",
    // "Dodavatel + kategorie" — nízká konkurence, jasný nákupní záměr
    "dodavatel spojovacího materiálu",
    "dodavatel membrán pro dřevostavby",
    "dodavatel tesařského kování",
    "dodavatel terasových a fasádních systémů",
    "dodavatel stavební chemie",
    "dodavatel nátěrových hmot",
    "dodavatel nářadí pro stavebnictví",
    "dodavatel OPP pomůcek",
    "dodavatel zemních vrutů",
    // "Zástupce/distributor + značka" — nízká konkurence, přesný nákupní
    // záměr (hledající chce vědět, kde danou značku v ČR sehnat)
    "Heco-Schrauben český zástupce",
    "Sihga distributor ČR",
    "Pitzl Connectors zástupce",
    "Reisser-Schraubentechnik distributor",
    "Tajima Tool zástupce ČR",
    "Zero barvy distributor",
    "Bauder distributor ČR",
    "Alpen nářadí distributor",
    "Wera nářadí zástupce",
    "Červa OPP distributor",
    "illbruck distributor ČR",
    "Mafell zástupce ČR",
    "DeWALT distributor stavebnin",
    "Bessey svěrky distributor",
    "TJEP sponkovačky zástupce",
    "PICA značkovací technika",
    "Stabila měřicí technika distributor",
    "PFERD brusivo distributor",
    "G-FIX distributor",
    "PICARD nářadí zástupce",
    "Schuller distributor ČR",
    "Klimas distributor",
    "Hikoki distributor ČR",
    "Milwaukee distributor stavebnin",
    // ── Podkategorie s nižší konkurencí — konkrétnější dotazy pod "dream 5"
    // kategoriemi, menší objem hledání, ale mnohem přesnější nákupní záměr.
    "tesařské kování pro dřevokonstrukce",
    "tesařské kování úhelník",
    "tesařské kování T",
    "vrut pro tesařské kování",
    "dřevo materiál",
    "materiál pro truhláře",
    "dřevěné profily",
    "dřevěné hranolky",
    "dřevěné stavební panely",
    "kotevní prvky pro dřevostavby",
    "terasová prkna",
    "terasové profily",
    "rektifikační terče pod dlažbu",
    "terasová dlažba",
    "rektifikační terče pod terasu",
    "terasová dlažba na terče",
    "ukončení terasy",
    "ukončovací lišta na terasu",
    "provětrávané fasádní systémy",
    "hliníkové fasádní systémy",
    "závěsné fasádní systémy",
    "fasádní omítka",
    "fasádní barva",
    "venkovní fasáda",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#10171b",
  // Site has no dark theme — without this, some Android browsers (Chrome's
  // "Tmavá témata webu" / force-dark) auto-invert the page, breaking
  // contrast on white-background sections and the white-on-transparent logo.
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = getStructuredData();
  // Same "bile" (white) logo file the Navbar uses on the dark hero — reused
  // here so the loading screen shows the identical mark, not a substitute.
  const logoSrc = getSectionImages("tarus").find((f) => f.includes("bile")) ?? null;

  return (
    <html lang="cs" className={`${bricolage.variable} ${barlow.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">
        <MotionProvider>
          <LoadingScreen logoSrc={logoSrc} />
          <ScrollProgress />
          <a href="#main" className="sr-only-focusable">
            Přeskočit na hlavní obsah
          </a>
          {children}
          <CookieBanner />
        </MotionProvider>
      </body>
    </html>
  );
}

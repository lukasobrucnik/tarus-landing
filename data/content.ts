// ============================================================
// TARUS — centralized site content.
//
// All copy lives here so components stay purely presentational and
// content can be edited in one place.
// ============================================================

// ── Legal entity: TARUS obchodní služby s.r.o. (Olomouc, primary)
export const company = {
  name: "TARUS obchodní služby s.r.o.",
  ico: "09478035",
  dic: "CZ09478035",
  address: {
    street: "Pavelkova 1210/10b",
    city: "779 00 Olomouc",
  },
  phone: "+420 778 505 327",
  phoneHref: "tel:+420778505327",
  email: "obchod@tarus.cz",
  emailSales: "prodejna@tarus.cz",
};

// ── Branches
export const branches = [
  {
    id: "olomouc",
    label: "Olomouc",
    name: "TARUS obchodní služby s.r.o.",
    address: "Pavelkova 1210/10b, 779 00 Olomouc",
    phone: "+420 778 505 327",
    phoneHref: "tel:+420778505327",
    email: "prodejna@tarus.cz",
  },
  {
    id: "krnov",
    label: "Krnov",
    name: "TARUS obchodní služby Krnov s.r.o.",
    address: "nám. Minoritů 2194/9, 794 01 Krnov",
    phone: "+420 736 631 321",
    phoneHref: "tel:+420736631321",
    email: null as string | null,
    ico: "14041618",
    dic: "CZ14041618",
  },
] as const;

// ── siteConfig: drives Navbar, Footer, ContactModal, JSON-LD, Hero tel link
export const siteConfig = {
  name: "TARUS",
  tagline: "Distributor pro dřevostavby & šikmé střechy",
  description:
    "TARUS je technický distributor materiálu pro dřevostavby, roubenky a šikmé střechy. Skladový sortiment, expedice do 24 hodin, technická podpora pro realizační firmy.",
  url: "https://www.tarus.cz",
  phone: company.phone,
  phoneHref: company.phoneHref,
  email: company.email,
  address: company.address,
  shopUrl: "https://eshop.tarus.cz/",
};

export const navLinks = [
  { label: "Specializace", href: "#specializace" },
  { label: "Proč my", href: "#proc-my" },
  { label: "Realizace", href: "#realizace" },
  { label: "Naše cesta", href: "#nase-cesta" },
  { label: "O nás", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

export const whyTarusCards = [
  {
    value: "24h",
    title: "Garantovaná expedice",
    text: "Materiál na stavbě v momentě, kdy ho potřebujete. Žádné prostoje v harmonogramu.",
  },
  {
    value: "98 %",
    title: "Dostupnost skladem",
    text: "Držíme nejširší sortiment pro moderní dřevostavby ve střední Evropě.",
  },
  {
    value: "15+",
    title: "Let na trhu",
    text: "Nerozumíme jen prodeji, rozumíme technologii a statice dřevěných konstrukcí.",
  },
  {
    value: "40+",
    title: "Zastupovaných značek",
    text: "Od spojovacích prvků po izolace. Všechny certifikované materiály na jednom místě.",
  },
] as const;

export type Specialization = {
  id: string;
  label: string;
  description: string;
  imageAlt: string;
  variant: 1 | 2 | 3;
};

export const specializations: Specialization[] = [
  {
    id: "drevostavby",
    label: "Dřevostavby",
    description:
      "Komplexní řešení pro pasivní a nízkoenergetické domy s důrazem na přesnost a moderní materiály.",
    imageAlt: "Realizace moderní dřevostavby — placeholder",
    variant: 1,
  },
  {
    id: "roubenky",
    label: "Roubenky",
    description:
      "Materiály pro masivní dřevěné konstrukce a tradiční řemeslo v moderním pojetí.",
    imageAlt: "Roubená konstrukce — placeholder",
    variant: 2,
  },
  {
    id: "sikme-strechy",
    label: "Šikmé střechy",
    description:
      "Kompletní střešní systémy včetně doplňků a klempířských prvků pro maximální životnost.",
    imageAlt: "Šikmá střecha, krov — placeholder",
    variant: 3,
  },
];

export type Project = {
  id: string;
  location: string; // PLACEHOLDER
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  imageAlt: string;
  variant: 1 | 2 | 3;
};

export const projects: Project[] = [
  {
    id: "ostrava-administrativni",
    location: "Ostrava, 2023",
    title: "Moderní administrativní budova",
    description:
      "Kompletní dodávka statického kování a spojovacích prvků pro unikátní dřevěnou fasádu a nosný skelet budovy.",
    stats: [
      { value: "1200 m²", label: "Plocha fasády" },
      { value: "4 měsíce", label: "Doba realizace" },
    ],
    imageAlt: "Administrativní budova s dřevěnou fasádou — placeholder",
    variant: 1,
  },
  {
    id: "brno-sportovni-hala",
    location: "Brno, 2022",
    title: "Sportovní hala s lepenými nosníky",
    description:
      "Technické řešení kotvení velkorozponových nosníků a dodávka kompletního sortimentu pro extrémní zatížení.",
    stats: [
      { value: "45 m", label: "Max. rozpon" },
      { value: "85 tun", label: "Hmotnost dřeva" },
    ],
    imageAlt: "Sportovní hala, dřevěné lepené nosníky — placeholder",
    variant: 2,
  },
  {
    id: "krkonose-chata",
    location: "Krkonoše, 2024",
    title: "Rekonstrukce horské chaty",
    description:
      "Logisticky náročná akce vyžadující přesné časování dodávek izolací a střešních systémů v těžkém terénu.",
    stats: [
      { value: "1150 m n.m.", label: "Nadmořská výška" },
      { value: "100 %", label: "Ekologické materiály" },
    ],
    imageAlt: "Horská chata v rekonstrukci — placeholder",
    variant: 3,
  },
];

export type Milestone = {
  year: string;
  title: string;
  text: string;
  highlighted?: boolean;
};

export const milestones: Milestone[] = [
  {
    year: "2009", // PLACEHOLDER
    title: "Založení TARUS",
    text: "První sklad s plochou 150 m² a vizí přinést kvalitní spojovací materiál pro tesaře.",
  },
  {
    year: "2013",
    title: "Technická podpora",
    text: "Rozšíření týmu o statiky a specialisty na obálku budovy pro komplexní servis.",
  },
  {
    year: "2017",
    title: "Vlastní logistika",
    text: "Nákup prvních nákladních vozů s hydraulickou rukou pro přímý závoz na stavby.",
  },
  {
    year: "2021",
    title: "Digitalizace",
    text: "Spuštění B2B portálu pro okamžité objednávky a sledování skladů v reálném čase.",
  },
  {
    year: "Dnes",
    title: "Lídři trhu",
    text: "Komplexní servis pro největší realizační firmy v ČR s garancí kvality a odbornosti.",
    highlighted: true,
  },
];

export const brands = [
  "TARUS",
  "MILWAUKEE",
  "TAJIMA TOOL",
  "Pitzl Connectors",
  "REISSER-Schraubentechnik",
  "HECO-SCHRAUBEN",
  "SIHGA",
  "HIKOKI",
  "ZERO barvy pro profesionály",
  "BAUDER",
  "ALPEN",
  "Wera",
  "ČERVA",
];

export const aboutParagraphs = [
  "Začali jsme jako malá rodinná firma s vášní pro dřevo. Dnes jsme jedním z nejvýznamnějších distributorů materiálů pro dřevostavby v regionu, ale naše hodnoty zůstávají stejné.",
  "Naším cílem není jen prodat materiál. Chceme být partnerem, který vám pomůže vyřešit technické detaily, navrhne optimální skladbu a postará se o to, aby vaše stavba probíhala bez zbytečných zádrhelů.",
  "Díky vlastní logistické flotile a rozsáhlým skladovým plochám jsme schopni reagovat s přesností, kterou moderní stavebnictví vyžaduje.",
];

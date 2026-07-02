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
  { label: "Sklad", href: "#sklad" },
  { label: "Naše cesta", href: "#nase-cesta" },
  { label: "O nás", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

export const whyTarusCards = [
  {
    value: "90 %",
    title: "Dostupnost skladem",
    text: "Udržujeme nejširší sortiment materiálů pro dřevostavby a šikmé střechy — vše, co potřebujete, máte k dispozici okamžitě.",
  },
  {
    value: "24 h",
    title: "Doručení na stavbu",
    text: "Materiál doručíme přímo na stavbu v momentě, kdy ho potřebujete. Kompletní dodávka na jedné paletě, žádné prostoje.",
  },
  {
    value: "20+",
    title: "Zastupovaných značek",
    text: "Více než 20 ověřených světových značek pod jednou střechou. Stabilní ceny bez nepříjemných překvapení.",
  },
  {
    value: "6 let",
    title: "Zkušeností",
    text: "Technická podpora od lidí z praxe. Pomůžeme vám s technickými detaily i výběrem správného materiálového řešení.",
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
    id: "tesarske-kovani",
    label: "Tesařské kování",
    description:
      "Konstrukční a spojovací kování pro dřevěné skelety, krovy a dřevostavby. Certifikované prvky předních světových výrobců.",
    imageAlt: "Tesařské kování — placeholder",
    variant: 1,
  },
  {
    id: "terasove-systemy",
    label: "Terasové systémy",
    description:
      "Kompletní systémy pro venkovní terasy — rošty, podkladové profily, spojovací materiál a povrchové úpravy pro maximální životnost.",
    imageAlt: "Terasové systémy — placeholder",
    variant: 2,
  },
  {
    id: "fasadni-systemy",
    label: "Fasádní systémy",
    description:
      "Materiály a kování pro provětrávanou i kontaktní fasádu. Kompletní sortiment od kotev po povrchové prvky.",
    imageAlt: "Fasádní systémy — placeholder",
    variant: 3,
  },
  {
    id: "nerez",
    label: "Nerez",
    description:
      "Nerezové spojovací prvky a kování pro náročné exteriérové a průmyslové aplikace s nejvyšší odolností vůči korozi.",
    imageAlt: "Nerezové kování — placeholder",
    variant: 1,
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
    year: "2021",
    title: "Založení společnosti",
    text: "TARUS zahajuje činnost jako specializovaný distributor materiálů pro dřevostavby a šikmé střechy.",
  },
  {
    year: "2022",
    title: "Světové značky",
    text: "Navázání spolupráce s předními světovými výrobci tesařského kování, fasádních a terasových systémů.",
  },
  {
    year: "2023",
    title: "Pobočka Krnov",
    text: "Otevření druhé pobočky pro zákazníky v Moravskoslezském kraji s vlastní prodejnou a skladem.",
  },
  {
    year: "2024",
    title: "Posílení týmu",
    text: "Rozšíření obchodního týmu o zkušené specialisty pokrývající celou Českou republiku.",
  },
  {
    year: "2025",
    title: "Nový sklad",
    text: "Spuštění nového centrálního skladu v Olomouci s rozšířenou kapacitou a expedicí do 24 hodin.",
  },
  {
    year: "2026",
    title: "Digitalizace",
    text: "Nový B2B portál pro rychlé objednávání materiálu přímo z kanceláře nebo přímo ze stavby.",
  },
  {
    year: "Již brzy",
    title: "Jeden z lídrů trhu",
    text: "Pracujeme na tom každý den. Díky vám.",
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

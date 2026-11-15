// ============================================================
// TARUS Poradna — články (recenze, porovnání, návody).
//
// Jak přidat článek: zkopíruj existující objekt v `articles`, změň `slug`
// a obsah. Žádná databáze ani CMS — článek je hotový po commitu a nasazení.
//
// Pravidla, aby článek fungoval pro Google i AI asistenty (ChatGPT,
// Perplexity, Google AI Overviews):
//  1. `answer` = přímá odpověď na otázku z titulku ve 2–3 větách. Asistenti
//     citují právě takové samostatné, konkrétní odstavce.
//  2. Nadpisy `h2` formuluj jako otázky, které lidé opravdu píšou do
//     vyhledávače ("Kdy použít parobrzdu?").
//  3. Konkrétní čísla, rozměry a podmínky — ne obecné fráze.
//  4. `faq` = 3–5 krátkých otázek a odpovědí. Generuje FAQPage schema.
//  5. Krátce: cíl 3–6 minut čtení. Delší téma rozděl na dva články.
//  6. Každý doporučený produkt jako blok `products` s odkazem přímo na
//     produkt v e-shopu (ne na homepage e-shopu).
// ============================================================

export type ProductRef = {
  name: string;
  // Přesná URL produktu nebo kategorie na eshop.tarus.cz.
  url: string;
  image?: string;
  // Jedna věta: proč / kdy právě tenhle produkt.
  note?: string;
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "image"; src: string; alt: string; caption?: string }
  // youtubeId = ID z odkazu youtube.com/watch?v=XXXX. Bez ID se zobrazí
  // rámeček "video připravujeme" (užitečné u konceptů).
  | { type: "video"; youtubeId?: string; title: string; duration?: string }
  | { type: "tip"; title?: string; text: string }
  | { type: "products"; title?: string; items: ProductRef[] }
  | {
      type: "table";
      caption?: string;
      head: string[];
      rows: string[][];
    };

export type ArticleKind = "porovnani" | "recenze" | "navod";

export const kindLabels: Record<ArticleKind, string> = {
  porovnani: "Porovnání",
  recenze: "Recenze",
  navod: "Návod",
};

export type Article = {
  slug: string;
  kind: ArticleKind;
  title: string;
  // Meta description, max ~155 znaků.
  description: string;
  // Krátká odpověď nahoře článku (viz pravidlo 1).
  answer: string;
  author: { name: string; role: string };
  published: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD
  cover?: { src: string; alt: string };
  // Odkaz na související specializaci na tarus.cz (interní prolinkování).
  specializationId?: string;
  body: ArticleBlock[];
  faq?: { q: string; a: string }[];
  // "koncept" = ukázka/rozpracováno: noindex, mimo sitemap, s upozorněním.
  status: "publikovano" | "koncept";
};

export const poradnaConfig = {
  name: "Poradna",
  title: "Poradna TARUS — porovnání, recenze a návody z praxe",
  description:
    "Porovnání materiálů, recenze produktů a návody na montáž od lidí, kteří materiál pro dřevostavby denně prodávají a řeší na stavbách.",
  // UTM parametry na odkazech do e-shopu — v analytice e-shopu je pak vidět,
  // kolik objednávek přivedla Poradna a který článek.
  utm: (slug: string) =>
    `utm_source=tarus.cz&utm_medium=poradna&utm_campaign=${encodeURIComponent(slug)}`,
};

const robert = { name: "Robert Tatai", role: "jednatel TARUS" };

export const articles: Article[] = [
  {
    slug: "parozabrana-parobrzda-difuzni-folie-rozdil",
    kind: "porovnani",
    title: "Parozábrana, parobrzda, nebo difuzní fólie? Jak vybrat správnou membránu",
    description:
      "Rozdíl mezi parozábranou, parobrzdou a difuzní fólií, kam která patří ve skladbě dřevostavby a jak vybrat konkrétní membránu.",
    answer:
      "Parozábrana a parobrzda patří na vnitřní (teplou) stranu tepelné izolace a brání vlhkosti z interiéru dostat se do konstrukce. Parozábrana páru téměř nepropustí, parobrzda ji propustí řízeně a umožní konstrukci vysychat dovnitř. Difuzní fólie patří na vnější stranu izolace: chrání před větrem a vodou a zároveň pouští vlhkost ven.",
    author: robert,
    published: "2026-11-15",
    body: [
      { type: "h2", id: "kam-patri", text: "Kam která membrána patří ve skladbě?" },
      {
        type: "p",
        text: "Zjednodušené pravidlo pro dřevostavby i šikmé střechy: zevnitř těsně, zvenku otevřeně. Membrána na vnitřní straně má zastavit vodní páru z interiéru dřív, než v izolaci zkondenzuje. Membrána na vnější straně má konstrukci chránit, ale páru, která se do ní přece jen dostane, pustit ven.",
      },
      {
        type: "table",
        caption: "Rychlé srovnání typů membrán",
        head: ["Typ", "Umístění", "Propustnost pro páru", "Typické použití"],
        rows: [
          ["Parozábrana", "Vnitřní strana izolace", "Velmi nízká", "Standardní skladby, kde konstrukce vysychá ven"],
          ["Parobrzda", "Vnitřní strana izolace", "Nízká až řízená", "Rekonstrukce, skladby s omezeným vysycháním ven"],
          ["Difuzní fólie", "Vnější strana izolace", "Vysoká", "Pojistná hydroizolace střechy, ochrana stěn"],
          ["Fasádní fólie", "Za provětrávanou fasádou", "Vysoká, UV stabilní", "Fasády s otevřenými spárami"],
        ],
      },
      { type: "video", title: "Robert ukazuje rozdíl mezi membránami na vzorcích", duration: "3 min" },
      { type: "h2", id: "parozabrana-nebo-parobrzda", text: "Parozábrana, nebo parobrzda?" },
      {
        type: "p",
        text: "U nové dřevostavby s difuzně otevřenou vnější skladbou obvykle stačí klasická parozábrana. Parobrzdu volte tam, kde konstrukce nemůže dobře vysychat ven — typicky při rekonstrukci podkroví, kde zůstává původní střešní krytina nebo bednění. O výsledku ale rozhoduje celá skladba, ne jedna fólie: pokud si nejste jisti, pošlete nám skladbu a doporučíme konkrétní řešení.",
      },
      {
        type: "products",
        title: "Membrány na vnitřní stranu",
        items: [
          {
            name: "Parozábrana TARUS BLUE 200 – 50 × 3,0 m, 150 m²",
            url: "https://eshop.tarus.cz/parozabrana-tarus-blue-200-50-x-3-0-m-150m2-1500-1500",
            note: "Parozábrana vlastní značky TARUS pro standardní skladby.",
          },
          {
            name: "Parozábrana TARUS NANO – 50 × 3,0 m, 150 m²",
            url: "https://eshop.tarus.cz/parozabrana-tarus-nano-50-x-3-0-m-150m2-1500-1500",
            image: "https://eshop.tarus.cz/uploads/variant/3019/pic/nano-1.jpg",
          },
          {
            name: "Parobrzda TARUS Vapor White 5, 75 m²",
            url: "https://eshop.tarus.cz/parobrzda-tarus-vapor-white-5-75m2",
            note: "Pro skladby, které potřebují vysychat dovnitř.",
          },
        ],
      },
      { type: "h2", id: "difuzni-folie", text: "Jakou difuzní fólii na střechu a na fasádu?" },
      {
        type: "p",
        text: "Pod střešní krytinu patří difuzní fólie jako pojistná hydroizolace. Za provětrávanou fasádu s otevřenými spárami volte fasádní fólii, která je určená pro dlouhodobé vystavení UV záření — běžná střešní difuzní fólie by za otevřenou fasádou časem degradovala.",
      },
      {
        type: "tip",
        title: "Nejčastější chyba z praxe",
        text: "Membrána je jen tak dobrá jako její spoje. Přesahy, napojení na okna a prostupy lepte systémovou páskou a tmelem určeným pro danou fólii. Netěsný spoj parozábrany způsobí víc škody než horší fólie položená pečlivě.",
      },
      {
        type: "products",
        title: "Membrány na vnější stranu",
        items: [
          {
            name: "MDM VENTIA N COBALT PLUS difuzní fólie, 75 m²",
            url: "https://eshop.tarus.cz/mdm-r-ventia-n-cobalt-plus-difuzni-folie-1-5-x-50-m-75m2-v-roli",
          },
          {
            name: "TARUS 150 2 SK difuzní fólie, 75 m²",
            url: "https://eshop.tarus.cz/tarus-150-2-sk-difuzni-folie-1-5-x-50-m-75m2-v-roli",
            note: "Se dvěma samolepicími pásy pro rychlé a těsné přesahy.",
          },
          {
            name: "Fasádní fólie TARUS FASSADE PLUS 2 SK, 75 m²",
            url: "https://eshop.tarus.cz/fasadni-folie-tarus-fassade-plus-2-sk-1-5-x-50-m-75m2-v-roli",
            note: "Pro provětrávané fasády s otevřenými spárami.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Může se parozábrana dát z vnější strany izolace?",
        a: "Ne. Parozábrana na vnější straně by zachytila vlhkost uvnitř konstrukce a izolace by navlhala. Na vnější stranu patří difuzně otevřená fólie.",
      },
      {
        q: "Potřebuje parozábrana instalační mezeru?",
        a: "Doporučujeme ji. Instalační předstěna před parozábranou chrání fólii před proražením při vedení elektroinstalace a montáži.",
      },
      {
        q: "Čím lepit spoje parozábrany?",
        a: "Systémovou páskou určenou pro daný typ fólie a napojení na zdivo nebo okna řešit tmelem či páskou k tomu určenou. Běžná lepicí páska časem ztratí přilnavost.",
      },
    ],
    status: "koncept",
  },
  {
    slug: "skryte-uchyceni-terasy-klipy-nebo-vruty",
    kind: "navod",
    title: "Skryté uchycení terasových prken: klipy, nebo vruty z boku?",
    description:
      "Kdy na terasu použít skryté klipy a kdy klasické terasové vruty. Výhody, nevýhody a doporučené systémy pro dřevěná prkna.",
    answer:
      "Skryté klipy dávají terasu bez viditelných hlav vrutů a prkna se dají později vyměnit, ale vyžadují prkna s drážkou nebo systém pro daný profil. Terasové vruty shora jsou nejrychlejší a nejlevnější montáž, hlavy ale zůstanou vidět. Pro hladký vzhled a dlouhou životnost volte nerezový skrytý systém.",
    author: robert,
    published: "2026-11-10",
    specializationId: "terasove-systemy",
    body: [
      { type: "h2", id: "kdy-klipy", text: "Kdy se vyplatí skryté klipy?" },
      {
        type: "list",
        items: [
          "Chcete čistý povrch bez hlav vrutů — na terase se chodí naboso.",
          "Počítáte s výměnou jednotlivých prken bez rozebírání celé terasy.",
          "Prkna mají boční drážku, nebo použijete systém určený pro vaši tloušťku prkna.",
        ],
      },
      { type: "video", title: "Montáž skrytého systému na terasový rošt", duration: "4 min" },
      { type: "h2", id: "kdy-vruty", text: "Kdy stačí terasové vruty?" },
      {
        type: "p",
        text: "Pro rychlou a cenově dostupnou montáž, u prken bez drážky nebo tam, kde viditelné hlavy nevadí. Používejte nerezové terasové vruty — pozinkované vruty v kontaktu s exotickým dřevem nebo modřínem zanechávají tmavé skvrny.",
      },
      {
        type: "tip",
        text: "Ať zvolíte cokoli, nechte mezi prkny spáru pro odvod vody a pohyb dřeva a dodržte minimální vzdálenost roštu od podkladu kvůli odvětrání.",
      },
      {
        type: "products",
        title: "Doporučené systémy",
        items: [
          {
            name: "HECO clipper set – 50 ks + 250 nerezových vrutů A2",
            url: "https://eshop.tarus.cz/62052-heco-clipper-set-50-ks-v-baleni-250-nerezovych-vrutu-a2",
          },
          {
            name: "GleitFix GF 12 CS – pro prkna 24–29 mm",
            url: "https://eshop.tarus.cz/gleitfix-r-gf-12-cs-150-ks-v-baleni-tloustka-prkna-24-29mm-34549",
          },
          {
            name: "Terasové a fasádní systémy — celá kategorie",
            url: "https://eshop.tarus.cz/katalog/terasove-a-fasadni-systemy/19",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Jsou skryté klipy dost pevné?",
        a: "Ano, pokud použijete systém určený pro danou tloušťku a šířku prkna a dodržíte rozteč roštu podle výrobce.",
      },
      {
        q: "Jaké vruty na modřínovou terasu?",
        a: "Nerezové terasové vruty. Pozinkované vruty v reakci s tříslovinami v modřínu vytvářejí tmavé skvrny kolem hlavy.",
      },
    ],
    status: "koncept",
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

// Nejnovější první.
export function getArticles() {
  return [...articles].sort((a, b) => b.published.localeCompare(a.published));
}

export function withUtm(url: string, slug: string) {
  return `${url}${url.includes("?") ? "&" : "?"}${poradnaConfig.utm(slug)}`;
}

// ~200 slov za minutu (český odborný text).
export function readingMinutes(article: Article) {
  const words = [
    article.answer,
    ...article.body.flatMap((b) => {
      if (b.type === "p" || b.type === "h2") return [b.text];
      if (b.type === "tip") return [b.text];
      if (b.type === "list") return b.items;
      if (b.type === "table") return b.rows.flat();
      return [];
    }),
    ...(article.faq ?? []).flatMap((f) => [f.q, f.a]),
  ]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

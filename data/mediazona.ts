// ============================================================
// TARUS Mediazóna — články: novinky, návody, recenze a porovnání.
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

// Tři štítky — zobrazují se na kartičkách a slouží jako filtr v přehledu.
export type ArticleKind = "novinka" | "navod" | "recenze";

export const kindLabels: Record<ArticleKind, string> = {
  novinka: "Novinka",
  navod: "Návod",
  recenze: "Recenze a porovnání",
};

// Množné číslo pro filtr v přehledu.
export const kindFilterLabels: Record<ArticleKind, string> = {
  novinka: "Novinky",
  navod: "Návody",
  recenze: "Recenze a porovnání",
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

export const mediazonaConfig = {
  name: "Mediazóna",
  title: "Mediazóna TARUS — novinky, návody, recenze a porovnání",
  description:
    "Novinky z TARUS, návody na montáž, recenze a porovnání materiálů pro dřevostavby od lidí, kteří je denně prodávají a řeší na stavbách.",
  // UTM parametry na odkazech do e-shopu — v analytice e-shopu je pak vidět,
  // kolik objednávek přivedla Mediazóna a který článek.
  utm: (slug: string) =>
    `utm_source=tarus.cz&utm_medium=mediazona&utm_campaign=${encodeURIComponent(slug)}`,
};

const robert = { name: "Robert Tatai", role: "jednatel TARUS" };

export const articles: Article[] = [
  {
    slug: "parozabrana-parobrzda-difuzni-folie-rozdil",
    kind: "recenze",
    title: "Parozábrana, parobrzda, nebo difuzní fólie? Jak vybrat správnou membránu",
    description:
      "Rozdíl mezi parozábranou, parobrzdou a difuzní fólií, kam která patří ve skladbě dřevostavby a jak vybrat konkrétní membránu.",
    answer:
      "Parozábrana a parobrzda patří na vnitřní (teplou) stranu tepelné izolace a brání vlhkosti z interiéru dostat se do konstrukce. Parozábrana páru téměř nepropustí, parobrzda ji propustí řízeně a umožní konstrukci vysychat dovnitř. Difuzní fólie patří na vnější stranu izolace: chrání před větrem a vodou a zároveň pouští vlhkost ven.",
    author: robert,
    published: "2026-11-12",
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
  {
    slug: "spoustime-mediazonu",
    kind: "novinka",
    title: "Spouštíme Mediazónu: rady z praxe, návody a novinky na jednom místě",
    description:
      "Nová sekce webu TARUS: porovnání materiálů, návody na montáž, recenze produktů a novinky z firmy. Krátce, s videem a odkazem na produkt.",
    answer:
      "Mediazóna je nová sekce webu TARUS. Najdete v ní porovnání materiálů, návody na montáž, recenze produktů a novinky z firmy. Články píšeme z otázek, které nám zákazníci denně kladou na prodejně a na stavbách.",
    author: robert,
    published: "2026-11-15",
    body: [
      { type: "h2", id: "co-najdete", text: "Co v Mediazóně najdete?" },
      {
        type: "list",
        items: [
          "Návody: jak materiál správně namontovat, aby vydržel a prošel kontrolou.",
          "Recenze a porovnání: čím se liší podobné produkty a kdy se vyplatí který.",
          "Novinky: nové produkty skladem, akce a novinky z TARUS.",
        ],
      },
      {
        type: "p",
        text: "Každý článek začíná krátkou odpovědí, takže víte, na čem jste, i když nemáte čas číst celý text. U doporučených produktů najdete odkaz přímo do e-shopu.",
      },
      { type: "h2", id: "dotaz", text: "Máte téma, které bychom měli rozebrat?" },
      {
        type: "p",
        text: "Napište nám. Z nejčastějších dotazů děláme další články a videa.",
      },
    ],
    status: "koncept",
  },
  {
    slug: "centralni-sklad-olomouc-expedice-24-hodin",
    kind: "novinka",
    title: "Centrální sklad v Olomouci: jak zvládáme expedici do 24 hodin",
    description:
      "Jak funguje centrální sklad TARUS v Olomouci a proč dodáváme kompletní objednávky na stavbu do 24 hodin.",
    answer:
      "Materiál pro dřevostavby a šikmé střechy držíme skladem v centrálním skladu v Olomouci. Objednávku připravíme jako jednu kompletní zásilku a na stavbu ji doručíme do 24 hodin, takže stavba nečeká na dodávky od více dodavatelů.",
    author: robert,
    published: "2026-11-05",
    body: [
      { type: "h2", id: "proc-jeden-sklad", text: "Proč jeden centrální sklad?" },
      {
        type: "p",
        text: "Když materiál leží na jednom místě, dá se objednávka vychystat najednou a odjet jako jedna zásilka. Pro realizační firmu to znamená jedno převzetí na stavbě místo několika dodávek v různých dnech.",
      },
      { type: "video", title: "Prohlídka centrálního skladu TARUS", duration: "2 min" },
      {
        type: "tip",
        title: "Jak objednat, aby to dorazilo včas",
        text: "Pošlete objednávku co nejdřív a uveďte přesnou adresu stavby, kontakt na přebírajícího a omezení příjezdu (šířka cesty, nosnost, čas). Ušetří to telefonování a zdržení.",
      },
    ],
    status: "koncept",
  },
  {
    slug: "kotevni-patka-sloupu-jak-ukotvit",
    kind: "navod",
    title: "Jak ukotvit dřevěný sloup: kotevní patka krok za krokem",
    description:
      "Jak vybrat kotevní patku pro dřevěný sloup pergoly nebo přístřešku a jak ji správně osadit, aby sloup nehnil.",
    answer:
      "Dřevěný sloup nikdy nebetonujte přímo do země. Použijte pozinkovanou kotevní patku, která drží sloup nad terénem, aby voda odtékala a dřevo mohlo vysychat. Velikost patky vybírejte podle průřezu sloupu a kotvení podle podkladu.",
    author: robert,
    published: "2026-10-28",
    specializationId: "tesarske-kovani",
    body: [
      { type: "h2", id: "proc-patka", text: "Proč sloup nekotvit přímo do betonu?" },
      {
        type: "p",
        text: "Pata sloupu zalitá v betonu nebo zapuštěná v zemi zůstává trvale vlhká a během pár let začne hnít. Kotevní patka drží dřevo nad podkladem, takže spodní hrana sloupu oschne po každém dešti.",
      },
      { type: "h2", id: "postup", text: "Jak patku osadit?" },
      {
        type: "list",
        ordered: true,
        items: [
          "Vyberte patku podle průřezu sloupu (např. 100 × 100 mm).",
          "Na betonový základ patku přikotvěte kotvou určenou pro beton, nebo ji zabetonujte podle typu patky.",
          "Zkontrolujte svislost a výšku patek mezi sebou ještě před vložením sloupů.",
          "Sloup přišroubujte do patky vruty nebo svorníky podle pokynů výrobce.",
        ],
      },
      {
        type: "products",
        title: "Kotevní patky skladem",
        items: [
          {
            name: "BOVA Patka kotevní BV/P 100 × 100 mm, tvar U",
            url: "https://eshop.tarus.cz/bova-patka-kotevni-bv-p-100-x-100-mm-zn-tvar-u-14-02-100x100",
          },
          {
            name: "BOVA Patka kotevní BV/P 120 × 100 mm, tvar U",
            url: "https://eshop.tarus.cz/bova-patka-kotevni-bv-p-120-x-100-mm-zn-tvar-u-14-02-120x100",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Jak vysoko nad terénem má být spodek sloupu?",
        a: "Tak, aby na něj nestříkala voda z terénu a nestál v louži. Přesnou výšku volte podle typu patky a místa.",
      },
    ],
    status: "koncept",
  },
  {
    slug: "vruty-nebo-hrebiky-do-tesarskeho-kovani",
    kind: "recenze",
    title: "Vruty, nebo kotevní hřebíky do tesařského kování?",
    description:
      "Čím připevnit úhelníky, trámové botky a spojovací desky: kotevní hřebíky, nebo vruty do tesařského kování? Rozdíly a kdy použít co.",
    answer:
      "Do tesařského kování používejte jen spojovací prostředky, které pro daný spoj uvádí výrobce kování a statik. Kotevní hřebíky jsou rychlé a levné při větším množství, vruty do kování se snáz montují ručně a dají se povolit. Běžné vruty do dřeva ani stavební hřebíky do kování nepatří.",
    author: robert,
    published: "2026-10-20",
    specializationId: "tesarske-kovani",
    body: [
      {
        type: "table",
        caption: "Kotevní hřebíky vs. vruty do kování",
        head: ["", "Kotevní hřebíky", "Vruty do kování"],
        rows: [
          ["Montáž", "Rychlá, ideálně hřebíkovačkou", "Aku šroubovák, i v těsném místě"],
          ["Demontáž", "Obtížná", "Snadná"],
          ["Cena za kus", "Nižší", "Vyšší"],
          ["Vhodné pro", "Opakované spoje ve velkém", "Menší akce, opravy, těžko přístupná místa"],
        ],
      },
      { type: "h2", id: "co-nepouzivat", text: "Co do kování nepatří?" },
      {
        type: "p",
        text: "Obyčejné vruty do dřeva mají jiný průřez pod hlavou a nedosednou do otvorů kování tak, jak počítá statický výpočet. Spoj pak nemusí přenést zatížení, se kterým projekt počítá.",
      },
      {
        type: "products",
        items: [
          {
            name: "Tesařské kování a skryté spoje — celá kategorie",
            url: "https://eshop.tarus.cz/katalog/tesarske-kovani-a-skryte-spoje/18",
          },
          {
            name: "Spojovací materiál — vruty do tesařského kování",
            url: "https://eshop.tarus.cz/katalog/spojovaci-material/1",
          },
        ],
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
  return `${url}${url.includes("?") ? "&" : "?"}${mediazonaConfig.utm(slug)}`;
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

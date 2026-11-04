import { company, branches, siteConfig } from "@/data/content";
import { LegalPage } from "@/components/LegalPage";

// Root layout's title template appends "| TARUS" — no brand suffix here,
// or it renders doubled ("… — TARUS | TARUS").
export const metadata = {
  title: "Ochrana soukromí",
  description: "Zásady ochrany osobních údajů a používání cookies na webu tarus.cz.",
};

const krnov = branches[1];

export default function PrivacyPage() {
  return (
    <LegalPage title="Ochrana soukromí" updated="4. 11. 2026">
      <p>
        Tyto zásady vysvětlují, jak zpracováváme osobní údaje návštěvníků webu{" "}
        <strong className="text-ink">tarus.cz</strong> a osob, které nás
        kontaktují přes formulář, e-mail nebo telefon. Zpracování probíhá v
        souladu s nařízením (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb.
      </p>

      <h2>1. Správce údajů</h2>
      <p>
        <strong className="text-ink">{company.name}</strong>, IČO {company.ico},
        DIČ {company.dic}, sídlem {company.address.street}, {company.address.city}
        {" "}(dále „TARUS“).
      </p>
      <p>
        Pro prodejnu v Krnově je samostatným správcem{" "}
        <strong className="text-ink">{krnov.name}</strong>, IČO {krnov.ico},
        sídlem {krnov.address}. Pro poptávky směřované na pobočku Krnov se
        tyto zásady použijí obdobně.
      </p>
      <p>
        Kontakt pro záležitosti osobních údajů:{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>, tel.{" "}
        <a href={company.phoneHref}>{company.phone}</a>.
      </p>

      <h2>2. Jaké údaje zpracováváme a proč</h2>
      <ul>
        <li>
          <strong className="text-ink">Poptávkový formulář a komunikace.</strong>{" "}
          IČO, název firmy, kontaktní osoba, telefon, e-mail a obsah dotazu.
          Údaje o firmě mohou být automaticky doplněny z veřejného rejstříku
          ARES na základě zadaného IČO. Účel: vyřízení poptávky a příprava
          nabídky. Právní základ: opatření přijatá před uzavřením smlouvy a
          oprávněný zájem na komunikaci s obchodními partnery (čl. 6 odst. 1
          písm. b) a f) GDPR). Doba uložení: po dobu vyřízení poptávky a
          následně nejdéle 3 roky, případně po dobu trvání obchodního vztahu.
        </li>
        <li>
          <strong className="text-ink">Plnění smlouvy a zákonné povinnosti.</strong>{" "}
          Fakturační a dodací údaje, účetní a daňové doklady. Právní základ:
          plnění smlouvy a zákonná povinnost (čl. 6 odst. 1 písm. b) a c)
          GDPR). Doba uložení: dle zákona, zpravidla 10 let.
        </li>
        <li>
          <strong className="text-ink">Provoz a bezpečnost webu.</strong>{" "}
          Technické údaje o návštěvě (IP adresa, typ prohlížeče, čas přístupu)
          ukládá poskytovatel hostingu v provozních logech. Účel: zajištění
          provozu a ochrana před zneužitím. Právní základ: oprávněný zájem
          (čl. 6 odst. 1 písm. f) GDPR). Doba uložení: krátkodobě, dle
          nastavení poskytovatele.
        </li>
        <li>
          <strong className="text-ink">Měření návštěvnosti.</strong> Statistiky
          o používání webu (Vercel Analytics, Vercel Speed Insights a Google Analytics
          pouze se souhlasem). Slouží ke zlepšování webu a nejsou využívány k
          identifikaci konkrétní osoby.
        </li>
        <li>
          <strong className="text-ink">Obchodní sdělení.</strong> E-maily s
          nabídkou posíláme pouze se souhlasem nebo na základě existujícího
          obchodního vztahu a vždy s možností odhlášení.
        </li>
      </ul>

      <h2>3. Příjemci údajů</h2>
      <p>
        Údaje nepředáváme třetím stranám k jejich vlastním marketingovým
        účelům. Pro zajištění provozu využíváme zpracovatele, kteří jednají na
        základě smlouvy a podle našich pokynů:
      </p>
      <ul>
        <li>hosting a měření výkonu webu (Vercel Inc.),</li>
        <li>odesílání e-mailů z formuláře (Resend),</li>
        <li>správa poptávek a kancelářský software (Microsoft 365),</li>
        <li>statistiky návštěvnosti (Google Analytics, pouze se souhlasem),</li>
        <li>účetní, právní a přepravní partneři v rozsahu nutném pro plnění zakázky.</li>
      </ul>
      <p>
        Někteří z nich sídlí mimo EU (USA). Předání probíhá na základě
        rozhodnutí o odpovídající ochraně (EU–US Data Privacy Framework) nebo
        standardních smluvních doložek.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Web používá nezbytné technické úložiště prohlížeče, například pro
        zapamatování vaší volby v cookie liště. To nevyžaduje souhlas.
        Analytické cookies Google Analytics nasadíme jen
        pokud v cookie liště vyjádříte souhlas; bez něj se nenačítají. Cookies můžete kdykoli smazat nebo zablokovat v
        nastavení prohlížeče; základní obsah webu tím omezen není. Svou volbu
        v cookie liště obnovíte smazáním dat webu tarus.cz v prohlížeči.
      </p>

      <h2>5. Vaše práva</h2>
      <p>Máte právo:</p>
      <ul>
        <li>na přístup ke svým údajům a kopii,</li>
        <li>na opravu nepřesných údajů,</li>
        <li>na výmaz, pokud pominul důvod zpracování,</li>
        <li>na omezení zpracování,</li>
        <li>na přenositelnost údajů,</li>
        <li>vznést námitku proti zpracování z oprávněného zájmu,</li>
        <li>kdykoli odvolat souhlas, byl-li udělen.</li>
      </ul>
      <p>
        Žádost zašlete na <a href={`mailto:${company.email}`}>{company.email}</a>.
        Pokud se domníváte, že s údaji nakládáme v rozporu s právními předpisy,
        můžete podat stížnost u Úřadu pro ochranu osobních údajů (
        <a href="https://uoou.gov.cz" target="_blank" rel="noopener noreferrer">
          uoou.gov.cz
        </a>
        ), Pplk. Sochora 27, 170 00 Praha 7.
      </p>

      <h2>6. Zabezpečení</h2>
      <p>
        Web je provozován výhradně přes šifrované spojení HTTPS. Přístup k
        údajům mají jen pověření zaměstnanci a zpracovatelé vázaní povinností
        mlčenlivosti.
      </p>

      <h2>7. E-shop a sociální sítě</h2>
      <p>
        E-shop <a href={siteConfig.shopUrl}>eshop.tarus.cz</a> má vlastní
        podmínky a zásady. Odkazy na naše profily na Facebooku a Instagramu
        vedou na služby třetích stran, které se řídí vlastními pravidly
        ochrany soukromí.
      </p>

      <h2>8. Změny zásad</h2>
      <p>
        Zásady můžeme aktualizovat. Aktuální znění je vždy zveřejněno na této
        stránce s uvedeným datem účinnosti.
      </p>
    </LegalPage>
  );
}

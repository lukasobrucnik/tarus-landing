import Link from "next/link";
import { company, branches, siteConfig } from "@/data/content";
import { LegalPage } from "@/components/LegalPage";

// Root layout's title template appends "| TARUS" — no brand suffix here,
// or it renders doubled ("… — TARUS | TARUS").
export const metadata = {
  title: "Obchodní podmínky",
  description: "Všeobecné obchodní podmínky společnosti TARUS obchodní služby s.r.o.",
};

const krnov = branches[1];

export default function TermsPage() {
  return (
    <LegalPage title="Obchodní podmínky" updated="4. 11. 2026">
      <p>
        Tyto všeobecné obchodní podmínky (dále „VOP“) upravují prodej zboží
        společností <strong className="text-ink">{company.name}</strong>, IČO{" "}
        {company.ico}, DIČ {company.dic}, sídlem {company.address.street},{" "}
        {company.address.city}, a pobočkou{" "}
        <strong className="text-ink">{krnov.name}</strong>, IČO {krnov.ico},
        sídlem {krnov.address} (dále „prodávající“). Pro nákupy v e-shopu{" "}
        <a href={siteConfig.shopUrl}>eshop.tarus.cz</a> platí jeho vlastní
        obchodní podmínky; tyto VOP se týkají poptávek a objednávek podaných
        přes web tarus.cz, telefonicky, e-mailem a při osobním odběru.
      </p>

      <h2>1. Obecná ustanovení</h2>
      <ol>
        <li>
          Tyto VOP se vztahují na obchodní vztahy s podnikateli (kupující
          jedná v rámci své podnikatelské činnosti) a řídí se zákonem č.
          89/2012 Sb., občanským zákoníkem.
        </li>
        <li>
          Individuálně sjednaná ujednání v kupní smlouvě mají přednost před
          těmito VOP.
        </li>
        <li>
          Informace na webu mají informativní charakter a nejsou návrhem na
          uzavření smlouvy.
        </li>
      </ol>

      <h2>2. Poptávka, objednávka a uzavření smlouvy</h2>
      <ol>
        <li>
          Poptávku lze zaslat kontaktním formulářem, e-mailem{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a> nebo
          telefonicky na <a href={company.phoneHref}>{company.phone}</a>.
        </li>
        <li>
          Na základě poptávky prodávající zašle cenovou nabídku. Smlouva je
          uzavřena potvrzením objednávky kupujícího ze strany prodávajícího.
        </li>
        <li>
          Prodávající může objednávku odmítnout, pokud zboží nelze dodat nebo
          pokud byla cena uvedena zjevně chybně.
        </li>
      </ol>

      <h2>3. Ceny a platební podmínky</h2>
      <ol>
        <li>Ceny jsou uváděny v Kč bez DPH, pokud není uvedeno jinak.</li>
        <li>
          Cena platí podle potvrzené nabídky. Nabídka je platná po dobu v ní
          uvedenou, jinak 14 dní.
        </li>
        <li>
          Platba probíhá bankovním převodem na základě faktury se splatností
          dle dohody, při osobním odběru lze platit také hotově nebo kartou.
          Prodávající si může vyhradit platbu předem.
        </li>
        <li>
          V případě prodlení s úhradou je prodávající oprávněn účtovat
          zákonný úrok z prodlení.
        </li>
        <li>
          Do úplného zaplacení kupní ceny zůstává vlastnické právo ke zboží
          prodávajícímu, je-li to mezi stranami sjednáno.
        </li>
      </ol>

      <h2>4. Dodání zboží</h2>
      <ol>
        <li>
          Zboží skladem expedujeme zpravidla do 24 hodin od potvrzení
          objednávky. Lhůta je orientační a může se lišit u nadměrných nebo na
          objednávku dodávaných položek.
        </li>
        <li>
          Zboží lze převzít osobně na prodejně nebo si nechat doručit na
          adresu určenou kupujícím. Cena dopravy se řídí nabídkou.
        </li>
        <li>
          Kupující je povinen zboží při převzetí prohlédnout a zjevné vady
          či poškození zásilky bezodkladně oznámit dopravci i prodávajícímu.
        </li>
        <li>Nebezpečí škody na zboží přechází na kupujícího jeho převzetím.</li>
      </ol>

      <h2>5. Odpovědnost za vady a reklamace</h2>
      <ol>
        <li>
          Prodávající odpovídá za to, že zboží při převzetí nemá vady.
          Záruční doba činí 24 měsíců, pokud výrobce či prodávající
          neposkytl delší nebo pokud zákon nestanoví jinak.
        </li>
        <li>
          Vadu je nutno oznámit bez zbytečného odkladu e-mailem na{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>, s popisem
          vady, číslem dokladu a fotodokumentací.
        </li>
        <li>
          Záruka se nevztahuje na vady způsobené nesprávným použitím,
          mechanickým poškozením, neodborným zásahem nebo běžným opotřebením.
        </li>
        <li>
          Reklamaci vyřídíme bez zbytečného odkladu, nejpozději do 30 dnů od
          jejího uplatnění, pokud se strany nedohodnou jinak.
        </li>
      </ol>

      <h2>6. Vrácení zboží</h2>
      <p>
        Vzhledem k tomu, že se VOP týkají podnikatelů, nemá kupující zákonné
        právo na odstoupení od smlouvy do 14 dnů. Vrácení neposkytnutého či
        nepoškozeného zboží je možné pouze po předchozí dohodě s prodávajícím,
        zpravidla se zbožím v původním obalu a s dokladem o nákupu. Zboží
        vyrobené nebo upravené na zakázku vrátit nelze.
      </p>

      <h2>7. Odstoupení od smlouvy a vyšší moc</h2>
      <p>
        Prodávající může od smlouvy odstoupit, pokud zboží není z důvodu na
        straně dodavatele dostupné; v takovém případě vrátí již přijaté
        platby. Žádná ze stran neodpovídá za prodlení způsobené okolnostmi
        vylučujícími odpovědnost.
      </p>

      <h2>8. Ochrana osobních údajů</h2>
      <p>
        Zpracování osobních údajů je popsáno v dokumentu{" "}
        <Link href="/privacy">Ochrana soukromí</Link>.
      </p>

      <h2>9. Závěrečná ustanovení</h2>
      <ol>
        <li>
          Vztahy se řídí právním řádem České republiky. Případné spory řeší
          věcně a místně příslušný soud dle sídla prodávajícího.
        </li>
        <li>
          Je-li některé ustanovení těchto VOP neplatné, nedotýká se to
          platnosti ostatních.
        </li>
        <li>
          Prodávající může VOP měnit; pro konkrétní smlouvu platí znění
          účinné v den jejího uzavření.
        </li>
        <li>
          Kontakt: <a href={`mailto:${company.email}`}>{company.email}</a>,{" "}
          <a href={company.phoneHref}>{company.phone}</a>.
        </li>
      </ol>
    </LegalPage>
  );
}

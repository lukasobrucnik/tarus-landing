import { company } from "@/data/content";

export const metadata = {
  title: "Ochrana soukromí — TARUS",
  description: "Zásady ochrany osobních údajů společnosti TARUS.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-32 md:px-16">
      <h1 className="mb-8 font-display-lg text-3xl font-extrabold md:text-5xl">
        Ochrana soukromí
      </h1>
      <div className="space-y-6 font-body-lg leading-relaxed text-slate">
        <p>
          Správce osobních údajů: <strong className="text-ink">{company.name}</strong>,
          IČO {company.ico}, sídlem {company.address.street}, {company.address.city}.
        </p>
        <p>
          Vaše osobní údaje zpracováváme výhradně za účelem vyřízení poptávky,
          zasílání obchodní komunikace (pouze se souhlasem) a plnění zákonných
          povinností. Údaje nepředáváme třetím stranám bez vašeho souhlasu.
        </p>
        <p>
          Máte právo na přístup ke svým údajům, jejich opravu, výmaz nebo
          přenositelnost. Žádosti zasílejte na{" "}
          <a href={`mailto:${company.email}`} className="text-brand-deep underline hover:text-brand">
            {company.email}
          </a>
          .
        </p>
        <p className="text-sm text-slate/70">
          Tento dokument bude v nejbližší době doplněn o úplné znění zásad
          ochrany osobních údajů v souladu s nařízením GDPR (EU) 2016/679.
        </p>
      </div>
      <a href="/" className="mt-12 inline-block text-sm text-slate underline hover:text-ink">
        ← Zpět na hlavní stránku
      </a>
    </main>
  );
}

import { company } from "@/data/content";

export const metadata = {
  title: "Obchodní podmínky — TARUS",
  description: "Obchodní podmínky společnosti TARUS.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-32 md:px-16">
      <h1 className="mb-8 font-display-lg text-3xl font-extrabold md:text-5xl">
        Obchodní podmínky
      </h1>
      <div className="space-y-6 font-body-lg leading-relaxed text-slate">
        <p>
          Prodávající: <strong className="text-ink">{company.name}</strong>,
          IČO {company.ico}, DIČ {company.dic}, sídlem {company.address.street},{" "}
          {company.address.city}.
        </p>
        <p>
          Tyto obchodní podmínky upravují vztahy mezi prodávajícím a kupujícím
          při nákupu zboží prostřednictvím e-shopu a přímých objednávek.
          Objednávku lze podat telefonicky, e-mailem nebo prostřednictvím
          B2B portálu.
        </p>
        <p>
          Ceny jsou uváděny bez DPH. Dodací lhůta je standardně do 24 hodin
          od potvrzení objednávky, pokud je zboží skladem. Platba probíhá
          bankovním převodem na základě faktury se splatností dle dohody.
        </p>
        <p className="text-sm text-slate/70">
          Úplné znění obchodních podmínek bude zveřejněno v nejbližší době.
          Pro dotazy kontaktujte{" "}
          <a href={`mailto:${company.email}`} className="text-brand-deep underline hover:text-brand">
            {company.email}
          </a>
          .
        </p>
      </div>
      <a href="/" className="mt-12 inline-block text-sm text-slate underline hover:text-ink">
        ← Zpět na hlavní stránku
      </a>
    </main>
  );
}

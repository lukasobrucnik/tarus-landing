import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import type { ContactPayload } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const ico = body.ico?.trim() ?? "";
  const firma = body.firma?.trim() ?? "";
  const kontaktOsoba = body.kontaktOsoba?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const dotaz = body.dotaz?.trim() ?? "";

  if (!firma || !kontaktOsoba || !email || !dotaz) {
    return NextResponse.json({ error: "Chybí povinná pole." }, { status: 400 });
  }

  try {
    await sendContactEmail({ ico, firma, kontaktOsoba, email, dotaz });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "SMTP_NOT_CONFIGURED") {
      console.error("[contact] SMTP env vars not set");
      return NextResponse.json(
        {
          error: `Odesílání momentálně není dostupné. Zavolejte nám nebo napište na ${
            process.env.CONTACT_TO ?? "obchod@tarus.cz"
          }.`,
        },
        { status: 503 }
      );
    }
    console.error("[contact] Email send failed:", err);
    return NextResponse.json(
      {
        error:
          "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.",
      },
      { status: 500 }
    );
  }
}

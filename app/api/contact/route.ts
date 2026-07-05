import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import type { ContactPayload } from "@/lib/email";
import { appendExcelRow } from "@/lib/excel";

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
  const telefon = body.telefon?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const dotaz = body.dotaz?.trim() ?? "";

  if (!firma || !kontaktOsoba || !email || !dotaz) {
    return NextResponse.json({ error: "Chybí povinná pole." }, { status: 400 });
  }

  try {
    const { requestId, date } = await sendContactEmail({
      ico,
      firma,
      kontaktOsoba,
      telefon,
      email,
      dotaz,
    });

    // Best-effort logging — an Excel/OneDrive outage must not fail a
    // submission that already succeeded (the email is the source of truth).
    try {
      await appendExcelRow(
        { ico, firma, kontaktOsoba, telefon, email, dotaz },
        requestId,
        date
      );
    } catch (err) {
      console.error("[contact] Excel logging failed (non-fatal):", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "RESEND_NOT_CONFIGURED") {
      console.error("[contact] RESEND_API_KEY not set");
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

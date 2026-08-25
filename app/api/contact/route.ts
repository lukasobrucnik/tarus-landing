import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import type { ContactPayload } from "@/lib/email";
import { appendExcelRow } from "@/lib/excel";

export const runtime = "nodejs";

const MAX_LEN = { ico: 8, firma: 200, kontaktOsoba: 120, telefon: 30, email: 200, dotaz: 10_000 };

// In-memory sliding-window limiter — resets per cold start and is scoped to
// a single serverless instance, so it's a first line of defense against a
// simple flood hitting one warm instance, not a hard cap across all traffic.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  submissionsByIp.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Příliš mnoho požadavků. Zkuste to prosím později." },
      { status: 429 }
    );
  }

  let body: Partial<ContactPayload> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  // Honeypot — a field real users never see or fill; bots that auto-fill
  // every input trip it. Report success without sending anything, so the
  // bot doesn't learn to look for a different signal.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const ico = (body.ico?.trim() ?? "").slice(0, MAX_LEN.ico);
  const firma = (body.firma?.trim() ?? "").slice(0, MAX_LEN.firma);
  const kontaktOsoba = (body.kontaktOsoba?.trim() ?? "").slice(0, MAX_LEN.kontaktOsoba);
  const telefon = (body.telefon?.trim() ?? "").slice(0, MAX_LEN.telefon);
  const email = (body.email?.trim() ?? "").slice(0, MAX_LEN.email);
  const dotaz = (body.dotaz?.trim() ?? "").slice(0, MAX_LEN.dotaz);

  if (!firma || !kontaktOsoba || !email || !dotaz) {
    return NextResponse.json({ error: "Chybí povinná pole." }, { status: 400 });
  }

  if (!/^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+$/.test(email)) {
    return NextResponse.json({ error: "Neplatný e-mail." }, { status: 400 });
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

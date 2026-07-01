import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { name?: string; contact?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const contact = body.contact?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !contact) {
    return NextResponse.json({ error: "Chybí povinná pole." }, { status: 400 });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("[contact] SMTP env vars not configured (SMTP_HOST, SMTP_USER, SMTP_PASS)");
    return NextResponse.json(
      {
        error: `Odesílání zpráv momentálně není dostupné. Zavolejte nám nebo napište přímo na ${process.env.CONTACT_TO ?? "obchod@tarus.cz"}.`,
      },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const replyTo = contact.includes("@") ? contact : undefined;

  try {
    await transporter.sendMail({
      from: `"TARUS Web" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO ?? "obchod@tarus.cz",
      replyTo,
      subject: `Poptávka z webu — ${name}`,
      text: `Jméno: ${name}\nKontakt: ${contact}\n\nZpráva:\n${message || "(bez zprávy)"}`,
      html: `<p><strong>Jméno:</strong> ${escapeHtml(name)}</p><p><strong>Kontakt:</strong> ${escapeHtml(contact)}</p><hr/><p>${escapeHtml(message || "(bez zprávy)").replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Email send failed:", err);
    return NextResponse.json(
      { error: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu nebo nás kontaktujte telefonicky." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

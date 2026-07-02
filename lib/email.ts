import nodemailer from "nodemailer";

export type ContactPayload = {
  ico: string;
  firma: string;
  kontaktOsoba: string;
  email: string;
  dotaz: string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send a contact form email via SMTP (nodemailer).
 * Swap this function body for Resend / SendGrid / etc. when ready —
 * the ContactPayload interface and the thrown error codes stay the same.
 *
 * Throws "SMTP_NOT_CONFIGURED" when env vars are missing so the API
 * route can return an appropriate 503 without leaking internals.
 */
export async function sendContactEmail(data: ContactPayload): Promise<void> {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_FROM, CONTACT_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_PORT === "465",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const icoLabel = data.ico ? `Poptávka z webu — ${data.firma} (IČO: ${data.ico})` : `Poptávka z webu — ${data.firma}`;
  const subject = icoLabel;

  const text = [
    data.ico ? `IČO:              ${data.ico}` : null,
    `Firma:            ${data.firma}`,
    `Kontaktní osoba:  ${data.kontaktOsoba}`,
    `E-mail:           ${data.email}`,
    ``,
    `Dotaz:`,
    data.dotaz,
  ].filter(Boolean).join("\n");

  const html = `
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${data.ico ? `<tr><td><strong>IČO</strong></td><td>${escapeHtml(data.ico)}</td></tr>` : ""}
      <tr><td><strong>Firma</strong></td><td>${escapeHtml(data.firma)}</td></tr>
      <tr><td><strong>Kontaktní osoba</strong></td><td>${escapeHtml(data.kontaktOsoba)}</td></tr>
      <tr><td><strong>E-mail</strong></td><td>${escapeHtml(data.email)}</td></tr>
    </table>
    <hr style="margin:16px 0"/>
    <p style="font-family:sans-serif;font-size:14px">
      <strong>Dotaz:</strong><br/>
      ${escapeHtml(data.dotaz).replace(/\n/g, "<br/>")}
    </p>
  `;

  await transporter.sendMail({
    from: `"TARUS Web" <${SMTP_FROM ?? SMTP_USER}>`,
    to: CONTACT_TO ?? "obchod@tarus.cz",
    replyTo: data.email,
    subject,
    text,
    html,
  });
}

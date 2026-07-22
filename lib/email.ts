import { Resend } from "resend";
import { generateContactPdf } from "@/lib/pdf";

// Logo hosted on Vercel Blob (same public store as the hero video) and
// hotlinked via a plain https URL. Tried cid: inline attachments first —
// several webmail clients (Gmail among them) don't render inline cid
// images reliably in transactional mail; they show as a blocked/empty
// placeholder until manually expanded. A normal hosted URL is the
// standard, universally-supported approach transactional email uses.
const LOGO_URL = "https://mg49vxtan6zvbcsp.public.blob.vercel-storage.com/tarus-logo-email.png";

export type ContactPayload = {
  ico: string;
  firma: string;
  kontaktOsoba: string;
  telefon?: string;
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

// Short, human-friendly reference for a single submission — not a database
// ID (there's no persistent store yet). Good enough to say "poptávka
// #A1B2C3D4" in a reply or to cross-reference against the Resend log.
function generateRequestId(): string {
  return crypto.randomUUID().slice(0, 8).toUpperCase();
}

let resendClient: Resend | null = null;
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_NOT_CONFIGURED");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// ── Shared HTML email chrome ─────────────────────────────────────────────
// Table-based layout + inline styles: the only markup subset that renders
// consistently across Outlook, Gmail, and mobile mail clients.

function emailShell(bodyHtml: string): string {
  // Full HTML document with an explicit charset: a bare fragment (no
  // <html>/<head>/meta charset) leaves some mail clients guessing the
  // encoding, which mangles Czech diacritics (ě š č ř ž ý á í é ů ú ď ť ň).
  return `<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;">
    <div style="background:#f4f4f5;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;">
        <tr>
          <td style="padding:0 0 24px;">
            <img src="${LOGO_URL}" alt="TARUS" height="28" style="height:28px;width:auto;display:block;border:0;" />
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e4e4e7;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0;font-size:12px;color:#9a9aa0;">
            TARUS obchodní služby s.r.o. &middot; automatická zpráva z webového formuláře tarus.cz
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 24px;border-bottom:1px solid #f0f0f1;font-size:13px;color:#71717a;white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
      <td style="padding:10px 24px;border-bottom:1px solid #f0f0f1;font-size:14px;color:#10171b;font-weight:600;">${value}</td>
    </tr>
  `;
}

function button(href: string, label: string): string {
  return `
    <table role="presentation" style="margin:24px;">
      <tr>
        <td style="background:#00a7e7;border-radius:3px;">
          <a href="${href}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;color:#10171b;text-decoration:none;letter-spacing:0.02em;">${label}</a>
        </td>
      </tr>
    </table>
  `;
}

// ── Internal notification — sent to the sales inbox ─────────────────────

function buildInternalEmail(data: ContactPayload, requestId: string, date: string) {
  const subject = `Nová poptávka #${requestId} — ${data.firma}`;

  const text = [
    `Nová poptávka #${requestId}`,
    ``,
    data.ico ? `IČO:              ${data.ico}` : null,
    `Firma:            ${data.firma}`,
    `Kontaktní osoba:  ${data.kontaktOsoba}`,
    data.telefon ? `Telefon:          ${data.telefon}` : null,
    `E-mail:           ${data.email}`,
    `Datum:            ${date}`,
    `Zdroj:            Web tarus.cz`,
    ``,
    `Dotaz:`,
    data.dotaz,
  ].filter(Boolean).join("\n");

  const rows = [
    row("Firma", escapeHtml(data.firma)),
    data.ico ? row("IČO", escapeHtml(data.ico)) : "",
    row("Kontaktní osoba", escapeHtml(data.kontaktOsoba)),
    data.telefon ? row("Telefon", escapeHtml(data.telefon)) : "",
    row("E-mail", escapeHtml(data.email)),
    row("Datum", date),
    row("Zdroj", "Web tarus.cz"),
  ].join("");

  const body = `
    <tr>
      <td style="padding:24px 24px 4px;">
        <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#00a7e7;text-transform:uppercase;">Nová poptávka</span>
        <div style="font-size:20px;font-weight:800;color:#10171b;margin-top:4px;">#${requestId} — ${escapeHtml(data.firma)}</div>
      </td>
    </tr>
    <tr>
      <td>
        <table role="presentation" width="100%" style="border-collapse:collapse;margin-top:12px;">
          ${rows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 4px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#71717a;text-transform:uppercase;margin-bottom:8px;">Dotaz</div>
        <div style="font-size:14px;color:#10171b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.dotaz)}</div>
      </td>
    </tr>
    <tr>
      <td>
        ${button(`mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: Poptávka #${requestId}`)}`, "Odpovědět zákazníkovi ↗")}
      </td>
    </tr>
  `;

  return { subject, text, html: emailShell(body) };
}

// ── Customer confirmation — sent to the person who filled the form ──────

function buildCustomerEmail(data: ContactPayload, requestId: string) {
  const subject = `Děkujeme za poptávku — TARUS`;

  const text = [
    `Dobrý den${data.kontaktOsoba ? `, ${data.kontaktOsoba}` : ""},`,
    ``,
    `děkujeme za vaši poptávku (č. ${requestId}). Ozveme se vám co nejdříve, obvykle do 24 hodin v pracovní dny.`,
    ``,
    `Shrnutí vaší poptávky:`,
    data.dotaz,
    ``,
    `TARUS obchodní služby s.r.o.`,
  ].join("\n");

  const body = `
    <tr>
      <td style="padding:28px 24px 4px;">
        <div style="font-size:18px;font-weight:800;color:#10171b;">Děkujeme za poptávku</div>
        <p style="font-size:14px;color:#3f3f46;line-height:1.6;margin:12px 0 0;">
          Dobrý den${data.kontaktOsoba ? `, ${escapeHtml(data.kontaktOsoba)}` : ""},<br/>
          děkujeme za vaši poptávku. Ozveme se vám co nejdříve, obvykle do 24 hodin v pracovní dny.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px 24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#71717a;text-transform:uppercase;margin-bottom:8px;">Vaše zpráva &middot; #${requestId}</div>
        <div style="background:#f4f4f5;border-radius:4px;padding:14px 16px;font-size:14px;color:#10171b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.dotaz)}</div>
      </td>
    </tr>
  `;

  return { subject, text, html: emailShell(body) };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Sends the internal sales notification and, if the customer provided a
 * valid email, a confirmation email back to them. Throws
 * "RESEND_NOT_CONFIGURED" when RESEND_API_KEY is missing so the API route
 * can return a clean 503 without leaking internals.
 *
 * Returns the generated requestId/date so the caller can log the same
 * values to Google Sheets (kept as a separate, independently-failable step
 * in the API route rather than baked in here).
 */
export async function sendContactEmail(
  data: ContactPayload
): Promise<{ requestId: string; date: string }> {
  const resend = getResendClient();
  const from = process.env.CONTACT_FROM ?? "TARUS Web <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO ?? "obchod@tarus.cz";
  const requestId = generateRequestId();
  const date = new Date().toLocaleString("cs-CZ", {
    timeZone: "Europe/Prague",
    dateStyle: "long",
    timeStyle: "short",
  });

  // PDF generation failure must not break the whole submission — the lead is
  // still captured by the email itself even if the attachment can't be built.
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await generateContactPdf(data, requestId, date);
  } catch (err) {
    console.error("[email] PDF generation failed (non-fatal):", err);
  }

  const internal = buildInternalEmail(data, requestId, date);
  const { error: internalError } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: internal.subject,
    text: internal.text,
    html: internal.html,
    attachments: pdfBuffer
      ? [{ filename: `poptavka-${requestId}.pdf`, content: pdfBuffer }]
      : undefined,
  });

  if (internalError) {
    console.error("[email] Internal notification failed:", internalError);
    throw new Error(internalError.message ?? "RESEND_SEND_FAILED");
  }

  // Confirmation email is best-effort: the lead is already captured via the
  // internal email above, so a failure here must not fail the whole request.
  const customer = buildCustomerEmail(data, requestId);
  const { error: customerError } = await resend.emails.send({
    from,
    to: data.email,
    subject: customer.subject,
    text: customer.text,
    html: customer.html,
  });

  if (customerError) {
    console.error("[email] Customer confirmation failed (non-fatal):", customerError);
  }

  return { requestId, date };
}

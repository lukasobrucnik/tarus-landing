import { google } from "googleapis";
import type { ContactPayload } from "@/lib/email";

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !privateKey) {
    throw new Error("GOOGLE_SHEETS_NOT_CONFIGURED");
  }

  const auth = new google.auth.JWT({
    email,
    // .env values escape real newlines as literal "\n" — unescape them back
    // into actual newlines, or the PEM key fails to parse.
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

/**
 * Appends one row to the "poptávky" sheet. Column order must match the
 * header row: ID | Datum | Firma | IČO | Kontaktní osoba | Telefon | E-mail
 * | Dotaz | Stav
 */
export async function appendContactRow(
  data: ContactPayload,
  requestId: string,
  date: string
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_NOT_CONFIGURED");
  }

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "A:I",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          requestId,
          date,
          data.firma,
          data.ico,
          data.kontaktOsoba,
          data.telefon ?? "",
          data.email,
          data.dotaz,
          "Nová",
        ],
      ],
    },
  });
}

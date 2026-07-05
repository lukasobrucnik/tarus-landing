import { createClient } from "redis";
import type { ContactPayload } from "@/lib/email";

const TOKEN_URL = "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";
const SCOPE = "https://graph.microsoft.com/Files.ReadWrite.All offline_access";
const REDIS_KEY = "ms:refresh_token";

let redisClient: ReturnType<typeof createClient> | null = null;
async function getRedis() {
  if (redisClient) return redisClient;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("EXCEL_NOT_CONFIGURED");
  redisClient = createClient({ url });
  await redisClient.connect();
  return redisClient;
}

/**
 * Microsoft rotates the refresh token on every use — the old one is
 * invalidated the moment a new one is issued. Env vars are immutable at
 * runtime, so the current token lives in Redis; MS_REFRESH_TOKEN only
 * bootstraps the very first call ever made (before Redis has a value yet).
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const bootstrapToken = process.env.MS_REFRESH_TOKEN;
  if (!clientId || !clientSecret) {
    throw new Error("EXCEL_NOT_CONFIGURED");
  }

  const redis = await getRedis();
  const currentRefreshToken = (await redis.get(REDIS_KEY)) ?? bootstrapToken;
  if (!currentRefreshToken) {
    throw new Error("EXCEL_NOT_CONFIGURED");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: currentRefreshToken,
      scope: SCOPE,
    }),
  });
  const tokens = await res.json();
  if (!res.ok) {
    throw new Error(`MS_TOKEN_REFRESH_FAILED: ${tokens.error ?? res.status}`);
  }

  if (tokens.refresh_token) {
    await redis.set(REDIS_KEY, tokens.refresh_token);
  }

  return tokens.access_token as string;
}

/**
 * Appends one row to the "Table1" table in tarus-poptavky.xlsx (OneDrive).
 * Column order matches the sheet: ID | Datum | Firma | IČO | Kontaktní
 * osoba | Telefon | E-mail | Dotaz | Stav
 */
export async function appendExcelRow(
  data: ContactPayload,
  requestId: string,
  date: string
): Promise<void> {
  const fileId = process.env.MS_FILE_ID;
  const tableName = process.env.MS_TABLE_NAME;
  if (!fileId || !tableName) {
    throw new Error("EXCEL_NOT_CONFIGURED");
  }

  const accessToken = await getAccessToken();

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/tables('${encodeURIComponent(tableName)}')/rows/add`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`MS_GRAPH_APPEND_FAILED: ${JSON.stringify(body)}`);
  }
}

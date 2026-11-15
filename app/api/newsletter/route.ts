import { NextRequest, NextResponse } from "next/server";
import { sendNewsletterSignup } from "@/lib/email";

export const runtime = "nodejs";

// Same in-memory per-instance limiter as /api/contact — first line of
// defense against a single flooding client, not a global cap.
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Příliš mnoho požadavků. Zkuste to prosím později." }, { status: 429 });
  }

  let body: { email?: string; source?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  // Honeypot — see /api/contact.
  if (body.website) return NextResponse.json({ ok: true });

  const email = (body.email?.trim() ?? "").slice(0, 200);
  const source = (body.source?.trim() ?? "mediazona").slice(0, 200);
  if (!/^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+$/.test(email)) {
    return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 400 });
  }

  try {
    await sendNewsletterSignup(email, source);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json(
      { error: "Přihlášení se nepodařilo. Zkuste to prosím později." },
      { status: 503 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type AresEntity = {
  ico?: string;
  obchodniJmeno?: string;
};

/**
 * Server-side ARES proxy — avoids CORS issues and lets us cache or
 * rate-limit later without touching the frontend.
 *
 * GET /api/ares?ico=09478035
 * → 200 { obchodniJmeno: "TARUS obchodní služby s.r.o." }
 * → 404 { error: "Firma nenalezena." }
 * → 502 { error: "ARES není dostupný." }
 */
export async function GET(req: NextRequest) {
  const ico = req.nextUrl.searchParams.get("ico")?.replace(/\s/g, "") ?? "";

  if (!/^\d{1,8}$/.test(ico)) {
    return NextResponse.json({ error: "Neplatné IČO." }, { status: 400 });
  }

  const padded = ico.padStart(8, "0");

  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${padded}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: "Firma nenalezena." }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "ARES není dostupný." },
        { status: 502 }
      );
    }

    const data: AresEntity = await res.json();
    return NextResponse.json({ obchodniJmeno: data.obchodniJmeno ?? null });
  } catch {
    return NextResponse.json(
      { error: "ARES není dostupný." },
      { status: 502 }
    );
  }
}

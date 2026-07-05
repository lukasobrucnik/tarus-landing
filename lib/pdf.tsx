import path from "node:path";
import fs from "node:fs";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import { company } from "@/data/content";
import type { ContactPayload } from "@/lib/email";

// Register Inter for PDF text. The PDF core fonts (Helvetica/Times) have no
// Latin Extended-A glyphs, so Czech diacritics (ě š č ř ž ý á í é ů ú ď ť ň)
// would silently disappear without an explicit font registration.
//
// These are static TTF files (Google Fonts' legacy IE-compatible endpoint,
// latin-ext subset) — deliberately NOT the woff2 files already bundled for
// the web in app/fonts/. @react-pdf/pdfkit's font embedder expects TTF/OTF;
// react-pdf's own docs recommend static TTF over woff2 for reliability.
//
// Dev-mode note: if you edit this file's font registration and PDFs start
// throwing "RangeError: Offset is outside the bounds of the DataView",
// that's a stale Turbopack/HMR module-cache issue (Font.register holds
// global state that survives hot-reload inconsistently) — restart `next
// dev`, don't debug the font. Doesn't happen in production (no HMR).
let fontRegistered = false;
function ensureFontRegistered() {
  if (fontRegistered) return;
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(process.cwd(), "lib/fonts/Inter-Regular.ttf"), fontWeight: 400 },
      { src: path.join(process.cwd(), "lib/fonts/Inter-SemiBold.ttf"), fontWeight: 600 },
    ],
  });
  fontRegistered = true;
}

// @react-pdf/image resolves string `src` paths via Node's legacy url.parse(),
// which misreads a Windows absolute path's drive letter ("C:\...") as a URL
// protocol scheme — it then silently treats the path as a remote URL and
// fails to load, with no error surfaced (the image just doesn't render).
// Reading the file into a Buffer ourselves bypasses that path resolution
// entirely; @react-pdf/image handles Buffer sources directly and correctly.
let logoBuffer: Buffer | null = null;
function getLogoBuffer(): Buffer {
  if (!logoBuffer) {
    logoBuffer = fs.readFileSync(
      path.join(process.cwd(), "public/images/tarus/original logo tarus kompletní.png")
    );
  }
  return logoBuffer;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: "#10171b",
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 64,
  },
  // Logo is 907×216px (ratio ~4.2:1) — 18pt tall keeps it visually
  // equivalent to the 16pt bold "TARUS" text it replaces.
  logo: {
    height: 18,
    width: 18 * (907 / 216),
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: 600,
    color: "#00a7e7",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 8,
  },
  label: {
    width: 120,
    color: "#71717a",
  },
  value: {
    flex: 1,
    fontWeight: 600,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  message: {
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 40,
    right: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    fontSize: 8,
    color: "#9a9aa0",
  },
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/**
 * Renders a single-page PDF summary of a contact form submission.
 * Returns a Buffer, ready to attach directly to a Resend email.
 */
export async function generateContactPdf(
  data: ContactPayload,
  requestId: string,
  date: string
): Promise<Buffer> {
  ensureFontRegistered();

  const doc = (
    <Document title={`Poptávka #${requestId} — ${data.firma}`} author="TARUS">
      <Page size="A4" style={styles.page}>
        <Image src={getLogoBuffer()} style={styles.logo} />
        <Text style={styles.eyebrow}>Poptávka</Text>
        <Text style={styles.title}>
          #{requestId} — {data.firma}
        </Text>

        <Row label="Firma" value={data.firma} />
        {data.ico ? <Row label="IČO" value={data.ico} /> : null}
        <Row label="Kontaktní osoba" value={data.kontaktOsoba} />
        {data.telefon ? <Row label="Telefon" value={data.telefon} /> : null}
        <Row label="E-mail" value={data.email} />
        <Row label="Datum" value={date} />

        <Text style={styles.sectionLabel}>Dotaz</Text>
        <Text style={styles.message}>{data.dotaz}</Text>

        <View style={styles.footer} fixed>
          <Text>
            {company.name} · IČO: {company.ico} · DIČ: {company.dic} ·{" "}
            {company.address.street}, {company.address.city}
          </Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}

import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import { resolve } from "path";

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error("Missing BLOB_READ_WRITE_TOKEN — add it to .env.local first.");
  process.exit(1);
}

const FILE_PATH = resolve("public/images/tarus/original logo tarus kompletní.png");
const buffer = readFileSync(FILE_PATH);

const blob = await put("tarus-logo-email.png", buffer, {
  access: "public",
  token: TOKEN,
  contentType: "image/png",
});

console.log("\n✓ Upload complete!");
console.log("Public URL:", blob.url);

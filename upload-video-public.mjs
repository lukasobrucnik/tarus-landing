import { put } from "@vercel/blob";
import { readFileSync, statSync } from "fs";
import { resolve } from "path";

const TOKEN = "vercel_blob_rw_ttgWldq4LJU7PnXE_jLLF6vqJfT9bs6JwN4DSrTlUpSE0Z8";
const FILE_PATH = resolve("public/images/hero/tarus-hero.mp4");

const size = statSync(FILE_PATH).size;
console.log(`Uploading ${(size / 1024 / 1024).toFixed(1)} MB as public blob...`);

const buffer = readFileSync(FILE_PATH);

const blob = await put("tarus-hero.mp4", buffer, {
  access: "public",
  token: TOKEN,
  contentType: "video/mp4",
});

console.log("\n✓ Upload complete!");
console.log("Public URL:", blob.url);

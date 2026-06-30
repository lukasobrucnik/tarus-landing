import fs from "fs";
import path from "path";

const SUPPORTED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

/**
 * Reads image files from /public/images/{section}/ at build/request time.
 * Returns URL-ready public paths: /images/{section}/filename.ext
 * Returns [] when the folder does not exist or contains no supported images.
 *
 * Server-side only — uses Node.js `fs`. Call from Server Components or
 * page.tsx, then pass results as props to client components.
 */
export function getSectionImages(section: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", section);

  if (!fs.existsSync(dir)) return [];

  try {
    return fs
      .readdirSync(dir)
      .filter((file) => SUPPORTED_EXT.has(path.extname(file).toLowerCase()))
      .sort() // alphabetical / numeric filenames produce consistent order
      .map((file) => `/images/${section}/${file}`);
  } catch {
    return [];
  }
}

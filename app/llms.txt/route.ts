import { siteConfig, specializations } from "@/data/content";
import { articles, poradnaConfig } from "@/data/poradna";

// /llms.txt — plain-text map of the site for AI assistants and crawlers
// (llmstxt.org convention). Cheap to serve, regenerated on each build.
export const dynamic = "force-static";

export function GET() {
  const published = articles.filter((a) => a.status === "publikovano");
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `E-shop s kompletním sortimentem: ${siteConfig.shopUrl}`,
    `Kontakt: ${siteConfig.email}, ${siteConfig.phone}`,
    "",
    "## Specializace",
    ...specializations.map((s) => `- [${s.label}](${siteConfig.url}/${s.id}): ${s.description}`),
    "",
    `## ${poradnaConfig.name}`,
    `- [Přehled článků](${siteConfig.url}/poradna): ${poradnaConfig.description}`,
    ...published.map((a) => `- [${a.title}](${siteConfig.url}/poradna/${a.slug}): ${a.answer}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

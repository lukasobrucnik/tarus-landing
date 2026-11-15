import type { MetadataRoute } from "next";
import { siteConfig, specializations } from "@/data/content";
import { articles } from "@/data/mediazona";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...specializations.map((spec) => ({
      url: `${siteConfig.url}/${spec.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/mediazona`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // Concept articles are noindex — keep them out of the sitemap too.
    ...articles
      .filter((a) => a.status === "publikovano")
      .map((a) => ({
        url: `${siteConfig.url}/mediazona/${a.slug}`,
        lastModified: new Date(a.updated ?? a.published),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

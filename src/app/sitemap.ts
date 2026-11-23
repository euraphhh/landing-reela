import type { MetadataRoute } from "next";
import { RELEASES } from "@/data";

export const dynamic = "force-static";
const BASE = "https://reelamusic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacidade/`, changeFrequency: "yearly", priority: 0.2 },
    ...RELEASES.map((r) => ({ url: `${BASE}/releases/${r.id}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

import type { MetadataRoute } from "next";
import { ARTISTAS, RELEASES } from "@/data";

export const dynamic = "force-static";
const BASE = "https://reelamusic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/como-funciona/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacidade/`, changeFrequency: "yearly", priority: 0.2 },
    ...ARTISTAS.filter((a) => a.pagina).map((a) => ({ url: `${BASE}/gente/${a.slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...RELEASES.map((r) => ({ url: `${BASE}/releases/${r.id}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

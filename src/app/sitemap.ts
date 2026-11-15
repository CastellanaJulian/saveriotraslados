import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { rutas } from "@/config/rutas";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: sitio.url, changeFrequency: "monthly", priority: 1 },
    ...rutas.map((r) => ({
      url: `${sitio.url}/traslados/${r.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

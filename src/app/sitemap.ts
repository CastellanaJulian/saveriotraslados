import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { rutas } from "@/config/rutas";
import { origenes } from "@/config/origenes";

// Fecha de la última publicación (cada deploy regenera el sitemap).
const actualizado = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: sitio.url, lastModified: actualizado, changeFrequency: "monthly", priority: 1 },
    ...rutas.map((r) => ({
      url: `${sitio.url}/traslados/${r.slug}`,
      lastModified: actualizado,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...origenes.map((o) => ({
      url: `${sitio.url}/desde/${o.slug}`,
      lastModified: actualizado,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

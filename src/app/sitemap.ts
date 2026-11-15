import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { rutas } from "@/config/rutas";

// Fecha de la última publicación (cada deploy regenera el sitemap).
const actualizado = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: sitio.url, lastModified: actualizado, changeFrequency: "monthly", priority: 1 },
    { url: `${sitio.url}/empresas`, lastModified: actualizado, changeFrequency: "monthly", priority: 0.9 },
    ...rutas.map((r) => ({
      url: `${sitio.url}/traslados/${r.slug}`,
      lastModified: actualizado,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { rutas } from "@/config/rutas";
import { rutaEnDe, rutasEn } from "@/config/rutas-en";

// Fecha de la última publicación (cada deploy regenera el sitemap).
const actualizado = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: sitio.url,
      lastModified: actualizado,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { "es-AR": sitio.url, en: `${sitio.url}/en` } },
    },
    { url: `${sitio.url}/tarifas`, lastModified: actualizado, changeFrequency: "monthly", priority: 0.9 },
    { url: `${sitio.url}/empresas`, lastModified: actualizado, changeFrequency: "monthly", priority: 0.9 },
    ...rutas.map((r) => {
      const en = rutaEnDe(r.slug);
      return {
        url: `${sitio.url}/traslados/${r.slug}`,
        lastModified: actualizado,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...(en && {
          alternates: {
            languages: { "es-AR": `${sitio.url}/traslados/${r.slug}`, en: `${sitio.url}/en/${en.slug}` },
          },
        }),
      };
    }),
    // Versión en inglés.
    {
      url: `${sitio.url}/en`,
      lastModified: actualizado,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { "es-AR": sitio.url, en: `${sitio.url}/en` } },
    },
    ...rutasEn.map((r) => ({
      url: `${sitio.url}/en/${r.slug}`,
      lastModified: actualizado,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: { "es-AR": `${sitio.url}/traslados/${r.esSlug}`, en: `${sitio.url}/en/${r.slug}` },
      },
    })),
  ];
}

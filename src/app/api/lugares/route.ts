// Autocompletado de direcciones con Photon (OpenStreetMap, software libre).
// Instancia pública de komoot: uso razonable, sin API key. Si el tráfico crece, se puede
// auto-hostear Photon o cambiar a ORS geocoding con la misma interfaz.

import { NextRequest } from "next/server";
import { sitio } from "@/config/sitio";

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: Record<string, string | undefined>;
};

export type Lugar = { nombre: string; detalle: string; lat: number; lon: number };

const ARGENTINA_BBOX = "-73.6,-55.1,-53.6,-21.8";

// ?q=texto → búsqueda. ?lat=..&lon=.. → dirección de un punto (botón "mi ubicación").
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon"));
  const inverso = sp.has("lat") && Number.isFinite(lat) && Number.isFinite(lon);

  let url: URL;
  if (inverso) {
    url = new URL("https://photon.komoot.io/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("limit", "1");
  } else {
    if (q.length < 3 || q.length > 120) return Response.json([]);
    url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "6");
    url.searchParams.set("lat", String(sitio.base.lat));
    url.searchParams.set("lon", String(sitio.base.lon));
    url.searchParams.set("bbox", ARGENTINA_BBOX);
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "saverio-traslados-cotizador/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return Response.json([], { status: 502 });
    const data = (await res.json()) as { features: PhotonFeature[] };

    const vistos = new Set<string>();
    const lugares: Lugar[] = [];
    for (const f of data.features ?? []) {
      const p = f.properties;
      const calle = p.street ? `${p.street}${p.housenumber ? " " + p.housenumber : ""}` : "";
      const nombre = p.name ?? calle;
      if (!nombre) continue;
      const detalle = [p.name ? calle : "", p.district ?? p.city, p.state]
        .filter(Boolean)
        .join(", ");
      const clave = nombre + detalle;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      lugares.push({
        nombre,
        detalle,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
      });
    }
    return Response.json(lugares, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return Response.json([], { status: 502 });
  }
}

// Distancia y recorrido por calle entre dos puntos.
// Producción: OpenRouteService (definir ORS_API_KEY en Vercel, key gratuita en openrouteservice.org).
// Sin key (desarrollo): usa el servidor demo de OSRM, que NO es apto para producción.

import { NextRequest } from "next/server";

export type Recorrido = { km: number; minutos: number; coords: [number, number][] };

function parsePunto(v: string | null) {
  if (!v) return null;
  const [lat, lon] = v.split(",").map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

// Reduce la cantidad de puntos para dibujar el mapa liviano.
function simplificar(coords: [number, number][], max = 120) {
  if (coords.length <= max) return coords;
  const paso = (coords.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => coords[Math.round(i * paso)]);
}

async function conORS(o: { lat: number; lon: number }, d: { lat: number; lon: number }, key: string) {
  const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
    method: "POST",
    headers: { Authorization: key, "Content-Type": "application/json" },
    body: JSON.stringify({ coordinates: [[o.lon, o.lat], [d.lon, d.lat]] }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("ors " + res.status);
  const data = await res.json();
  const f = data.features[0];
  return {
    km: f.properties.summary.distance / 1000,
    minutos: f.properties.summary.duration / 60,
    coords: f.geometry.coordinates as [number, number][],
  };
}

async function conOSRM(o: { lat: number; lon: number }, d: { lat: number; lon: number }) {
  const url = `https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?overview=simplified&geometries=geojson`;
  const res = await fetch(url, {
    headers: { "User-Agent": "saverio-traslados-cotizador/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("osrm " + res.status);
  const data = await res.json();
  const r = data.routes?.[0];
  if (!r) throw new Error("sin ruta");
  return { km: r.distance / 1000, minutos: r.duration / 60, coords: r.geometry.coordinates };
}

export async function GET(request: NextRequest) {
  const o = parsePunto(request.nextUrl.searchParams.get("o"));
  const d = parsePunto(request.nextUrl.searchParams.get("d"));
  if (!o || !d) return Response.json({ error: "Faltan origen o destino" }, { status: 400 });

  try {
    const key = process.env.ORS_API_KEY;
    const r = key ? await conORS(o, d, key) : await conOSRM(o, d);
    const body: Recorrido = {
      km: Math.round(r.km * 10) / 10,
      minutos: Math.round(r.minutos),
      coords: simplificar(r.coords),
    };
    return Response.json(body, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return Response.json({ error: "No pudimos calcular el recorrido" }, { status: 502 });
  }
}

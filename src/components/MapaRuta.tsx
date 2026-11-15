"use client";

// Mapa del resultado. Mapa real con MapLibre (software libre) y teselas de OpenFreeMap
// (OpenStreetMap, gratis y sin key). La librería se carga recién cuando aparece el resultado,
// para no afectar la velocidad de la página. Mientras carga, o si falla, se ve el recorrido en SVG.

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

const ESTILO = "https://tiles.openfreemap.org/styles/positron";

export function MapaRuta({ coords }: { coords: [number, number][] }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!contenedor.current || coords.length < 2) return;
    let mapa: import("maplibre-gl").Map | undefined;
    let cancelado = false;

    import("maplibre-gl")
      .then(({ Map, Marker, LngLatBounds, setWorkerUrl }) => {
        if (cancelado || !contenedor.current) return;
        // Worker servido desde /public (lo copia scripts/copiar-worker-mapa.mjs al instalar).
        setWorkerUrl("/maplibre/worker.mjs");
        const limites = coords.reduce((b, c) => b.extend(c), new LngLatBounds(coords[0], coords[0]));
        mapa = new Map({
          container: contenedor.current,
          style: ESTILO,
          bounds: limites,
          fitBoundsOptions: { padding: { top: 56, bottom: 28, left: 28, right: 28 }, maxZoom: 15 },
          attributionControl: { compact: true },
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
        });

        mapa.on("load", () => {
          if (!mapa) return;
          mapa.addSource("ruta", {
            type: "geojson",
            data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } },
          });
          mapa.addLayer({
            id: "ruta-borde",
            type: "line",
            source: "ruta",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#111111", "line-width": 8 },
          });
          mapa.addLayer({
            id: "ruta",
            type: "line",
            source: "ruta",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#ffc700", "line-width": 4 },
          });

          const origen = document.createElement("div");
          origen.className = "size-4 rounded-full border-4 border-tinta bg-white";
          const destino = document.createElement("div");
          destino.className = "size-4 border-[3px] border-tinta bg-taxi";
          new Marker({ element: origen }).setLngLat(coords[0]).addTo(mapa);
          new Marker({ element: destino }).setLngLat(coords[coords.length - 1]).addTo(mapa);
          // Créditos de OpenStreetMap plegados en el botón "i" para que no tapen el recorrido.
          contenedor.current
            ?.querySelector(".maplibregl-ctrl-attrib")
            ?.classList.remove("maplibregl-compact-show");
          setListo(true);
        });
      })
      .catch(() => {
        // Sin WebGL o sin conexión a las teselas: queda el recorrido en SVG.
      });

    return () => {
      cancelado = true;
      mapa?.remove();
    };
  }, [coords]);

  return (
    <div className="relative h-full w-full">
      <MapaSvg coords={coords} />
      <div
        ref={contenedor}
        className={`absolute inset-0 transition-opacity duration-300 ${listo ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// Recorrido dibujado en SVG (respaldo liviano).
function MapaSvg({ coords }: { coords: [number, number][] }) {
  if (coords.length < 2) return null;
  const W = 600;
  const H = 260;
  const pad = 34;

  const lats = coords.map((c) => c[1]);
  const lons = coords.map((c) => c[0]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = Math.max((maxLon - minLon) * kx, 1e-6);
  const spanY = Math.max(maxLat - minLat, 1e-6);
  const escala = Math.min((W - pad * 2) / spanX, (H - pad * 2) / spanY);
  const offX = (W - spanX * escala) / 2;
  const offY = (H - spanY * escala) / 2;

  const pt = ([lon, lat]: [number, number]) =>
    [offX + (lon - minLon) * kx * escala, offY + (maxLat - lat) * escala] as const;

  const d = coords
    .map((c, i) => {
      const [x, y] = pt(c);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const [ox, oy] = pt(coords[0]);
  const [dx, dy] = pt(coords[coords.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Recorrido del viaje"
    >
      <rect width={W} height={H} fill="#eceeea" />
      <path d={d} fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffc700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ox} cy={oy} r="8" fill="#fff" stroke="#111" strokeWidth="4" />
      <rect x={dx - 8} y={dy - 8} width="16" height="16" fill="#ffc700" stroke="#111" strokeWidth="3" />
    </svg>
  );
}

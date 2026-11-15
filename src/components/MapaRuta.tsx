// Mapa liviano: dibuja el recorrido en SVG, sin cargar teselas ni librerías de mapas.

export function MapaRuta({ coords }: { coords: [number, number][] }) {
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
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Recorrido del viaje">
      <defs>
        <pattern id="grilla" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" fill="none" stroke="#dfe1dc" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#eceeea" />
      <rect width={W} height={H} fill="url(#grilla)" />
      <path d={d} fill="none" stroke="#111" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffc700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ox} cy={oy} r="8" fill="#fff" stroke="#111" strokeWidth="4" />
      <rect x={dx - 8} y={dy - 8} width="16" height="16" fill="#ffc700" stroke="#111" strokeWidth="3" />
    </svg>
  );
}

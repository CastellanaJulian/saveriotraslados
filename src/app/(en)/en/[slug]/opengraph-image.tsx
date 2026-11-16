import { ImageResponse } from "next/og";
import { rutaEnPorSlug, rutaEs, rutasEn } from "@/config/rutas-en";
import { sitio } from "@/config/sitio";
import { precioReferencia } from "@/lib/frecuentes";
import { formatoDuracion, formatoPrecio } from "@/lib/cotizar";

// Imagen al compartir cada página en inglés: título, km, tiempo y precio.
export const alt = `Airport transfer with ${sitio.nombre}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return rutasEn.map((r) => ({ slug: r.slug }));
}

export default async function Imagen({ params }: { params: Promise<{ slug: string }> }) {
  const r = rutaEnPorSlug((await params).slug)!;
  const es = rutaEs(r);
  const { precio, fijo } = precioReferencia(es);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#111" }}>
        <div
          style={{
            height: 18,
            width: "100%",
            display: "flex",
            background: "repeating-linear-gradient(90deg,#ffc700 0 36px,#111 36px 72px)",
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
          <div style={{ color: "#ffc700", fontSize: 38, fontWeight: 700 }}>{sitio.nombre}</div>
          <div style={{ color: "#fff", fontSize: 88, fontWeight: 800, lineHeight: 1.02, marginTop: 18 }}>{r.titulo}</div>
          <div style={{ color: "#bdbdbd", fontSize: 40, marginTop: 34, display: "flex" }}>
            {`${es.sinDistancia ? "From the city" : `${es.km} km · ${formatoDuracion(es.minutos)}`} · ${fijo ? "" : "from "}${formatoPrecio(precio, "en")} approx.`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

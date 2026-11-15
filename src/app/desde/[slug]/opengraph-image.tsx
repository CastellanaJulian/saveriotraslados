import { ImageResponse } from "next/og";
import { origenes, origenPorSlug } from "@/config/origenes";
import { sitio } from "@/config/sitio";
import { destinosDesde } from "@/lib/origenes";

// Imagen al compartir la página de una zona de salida.
export const alt = `Traslados con ${sitio.nombre}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return origenes.map((o) => ({ slug: o.slug }));
}

export default async function Imagen({ params }: { params: Promise<{ slug: string }> }) {
  const o = origenPorSlug((await params).slug)!;
  const ezeiza = destinosDesde(o).find((d) => d.slug === "aeropuerto-ezeiza");
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
          <div style={{ color: "#fff", fontSize: 92, fontWeight: 800, lineHeight: 1.02, marginTop: 18 }}>
            {`Traslados desde ${o.nombre}`}
          </div>
          <div style={{ color: "#bdbdbd", fontSize: 40, marginTop: 34, display: "flex" }}>
            {ezeiza ? `A Ezeiza ${ezeiza.precio} aprox. · ${o.cercanos.slice(0, 3).join(", ")}` : o.cercanos.join(", ")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

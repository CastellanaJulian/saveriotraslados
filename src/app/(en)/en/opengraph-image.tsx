import { ImageResponse } from "next/og";
import { sitio } from "@/config/sitio";

// Imagen al compartir la versión en inglés.
export const alt = `${sitio.nombre}: airport transfers in Buenos Aires`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagen() {
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
          <div style={{ color: "#ffc700", fontSize: 40, fontWeight: 700 }}>{sitio.nombre}</div>
          <div style={{ color: "#fff", fontSize: 82, fontWeight: 800, lineHeight: 1.02, marginTop: 20 }}>
            Airport transfers in Buenos Aires: Ezeiza and Aeroparque
          </div>
        </div>
      </div>
    ),
    size,
  );
}

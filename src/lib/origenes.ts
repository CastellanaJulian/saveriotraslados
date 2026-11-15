import type { Frecuente } from "@/components/Cotizador";
import type { Origen } from "@/config/origenes";
import { rutaPorSlug } from "@/config/rutas";
import { cotizar, formatoDuracion, formatoPrecio } from "./cotizar";

// Destinos con precio aproximado calculado desde la zona de salida (no desde CABA).
export function destinosDesde(o: Origen): (Frecuente & { precioNumero: number; km: number })[] {
  return o.destinos.flatMap((d) => {
    const r = rutaPorSlug(d.slug);
    if (!r) return [];
    const c = cotizar({ origen: o.punto, destino: r.punto, km: d.km });
    return [
      {
        lugar: { nombre: r.destinoCompleto, detalle: "", lat: r.punto.lat, lon: r.punto.lon },
        titulo: r.destino,
        detalle: `${d.km} km · ${formatoDuracion(d.minutos)}`,
        precio: formatoPrecio(c.precio),
        precioNumero: c.precio,
        km: d.km,
        slug: r.slug,
        icono: "ruta" as const,
      },
    ];
  });
}

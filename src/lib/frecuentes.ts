import { rutas, type Ruta } from "@/config/rutas";
import { tarifasFijas } from "@/config/tarifas";
import { sitio } from "@/config/sitio";
import type { Frecuente } from "@/components/Cotizador";
import { cotizar, formatoDuracion, formatoPrecio } from "./cotizar";

// Precio de referencia de una ruta (fijo, o calculado por km desde la zona base).
export function precioReferencia(r: Ruta) {
  const fija = r.tarifaFijaId ? tarifasFijas.find((t) => t.id === r.tarifaFijaId) : undefined;
  if (fija) return { precio: fija.precio, fijo: true, nombre: fija.nombre };
  const c = cotizar({ origen: sitio.base, destino: r.punto, km: r.km });
  return { precio: c.precio, fijo: false, nombre: r.destino };
}

export function aFrecuente(r: Ruta): Frecuente {
  const { precio, fijo, nombre } = precioReferencia(r);
  return {
    lugar: { nombre: r.destinoCompleto, detalle: "", lat: r.punto.lat, lon: r.punto.lon },
    titulo: nombre,
    detalle: `${r.km} km · ${formatoDuracion(r.minutos)}`,
    precio: fijo ? formatoPrecio(precio) : `desde ${formatoPrecio(precio)}`,
    slug: r.slug,
    icono: fijo ? "avion" : "ruta",
  };
}

export const frecuentes = rutas.map(aFrecuente);

import { rutas, type Ruta } from "@/config/rutas";
import { rutasEn, rutaEs, type RutaEn } from "@/config/rutas-en";
import { tarifasFijas, usdDeTarifaFija } from "@/config/tarifas";
import { sitio } from "@/config/sitio";
import type { Frecuente } from "@/components/Cotizador";
import { cotizar, formatoDuracion, formatoPrecio, formatoUSD, precioUSDPorKm } from "./cotizar";

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
    titulo: r.origen ? r.destino : nombre,
    detalle: `${r.km} km · ${formatoDuracion(r.minutos)}`,
    precio: fijo ? formatoPrecio(precio) : `desde ${formatoPrecio(precio)}`,
    slug: r.slug,
    href: `/traslados/${r.slug}`,
    icono: fijo ? "avion" : "ruta",
  };
}

export const frecuentes = rutas.map(aFrecuente);

// Lista de rutas de la versión en inglés (precios en pesos con la moneda aclarada).
export function aFrecuenteEn(r: RutaEn): Frecuente {
  const es = rutaEs(r);
  const { precio, fijo } = precioReferencia(es);
  return {
    ...aFrecuente(es),
    titulo: r.destino,
    detalle: `${es.km} km · ${formatoDuracion(es.minutos)} · about ${formatoUSD(fijo ? usdDeTarifaFija(precio) : precioUSDPorKm(es.km))}`,
    precio: fijo ? formatoPrecio(precio, "en") : `from ${formatoPrecio(precio, "en")}`,
    slug: r.slug,
    href: `/en/${r.slug}`,
  };
}

export const frecuentesEn = rutasEn.map(aFrecuenteEn);

import { otrosAeropuertos, tarifas, tarifasFijas, usdDeTarifaFija, zonas, type Punto } from "@/config/tarifas";

export type Idioma = "es" | "en";

export function distanciaKm(a: Punto, b: Punto) {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Punto dentro de polígono (ray casting).
function enZona(p: Punto, zonaId: keyof typeof zonas) {
  const poly = zonas[zonaId].poligono;
  let dentro = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p.lat !== yj > p.lat && p.lon < ((xj - xi) * (p.lat - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

export function tarifaFijaPara(origen: Punto, destino: Punto) {
  for (const t of tarifasFijas) {
    const origenEsLugar = distanciaKm(origen, t.lugar) <= t.radioKm;
    const destinoEsLugar = distanciaKm(destino, t.lugar) <= t.radioKm;
    if (destinoEsLugar && enZona(origen, t.zona)) return t;
    if (origenEsLugar && enZona(destino, t.zona)) return t;
  }
  return undefined;
}

// Detecta si el viaje va a un aeropuerto (ida) o sale de uno (vuelta), con cualquier tarifa.
export type Aeropuerto = { nombre: string; sentido: "ida" | "vuelta" };
export function aeropuertoDe(origen: Punto, destino: Punto): Aeropuerto | null {
  const aeropuertos = [...tarifasFijas.filter((t) => t.aeropuerto), ...otrosAeropuertos];
  for (const t of aeropuertos) {
    if (distanciaKm(destino, t.lugar) <= t.radioKm) return { nombre: t.nombre, sentido: "ida" };
    if (distanciaKm(origen, t.lugar) <= t.radioKm) return { nombre: t.nombre, sentido: "vuelta" };
  }
  return null;
}

function esNocturno(fecha?: Date) {
  if (!fecha) return false;
  const h = fecha.getHours();
  return h >= tarifas.horaInicioNocturno || h < tarifas.horaFinNocturno;
}

function redondear(n: number) {
  return Math.ceil(n / tarifas.redondeo) * tarifas.redondeo;
}

// Dólares por km (US$1/km), con el mismo mínimo que en pesos llevado a km.
export function precioUSDPorKm(km: number) {
  const minimoKm = tarifas.minimo / tarifas.precioPorKm;
  return Math.ceil(Math.max(km, minimoKm) * tarifas.precioPorKmUSD);
}

export type Cotizacion = {
  precio: number;
  tipo: "fijo" | "km";
  nocturno: boolean;
  aeropuerto: Aeropuerto | null;
  nota: string;
  // Precio aproximado en dólares (para la versión en inglés).
  precioUSD: number;
};

export function cotizar(opts: {
  origen: Punto;
  destino: Punto;
  km: number;
  fecha?: Date;
}): Cotizacion {
  const fija = tarifaFijaPara(opts.origen, opts.destino);
  const nocturno = tarifas.recargoNocturno > 0 && esNocturno(opts.fecha);
  const aeropuerto = aeropuertoDe(opts.origen, opts.destino);
  const recargo = nocturno ? 1 + tarifas.recargoNocturno : 1;

  if (fija) {
    return {
      precio: redondear(fija.precio * recargo),
      tipo: "fijo",
      nocturno,
      aeropuerto,
      nota: "Precio aproximado, sujeto a confirmación. Incluye peajes.",
      precioUSD: usdDeTarifaFija(redondear(fija.precio * recargo)),
    };
  }

  const factor = opts.km >= tarifas.kmMediaDistancia ? tarifas.factorMediaDistancia : 1;
  const base = Math.max(opts.km * tarifas.precioPorKm * factor, tarifas.minimo);
  return {
    precio: redondear(base * recargo),
    tipo: "km",
    nocturno,
    aeropuerto,
    nota: "Precio aproximado, sujeto a confirmación. Incluye peajes.",
    precioUSD: precioUSDPorKm(opts.km),
  };
}

// En inglés se aclara la moneda: "$" solo se confunde con dólares.
export function formatoPrecio(n: number, idioma: Idioma = "es") {
  return idioma === "en" ? `ARS ${n.toLocaleString("en-US")}` : "$" + n.toLocaleString("es-AR");
}

export function formatoUSD(n: number) {
  return `US$${n}`;
}

export function formatoDuracion(min: number) {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

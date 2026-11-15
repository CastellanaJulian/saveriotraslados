import { tarifas, tarifasFijas, zonas, type Punto } from "@/config/tarifas";

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

function enZona(p: Punto, zonaId: keyof typeof zonas) {
  const z = zonas[zonaId];
  return distanciaKm(p, z.centro) <= z.radioKm;
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

function esNocturno(fecha?: Date) {
  if (!fecha) return false;
  const h = fecha.getHours();
  return h >= tarifas.horaInicioNocturno || h < tarifas.horaFinNocturno;
}

function redondear(n: number) {
  return Math.ceil(n / tarifas.redondeo) * tarifas.redondeo;
}

export type Cotizacion = {
  precio: number;
  tipo: "fijo" | "km";
  nocturno: boolean;
  aeropuerto: boolean;
  nota: string;
};

export function cotizar(opts: {
  origen: Punto;
  destino: Punto;
  km: number;
  fecha?: Date;
}): Cotizacion {
  const fija = tarifaFijaPara(opts.origen, opts.destino);
  const nocturno = esNocturno(opts.fecha);
  const recargo = nocturno ? 1 + tarifas.recargoNocturno : 1;

  if (fija) {
    return {
      precio: redondear(fija.precio * recargo),
      tipo: "fijo",
      nocturno,
      aeropuerto: fija.aeropuerto,
      nota: "Precio aproximado, sujeto a confirmación. Incluye peaje.",
    };
  }

  const factor = opts.km >= tarifas.kmMediaDistancia ? tarifas.factorMediaDistancia : 1;
  const base = Math.max(opts.km * tarifas.precioPorKm * factor, tarifas.minimo);
  return {
    precio: redondear(base * recargo),
    tipo: "km",
    nocturno,
    aeropuerto: false,
    nota: "Precio aproximado, sujeto a confirmación. Peajes aparte.",
  };
}

export function formatoPrecio(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

export function formatoDuracion(min: number) {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

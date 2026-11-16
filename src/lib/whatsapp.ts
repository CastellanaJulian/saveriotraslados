import { sitio } from "@/config/sitio";
import type { Idioma } from "./cotizar";

export function linkWhatsApp(mensaje: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function formatoFecha(valor: string, idioma: Idioma = "es") {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  // Ej.: "Sun, Dec 20 at 06:30" (sin el orden día/mes, que confunde entre países)
  if (idioma === "en") {
    const dia = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return `${dia} at ${hh}:${min}`;
  }
  // Ej.: "domingo 20/12 a las 06:30"
  const dia = d.toLocaleDateString("es-AR", { weekday: "long" });
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia} ${dd}/${mm} a las ${hh}:${min}`;
}

type Viaje = {
  origen: string;
  destino: string;
  fecha: string;
  pasajeros: number;
  precio?: string;
  km?: number;
};

const T = {
  es: {
    desde: "Desde",
    hasta: "Hasta",
    cuando: "Cuándo",
    pasajeros: "Pasajeros",
    precio: "Precio cotizado",
    consulta: "Hola, quiero consultar por este viaje:",
    reserva: "Hola, quiero reservar este viaje:",
    nombre: "Nombre",
    vuelo: "Vuelo",
    valijas: "Valijas",
    comentarios: "Comentarios",
  },
  en: {
    desde: "From",
    hasta: "To",
    cuando: "When",
    pasajeros: "Passengers",
    precio: "Quoted price",
    consulta: "Hi, I'd like to ask about this trip:",
    reserva: "Hi, I'd like to book this trip:",
    nombre: "Name",
    vuelo: "Flight",
    valijas: "Large suitcases",
    comentarios: "Comments",
  },
};

function lineasViaje(v: Viaje, idioma: Idioma) {
  const t = T[idioma];
  return [
    `${t.desde}: ${v.origen}`,
    `${t.hasta}: ${v.destino}`,
    v.fecha ? `${t.cuando}: ${formatoFecha(v.fecha, idioma)}` : "",
    `${t.pasajeros}: ${v.pasajeros}`,
    v.precio ? `${t.precio}: ${v.precio}${v.km ? ` (${Math.round(v.km)} km)` : ""}` : "",
  ].filter(Boolean);
}

export function mensajeConsulta(v: Viaje, idioma: Idioma = "es") {
  return [T[idioma].consulta, ...lineasViaje(v, idioma)].join("\n");
}

export type DatosReserva = {
  nombre: string;
  pasajeros: number;
  valijas: number | string;
  vuelo?: string;
  // Línea con la hora del vuelo, ej. "Sale el vuelo: 09:30 h". Vacío si no es aeropuerto.
  horaVuelo?: string;
  comentarios?: string;
};

export function mensajeReserva(v: Viaje, d: DatosReserva, idioma: Idioma = "es") {
  const t = T[idioma];
  return [
    t.reserva,
    "",
    `${t.nombre}: ${d.nombre}`,
    `${t.desde}: ${v.origen}`,
    `${t.hasta}: ${v.destino}`,
    `${t.cuando}: ${formatoFecha(v.fecha, idioma)}`,
    d.vuelo ? `${t.vuelo}: ${d.vuelo}` : "",
    d.horaVuelo ?? "",
    `${t.pasajeros}: ${d.pasajeros}`,
    `${t.valijas}: ${d.valijas}`,
    v.precio ? `${t.precio}: ${v.precio}${v.km ? ` (${Math.round(v.km)} km)` : ""}` : "",
    d.comentarios ? `${t.comentarios}: ${d.comentarios}` : "",
  ]
    .filter((l, i) => l !== "" || i === 1)
    .join("\n");
}

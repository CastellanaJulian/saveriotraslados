import { sitio } from "@/config/sitio";

export function linkWhatsApp(mensaje: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function formatoFecha(valor: string) {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "";
  // Ej.: "domingo 20/12 a las 06:30"
  const dia = d.toLocaleDateString("es-AR", { weekday: "long" });
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
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

function lineasViaje(v: Viaje) {
  return [
    `Desde: ${v.origen}`,
    `Hasta: ${v.destino}`,
    v.fecha ? `Cuándo: ${formatoFecha(v.fecha)}` : "",
    `Pasajeros: ${v.pasajeros}`,
    v.precio ? `Precio cotizado: ${v.precio}${v.km ? ` (${Math.round(v.km)} km)` : ""}` : "",
  ].filter(Boolean);
}

export function mensajeConsulta(v: Viaje) {
  return ["Hola, quiero consultar por este viaje:", ...lineasViaje(v)].join("\n");
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

export function mensajeReserva(v: Viaje, d: DatosReserva) {
  return [
    "Hola, quiero reservar este viaje:",
    "",
    `Nombre: ${d.nombre}`,
    `Desde: ${v.origen}`,
    `Hasta: ${v.destino}`,
    `Cuándo: ${formatoFecha(v.fecha)}`,
    d.vuelo ? `Vuelo: ${d.vuelo}` : "",
    d.horaVuelo ?? "",
    `Pasajeros: ${d.pasajeros}`,
    `Valijas: ${d.valijas}`,
    v.precio ? `Precio cotizado: ${v.precio}${v.km ? ` (${Math.round(v.km)} km)` : ""}` : "",
    d.comentarios ? `Comentarios: ${d.comentarios}` : "",
  ]
    .filter((l, i) => l !== "" || i === 1)
    .join("\n");
}

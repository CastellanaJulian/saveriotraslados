import { sitio } from "@/config/sitio";

export function linkWhatsApp(mensaje: string) {
  return `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function formatoFecha(valor: string) {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export function mensajeReserva(
  v: Viaje,
  datos: { nombre: string; telefono: string; vuelo?: string; comentarios?: string },
) {
  return [
    "Hola, quiero reservar este viaje:",
    ...lineasViaje(v),
    "",
    `Nombre: ${datos.nombre}`,
    `Teléfono: ${datos.telefono}`,
    datos.vuelo ? `Vuelo: ${datos.vuelo}` : "",
    datos.comentarios ? `Comentarios: ${datos.comentarios}` : "",
  ]
    .filter((l, i, arr) => l !== "" || (i > 0 && arr[i - 1] !== ""))
    .join("\n");
}

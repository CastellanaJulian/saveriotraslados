// Páginas por destino (SEO). Cada una genera /traslados/[slug].
// km y minutos son aproximados desde el centro de CABA. ⚠️ Revisar textos y valores con Saverio.

import type { Punto } from "./tarifas";

export type Ruta = {
  slug: string;
  destino: string; // nombre corto, ej. "Mar del Plata"
  destinoCompleto: string; // como se carga en el cotizador
  traslado?: string; // título si "Traslado a {destino}" no suena bien (ej. "Traslado al Aeropuerto de San Fernando")
  punto: Punto;
  km: number;
  minutos: number;
  tarifaFijaId?: string; // si tiene precio fijo (ver tarifas.ts)
  title: string; // <title> de la página
  description: string; // meta description
  intro: string[]; // párrafos propios de la página
  faqs: { pregunta: string; respuesta: string }[];
};

export const rutas: Ruta[] = [
  {
    slug: "aeropuerto-ezeiza",
    destino: "Ezeiza",
    destinoCompleto: "Aeropuerto Internacional Ezeiza",
    punto: { lat: -34.8222, lon: -58.5358 },
    km: 32,
    minutos: 35,
    tarifaFijaId: "ezeiza",
    title: "Traslado a Ezeiza desde CABA y Gran Buenos Aires",
    description:
      "Traslado al Aeropuerto de Ezeiza desde CABA y Gran Buenos Aires. Cotizá al instante, Chevrolet Spin para 4 pasajeros, vuelos de madrugada y espera sin cargo si se atrasa el vuelo.",
    intro: [
      "Te buscamos en tu casa o en la oficina y te dejamos en la terminal que corresponda a tu vuelo. Desde CABA tiene una tarifa de referencia con el peaje incluido; desde el resto del Gran Buenos Aires se calcula por kilómetro, también con peajes incluidos. Te confirmamos el precio por WhatsApp.",
      "Para vuelos internacionales conviene salir con tres horas de margen. Si salís temprano a la mañana, reservá el día anterior y te confirmamos por WhatsApp con el auto y la patente.",
      "A la vuelta seguimos tu vuelo: si aterriza tarde, la espera no se cobra.",
    ],
    faqs: [
      {
        pregunta: "¿Cuánto sale un traslado a Ezeiza?",
        respuesta:
          "Desde CABA tiene una tarifa de referencia con peaje incluido. Desde el Gran Buenos Aires se calcula por kilómetro, con peajes incluidos. El cotizador de esta página te muestra el valor aproximado y te lo confirmamos al reservar.",
      },
      {
        pregunta: "¿Qué pasa si mi vuelo se atrasa?",
        respuesta:
          "Seguimos el vuelo con el número que nos pasás al reservar. Si se atrasa, esperamos sin costo extra.",
      },
      {
        pregunta: "¿Entran las valijas de cuatro personas?",
        respuesta:
          "Viajamos hasta 4 pasajeros en una Chevrolet Spin. Si llevan muchas valijas grandes, avisanos cuántas al reservar.",
      },
    ],
  },
  {
    slug: "aeroparque",
    destino: "Aeroparque",
    destinoCompleto: "Aeroparque Jorge Newbery",
    punto: { lat: -34.5592, lon: -58.4156 },
    km: 28,
    minutos: 40,
    tarifaFijaId: "aeroparque",
    title: "Traslado a Aeroparque desde CABA y Gran Buenos Aires",
    description:
      "Traslado a Aeroparque Jorge Newbery desde CABA y Gran Buenos Aires. Cotizá al instante, puntualidad para vuelos de cabotaje y factura C.",
    intro: [
      "Para vuelos de cabotaje y viajes de trabajo que salen temprano. Cotizás antes de viajar y te confirmamos el precio por WhatsApp.",
      "Si viajás seguido por trabajo, pedí factura C (es la única que emitimos) y reservá los viajes de ida y vuelta juntos.",
    ],
    faqs: [
      {
        pregunta: "¿Con cuánta anticipación tengo que reservar?",
        respuesta:
          "Con un día de anticipación te aseguramos el horario. Para el mismo día escribinos por WhatsApp y te confirmamos disponibilidad.",
      },
      {
        pregunta: "¿Hacen factura?",
        respuesta: "Hacemos solo factura C, no emitimos factura A. Pasanos los datos de facturación al reservar.",
      },
    ],
  },
  {
    slug: "aeropuerto-san-fernando",
    destino: "Aeropuerto San Fernando",
    destinoCompleto: "Aeropuerto Internacional de San Fernando",
    traslado: "Traslado al Aeropuerto de San Fernando",
    punto: { lat: -34.4532, lon: -58.5862 },
    km: 29,
    minutos: 40,
    title: "Traslado al Aeropuerto de San Fernando desde CABA",
    description:
      "Traslado al Aeropuerto de San Fernando para vuelos privados, ejecutivos y chárter, desde CABA y Gran Buenos Aires. Cotizá al instante y reservá por WhatsApp.",
    intro: [
      "El aeropuerto de San Fernando concentra la aviación ejecutiva y los vuelos privados de Buenos Aires. Te buscamos en tu casa, en el hotel o en la oficina y te dejamos en la terminal con el tiempo que pida tu vuelo.",
      "Desde el centro de CABA son unos 29 km por Panamericana y Avenida del Libertador. A la vuelta pasanos la hora estimada de llegada: si el vuelo se demora, la espera no se cobra.",
    ],
    faqs: [
      {
        pregunta: "¿Hacen traslados entre San Fernando y Ezeiza o Aeroparque?",
        respuesta:
          "Sí. Si tenés una conexión entre aeropuertos, cargá los dos en el cotizador y te mostramos el precio aproximado del tramo.",
      },
      {
        pregunta: "¿Qué datos del vuelo tengo que pasar?",
        respuesta:
          "La hora a la que sale o aterriza el vuelo y, si lo tenés, la matrícula o el número de vuelo. Lo cargás en el mismo formulario de reserva.",
      },
    ],
  },
  {
    slug: "pilar",
    destino: "Pilar",
    destinoCompleto: "Pilar, Buenos Aires",
    punto: { lat: -34.4587, lon: -58.9142 },
    km: 58,
    minutos: 55,
    title: "Traslado a Pilar desde CABA y Gran Buenos Aires",
    description:
      "Traslado a Pilar, parques industriales y barrios cerrados desde CABA y Gran Buenos Aires. Peajes incluidos, factura C y reserva por WhatsApp.",
    intro: [
      "Por Panamericana, ramal Pilar: unos 58 km desde el centro de CABA. Viajamos a oficinas y parques industriales para reuniones o visitas a planta, y a barrios cerrados y countries.",
      "Si entrás a un barrio cerrado o a un parque industrial, pasanos al reservar el nombre y quién autoriza el ingreso, así no perdemos tiempo en la guardia.",
    ],
    faqs: [
      {
        pregunta: "¿Pueden entrar a barrios cerrados y parques industriales?",
        respuesta:
          "Sí. Avisanos el nombre del barrio o del parque y los datos de la persona que autoriza el ingreso. Lo dejamos cargado en la reserva.",
      },
      {
        pregunta: "¿Cuánto sale ir a Pilar?",
        respuesta:
          "Se calcula por kilómetro desde donde salís, con peajes incluidos. El cotizador de esta página te da el precio aproximado y te lo confirmamos por WhatsApp.",
      },
    ],
  },
  {
    slug: "tigre",
    destino: "Tigre",
    destinoCompleto: "Tigre, Buenos Aires",
    punto: { lat: -34.4255, lon: -58.5797 },
    km: 32,
    minutos: 45,
    title: "Traslado a Tigre y Nordelta desde CABA",
    description:
      "Traslado a Tigre, Nordelta y la Estación Fluvial desde CABA y Gran Buenos Aires. Hasta 4 pasajeros con equipaje, peajes incluidos.",
    intro: [
      "Unos 32 km desde el centro de CABA. Te dejamos en la Estación Fluvial para tomar la lancha al Delta, en el Puerto de Frutos, en Nordelta o en cualquier barrio del partido de Tigre.",
      "Si vas a una isla del Delta con equipaje o provisiones, avisanos cuántos bultos llevan y coordinamos el horario con la salida de la lancha.",
    ],
    faqs: [
      {
        pregunta: "¿Me dejan en la Estación Fluvial para tomar la lancha?",
        respuesta:
          "Sí. Pasanos el horario de la lancha al reservar y calculamos la salida para que llegues con margen.",
      },
      {
        pregunta: "¿Llegan a Nordelta y a los barrios cerrados de la zona?",
        respuesta:
          "Sí. Indicá el barrio y quién autoriza el ingreso cuando completes la reserva.",
      },
    ],
  },
  {
    slug: "lujan",
    destino: "Luján",
    destinoCompleto: "Luján, Buenos Aires",
    punto: { lat: -34.5631, lon: -59.1208 },
    km: 78,
    minutos: 75,
    title: "Traslado a Luján desde CABA y Gran Buenos Aires",
    description:
      "Viaje a Luján y la Basílica desde CABA y Gran Buenos Aires, ida y vuelta en el día. Chevrolet Spin para 4 pasajeros, peajes incluidos.",
    intro: [
      "Por Acceso Oeste, unos 78 km desde el centro de CABA. Viajes a la Basílica, visitas familiares, trámites o trabajo en Luján y alrededores.",
      "Si querés ir y volver en el día, reservá los dos tramos juntos: te llevamos, te esperamos el tiempo que necesites y lo sumamos al precio.",
    ],
    faqs: [
      {
        pregunta: "¿Nos pueden esperar mientras visitamos la Basílica?",
        respuesta:
          "Sí. Avisanos al reservar cuánto tiempo estimás y te pasamos el precio de ida, espera y vuelta.",
      },
      {
        pregunta: "¿Hay peajes en el camino?",
        respuesta: "Sí, los de Acceso Oeste. Ya están incluidos en el precio del cotizador.",
      },
    ],
  },
  {
    slug: "mar-del-plata",
    destino: "Mar del Plata",
    destinoCompleto: "Mar del Plata, Buenos Aires",
    punto: { lat: -38.0055, lon: -57.5426 },
    km: 404,
    minutos: 270,
    title: "Traslado a Mar del Plata en auto particular",
    description:
      "Viaje de Buenos Aires a Mar del Plata puerta a puerta en Chevrolet Spin para hasta 4 pasajeros. Cotizá el precio al instante y reservá por WhatsApp.",
    intro: [
      "Puerta a puerta por Ruta 2, sin escalas en terminales ni horarios de micro. Son unas cuatro horas y media de viaje, con parada si la necesitás.",
      "Sirve para viajes de trabajo, para llegar con todo el equipaje a la costa o para volver con la familia completa en un solo auto.",
    ],
    faqs: [
      {
        pregunta: "¿El precio incluye peajes?",
        respuesta:
          "Sí. El precio del cotizador ya incluye los peajes de Ruta 2.",
      },
      {
        pregunta: "¿Se puede contratar ida y vuelta?",
        respuesta:
          "Sí. Indicalo al reservar con las dos fechas y te pasamos un precio por el viaje completo.",
      },
    ],
  },
  {
    slug: "la-plata",
    destino: "La Plata",
    destinoCompleto: "La Plata, Buenos Aires",
    punto: { lat: -34.9214, lon: -57.9545 },
    km: 50,
    minutos: 50,
    title: "Traslado a La Plata",
    description:
      "Traslado a La Plata desde CABA y Gran Buenos Aires para reuniones, trámites y viajes de trabajo. Cotizá al instante y reservá por WhatsApp.",
    intro: [
      "Para reuniones, trámites en organismos provinciales o visitas a clientes. Te llevamos y, si hace falta, te esperamos para la vuelta.",
    ],
    faqs: [
      {
        pregunta: "¿Pueden esperarme mientras hago un trámite?",
        respuesta:
          "Sí. Avisanos al reservar cuánto tiempo estimás y lo sumamos al precio de ida y vuelta.",
      },
    ],
  },
  {
    slug: "rosario",
    destino: "Rosario",
    destinoCompleto: "Rosario, Santa Fe",
    punto: { lat: -32.9442, lon: -60.6505 },
    km: 320,
    minutos: 210,
    title: "Traslado a Rosario en auto particular",
    description:
      "Viaje de Buenos Aires a Rosario puerta a puerta para trabajo o familia. Chevrolet Spin para 4 pasajeros, precio al instante.",
    intro: [
      "Por autopista Buenos Aires–Rosario, unas tres horas y media puerta a puerta. Una opción cómoda para viajes de trabajo de ida y vuelta en el día.",
    ],
    faqs: [
      {
        pregunta: "¿Se puede ir y volver en el día?",
        respuesta:
          "Sí. Reservá ida y vuelta con el horario de regreso y te pasamos el precio del día completo.",
      },
    ],
  },
];

export function tituloTraslado(r: Ruta) {
  return r.traslado ?? `Traslado a ${r.destino}`;
}

export function rutaPorSlug(slug: string) {
  return rutas.find((r) => r.slug === slug);
}

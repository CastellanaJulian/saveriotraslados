// Páginas por destino (SEO). Cada una genera /traslados/[slug].
// km y minutos son aproximados desde el centro de CABA. ⚠️ Revisar textos y valores con Saverio.

import type { Punto } from "./tarifas";

export type Ruta = {
  slug: string;
  destino: string; // nombre corto, ej. "Mar del Plata"
  destinoCompleto: string; // como se carga en el cotizador
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
      "Te buscamos en tu casa o en la oficina y te dejamos en la terminal que corresponda a tu vuelo. Desde CABA tiene una tarifa de referencia con el peaje incluido; desde el resto del Gran Buenos Aires se calcula por kilómetro. Te confirmamos el precio por WhatsApp.",
      "Para vuelos internacionales conviene salir con tres horas de margen. Si salís temprano a la mañana, reservá el día anterior y te confirmamos por WhatsApp con el auto y la patente.",
      "A la vuelta seguimos tu vuelo: si aterriza tarde, la espera no se cobra.",
    ],
    faqs: [
      {
        pregunta: "¿Cuánto sale un traslado a Ezeiza?",
        respuesta:
          "Desde CABA tiene una tarifa de referencia con peaje incluido. Desde el Gran Buenos Aires se calcula por kilómetro. El cotizador de esta página te muestra el valor aproximado y te lo confirmamos al reservar.",
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
      "Si viajás seguido por trabajo, pedí factura y reservá los viajes de ida y vuelta juntos.",
    ],
    faqs: [
      {
        pregunta: "¿Con cuánta anticipación tengo que reservar?",
        respuesta:
          "Con un día de anticipación te aseguramos el horario. Para el mismo día escribinos por WhatsApp y te confirmamos disponibilidad.",
      },
      {
        pregunta: "¿Hacen factura?",
        respuesta: "Sí, factura C. Pasanos los datos de facturación al reservar.",
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
          "Los peajes de Ruta 2 se suman al precio aproximado del cotizador. Te los detallamos al confirmar la reserva.",
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

export function rutaPorSlug(slug: string) {
  return rutas.find((r) => r.slug === slug);
}

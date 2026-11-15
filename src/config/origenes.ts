// Páginas por zona de salida (SEO local). Cada una genera /desde/[slug].
// km medidos con OpenRouteService desde el centro de la localidad; minutos con margen de tránsito.

import type { Punto } from "./tarifas";

export type Origen = {
  slug: string;
  nombre: string; // ej. "Castelar"
  nombreCompleto: string; // como se carga en el cotizador
  punto: Punto;
  cercanos: string[]; // barrios vecinos que también se atienden rápido
  title: string;
  description: string;
  intro: string[];
  faqs: { pregunta: string; respuesta: string }[];
  // Distancia real a cada destino de config/rutas.ts (por slug).
  destinos: { slug: string; km: number; minutos: number }[];
};

export const origenes: Origen[] = [
  {
    slug: "castelar",
    nombre: "Castelar",
    nombreCompleto: "Castelar, Buenos Aires",
    punto: { lat: -34.6519, lon: -58.6447 },
    cercanos: ["Morón", "Haedo", "Ituzaingó", "Ramos Mejía"],
    title: "Traslados desde Castelar a Ezeiza y Aeroparque",
    description:
      "Traslados desde Castelar, Morón, Haedo e Ituzaingó a Ezeiza, Aeroparque y el interior. Precio por km con peajes incluidos y reserva por WhatsApp.",
    intro: [
      "Salimos desde Castelar, así que en Castelar, Morón, Haedo, Ituzaingó y Ramos Mejía te buscamos sin recorrer media ciudad antes. Te pasamos a buscar por tu casa y te llevamos al aeropuerto, a la terminal o a otra ciudad.",
      "Desde la zona oeste el precio se calcula por kilómetro, con peajes incluidos. Cargá tu dirección en el cotizador para ver el valor aproximado y te lo confirmamos por WhatsApp.",
    ],
    faqs: [
      {
        pregunta: "¿Me buscan en Morón, Haedo, Ituzaingó o Ramos Mejía?",
        respuesta:
          "Sí. Estamos en Castelar y llegamos rápido a toda la zona. Cargá tu dirección en el cotizador y ves el precio desde tu casa.",
      },
      {
        pregunta: "¿Hacen viajes de madrugada al aeropuerto?",
        respuesta:
          "Sí. Reservá con anticipación con la hora de tu vuelo y te confirmamos el horario de salida por WhatsApp.",
      },
    ],
    destinos: [
      { slug: "aeropuerto-ezeiza", km: 36, minutos: 45 },
      { slug: "aeroparque", km: 35, minutos: 50 },
      { slug: "aeropuerto-san-fernando", km: 28, minutos: 45 },
      { slug: "pilar", km: 40, minutos: 45 },
      { slug: "tigre", km: 41, minutos: 50 },
      { slug: "lujan", km: 52, minutos: 50 },
      { slug: "la-plata", km: 84, minutos: 80 },
      { slug: "mar-del-plata", km: 443, minutos: 300 },
      { slug: "rosario", km: 294, minutos: 200 },
    ],
  },
];

export function origenPorSlug(slug: string) {
  return origenes.find((o) => o.slug === slug);
}

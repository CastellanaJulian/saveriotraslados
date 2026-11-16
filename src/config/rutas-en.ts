// Páginas en inglés (/en/...) para pasajeros que llegan del exterior.
// Reusan punto, km, minutos, tarifa y origen de la página en español (esSlug) y suman textos propios.
// ⚠️ Datos confirmados por Julian (2026-11-15): pago en dólares a US$1 por km. No prometer chofer que hable inglés.

import { rutas, type Ruta } from "./rutas";
import { usdDeTarifaFija } from "./tarifas";

const usdEzeiza = `US$${usdDeTarifaFija(80000)}`;
const usdAeroparque = `US$${usdDeTarifaFija(30000)}`;

export type RutaEn = {
  slug: string; // URL: /en/{slug}
  esSlug: string; // página equivalente en español: /traslados/{esSlug}
  titulo: string; // h1
  destino: string; // nombre corto para listas
  title: string;
  description: string;
  intro: string[];
  faqs: { pregunta: string; respuesta: string }[];
};

export const rutasEn: RutaEn[] = [
  {
    slug: "ezeiza-airport-transfer",
    esSlug: "aeropuerto-ezeiza",
    titulo: "Ezeiza Airport transfer",
    destino: "Ezeiza Airport (EZE)",
    title: "Ezeiza Airport Transfer to Buenos Aires City",
    description:
      "Private transfer between Ezeiza Airport (EZE) and Buenos Aires. Fixed fare from the city, tolls included, up to 4 passengers, free waiting if your flight is late.",
    intro: [
      "We pick you up at arrivals in Ezeiza and drive you straight to your hotel or apartment, or from your address to the right terminal for your flight. The car is just for you: up to 4 passengers with luggage, no shared shuttle and no stops for other people.",
      "Trips between Ezeiza and the City of Buenos Aires have a fixed reference fare with tolls included. From Greater Buenos Aires the price is per kilometer. You can pay in pesos or in US dollars.",
      "Send us your flight number when you book. We follow the flight, and if it lands late, the waiting time is free.",
    ],
    faqs: [
      {
        pregunta: "How much is a transfer from Ezeiza to Buenos Aires city?",
        respuesta:
          `ARS 80,000 (about ${usdEzeiza}) to anywhere in the City of Buenos Aires, tolls included. The price is per car, not per person. We confirm it on WhatsApp when you book.`,
      },
      {
        pregunta: "Can I pay in US dollars?",
        respuesta:
          `Yes. From the city to Ezeiza it's about ${usdEzeiza}, and other trips are US$1 per km. We also take pesos, bank transfer, Mercado Pago and cards (card payments may carry interest).`,
      },
      {
        pregunta: "Where do we meet at the airport?",
        respuesta:
          "We confirm the meeting point on WhatsApp before you land, with the driver's name, the car and the license plate. Message us when you have your bags.",
      },
      {
        pregunta: "What if my flight is delayed?",
        respuesta: "We track your flight with the number you send us. If it's late, we wait at no extra cost.",
      },
      {
        pregunta: "How much luggage fits?",
        respuesta:
          "With 4 passengers, up to 3 large suitcases and 4 carry-ons. If you bring more, tell us when you book and we add a second car if needed.",
      },
    ],
  },
  {
    slug: "aeroparque-airport-transfer",
    esSlug: "aeroparque",
    titulo: "Aeroparque Airport transfer",
    destino: "Aeroparque (AEP)",
    title: "Aeroparque Airport Transfer in Buenos Aires",
    description:
      "Private transfer to and from Aeroparque (AEP), the domestic airport of Buenos Aires. Fixed fare from the city, tolls included, up to 4 passengers.",
    intro: [
      "Aeroparque Jorge Newbery is the airport for domestic flights (Iguazú, Bariloche, Mendoza, Salta, El Calafate) and some regional ones. It sits by the river, close to Palermo.",
      "Trips between Aeroparque and the City of Buenos Aires have a fixed reference fare with tolls included. You book here in a minute and we confirm the price, driver and car on WhatsApp.",
    ],
    faqs: [
      {
        pregunta: "How much is a transfer to Aeroparque?",
        respuesta:
          `ARS 30,000 (about ${usdAeroparque}) from anywhere in the City of Buenos Aires, tolls included. From Greater Buenos Aires the price is per kilometer. We confirm it on WhatsApp when you book.`,
      },
      {
        pregunta: "How early should I book?",
        respuesta:
          "Booking one day ahead secures your time. For the same day, message us on WhatsApp and we confirm availability.",
      },
      {
        pregunta: "Can I pay in US dollars?",
        respuesta:
          "Yes. We take cash in pesos or US dollars, bank transfer, Mercado Pago and cards. Card payments may carry interest.",
      },
    ],
  },
  {
    slug: "ezeiza-aeroparque-transfer",
    esSlug: "ezeiza-aeroparque",
    titulo: "Transfer between Ezeiza and Aeroparque",
    destino: "Ezeiza ↔ Aeroparque",
    title: "Transfer between Ezeiza and Aeroparque",
    description:
      `Transfer between Ezeiza (EZE) and Aeroparque (AEP) for connecting flights. Up to 4 passengers with luggage, ARS 80,000 (about ${usdEzeiza}), tolls included.`,
    intro: [
      "Most international flights land in Ezeiza and most domestic flights leave from Aeroparque, so a connection in Buenos Aires usually means crossing the city. We wait for you with your flight time and drive straight to the other airport.",
      "It's about 40 km: between 40 minutes and an hour with normal traffic. The price is per car, so up to 4 passengers with their bags travel for the same fare.",
      "If your first flight is late, we follow the arrival time and the waiting is free.",
    ],
    faqs: [
      {
        pregunta: "How much is the transfer between Ezeiza and Aeroparque?",
        respuesta:
          `ARS 80,000 (about ${usdEzeiza}) with tolls included, in either direction and at any time of day. It's per car: up to 4 passengers pay the same price.`,
      },
      {
        pregunta: "How much time should I leave between flights?",
        respuesta:
          "Add the time for immigration and baggage at the arrival airport, about an hour of driving, and the check-in time your airline asks for at the other airport. If the connection is tight, tell us and we leave as soon as you have your bags.",
      },
      {
        pregunta: "Can we stop at a hotel on the way?",
        respuesta: "Yes. Tell us when you book or enter the hotel as your destination; the price depends on the route.",
      },
    ],
  },
];

export function rutaEnPorSlug(slug: string) {
  return rutasEn.find((r) => r.slug === slug);
}

// Página en español de la misma ruta (para datos y hreflang).
export function rutaEs(r: RutaEn): Ruta {
  return rutas.find((x) => x.slug === r.esSlug)!;
}

// Página en inglés de una ruta en español, si existe.
export function rutaEnDe(esSlug: string) {
  return rutasEn.find((r) => r.esSlug === esSlug);
}

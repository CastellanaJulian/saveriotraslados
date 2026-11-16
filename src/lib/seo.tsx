import { sitio } from "@/config/sitio";

export const faqsGenerales = [
  {
    pregunta: "¿Cómo se calcula el precio?",
    respuesta:
      "Ezeiza y Aeroparque tienen una tarifa de referencia desde CABA. El resto de los viajes se calcula por kilómetro recorrido. Todos los precios incluyen peajes. El cotizador te da un precio aproximado y te lo confirmamos por WhatsApp antes del viaje.",
  },
  {
    pregunta: "¿Es un taxi o un remis?",
    respuesta:
      "Es un taxi con licencia de la Ciudad de Buenos Aires y chofer profesional. Lo reservás con anticipación y te confirmamos el precio, el auto y la patente por WhatsApp.",
  },
  {
    pregunta: "¿Cobran recargo de noche?",
    respuesta: "No. El precio es el mismo a cualquier hora, también en viajes de madrugada.",
  },
  {
    pregunta: "¿Hacen factura?",
    respuesta: "Hacemos solo factura C, no emitimos factura A. Pasanos los datos de facturación al reservar.",
  },
  {
    pregunta: "¿Cómo pago el viaje?",
    respuesta: `${sitio.pagos} ${sitio.pagosNota}`,
  },
  {
    pregunta: "¿Cuántas personas y valijas entran?",
    respuesta: `Viajamos en un ${sitio.auto.modelo} para hasta ${sitio.auto.pasajeros} pasajeros con ${sitio.auto.equipaje}${sitio.auto.wifi ? ", con WiFi a bordo" : ""}. Si son más o llevan más equipaje, sumamos otro chofer con su auto propio: avisanos al reservar.`,
  },
  {
    pregunta: "¿Cómo confirmo la reserva?",
    respuesta:
      "Completás tus datos en el cotizador y se abre WhatsApp con el viaje cargado. Te confirmamos por ahí el precio, el chofer, el auto y la patente.",
  },
];

// Datos del negocio para Google. Sin horario: es un negocio con zona de servicio y no se publica
// atención 24 h (Julian, 2026-11-15). idioma "en" = descripción en inglés para la versión /en.
export function jsonLdNegocio(idioma: "es" | "en" = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${sitio.url}/#negocio`,
    name: sitio.nombre,
    alternateName: "Saverio",
    description:
      idioma === "en"
        ? "Private airport transfers in Buenos Aires: Ezeiza (EZE) and Aeroparque (AEP). Licensed taxi, brand-new car for up to 4 passengers. Pay in pesos or US dollars."
        : "Traslados a Ezeiza, Aeroparque y viajes de media distancia desde CABA y Gran Buenos Aires, en auto 0 km para hasta 4 pasajeros.",
    url: sitio.url,
    logo: `${sitio.url}/apple-icon`,
    image: [`${sitio.url}/opengraph-image`, ...sitio.choferes.flatMap((c) => (c.foto ? [`${sitio.url}${c.foto}`] : []))],
    ...(sitio.redes.length ? { sameAs: sitio.redes } : {}),
    telephone: sitio.telefonoLink,
    priceRange: "$$",
    paymentAccepted:
      "Efectivo en pesos o dólares, transferencia, Mercado Pago, tarjeta de crédito, tarjeta de débito",
    currenciesAccepted: "ARS, USD",
    ...(sitio.auto.wifi
      ? { amenityFeature: { "@type": "LocationFeatureSpecification", name: "WiFi a bordo", value: true } }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    geo: { "@type": "GeoCoordinates", latitude: sitio.base.lat, longitude: sitio.base.lon },
    areaServed: [
      { "@type": "City", name: "Ciudad Autónoma de Buenos Aires" },
      { "@type": "AdministrativeArea", name: "Gran Buenos Aires" },
      {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: sitio.base.lat,
        longitude: sitio.base.lon,
      },
      geoRadius: 45000,
      },
    ],
  };
}

// Nombre del sitio en los resultados de Google (en vez de la URL).
export function jsonLdSitio() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${sitio.url}/#sitio`,
    name: sitio.nombre,
    alternateName: ["Saverio", "saveriotraslados.com.ar"],
    url: sitio.url,
    inLanguage: "es-AR",
    publisher: { "@id": `${sitio.url}/#negocio` },
  };
}

export function jsonLdFaq(faqs: { pregunta: string; respuesta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Preguntas generales de la versión en inglés (/en). Solo datos confirmados.
export const faqsEn = [
  {
    pregunta: "How is the price calculated?",
    respuesta:
      "Ezeiza and Aeroparque have a fixed reference fare to and from the City of Buenos Aires. Other trips are priced per kilometer: ARS 1,500 or US$1 per km. Tolls are always included. The quote is approximate and we confirm it on WhatsApp before the trip.",
  },
  {
    pregunta: "Can I pay in US dollars?",
    respuesta: `Yes. ${sitio.payments} ${sitio.paymentsNote}`,
  },
  {
    pregunta: "Is this a licensed taxi?",
    respuesta:
      "Yes. It's a licensed taxi of the City of Buenos Aires, with passenger insurance and a driver with a professional license.",
  },
  {
    pregunta: "Is there a night surcharge?",
    respuesta: "No. Early-morning and late-night trips cost the same.",
  },
  {
    pregunta: "How many people and bags fit?",
    respuesta: `Up to ${sitio.auto.pasajeros} passengers with ${sitio.auto.valijas} large suitcases and ${sitio.auto.valijasMano} carry-ons. For bigger groups we add a second driver with his own car: tell us when you book.`,
  },
  {
    pregunta: "How do I confirm my booking?",
    respuesta:
      "Fill in your details in the quote form and WhatsApp opens with your trip. We reply there to confirm the price, the driver, the car and the license plate. Nothing is paid online.",
  },
];

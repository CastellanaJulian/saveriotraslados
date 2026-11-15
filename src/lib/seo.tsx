import { sitio } from "@/config/sitio";

export const faqsGenerales = [
  {
    pregunta: "¿Cómo se calcula el precio?",
    respuesta:
      "Ezeiza y Aeroparque tienen una tarifa de referencia desde CABA. El resto de los viajes se calcula por kilómetro recorrido. Todos los precios incluyen peajes. El cotizador te da un precio aproximado y te lo confirmamos por WhatsApp antes del viaje.",
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
    respuesta: `Viajamos en una ${sitio.auto.modelo} para hasta ${sitio.auto.pasajeros} pasajeros. Si llevan mucho equipaje, avisanos al reservar.`,
  },
  {
    pregunta: "¿Cómo confirmo la reserva?",
    respuesta:
      "Completás tus datos en el cotizador y se abre WhatsApp con el viaje cargado. Te confirmamos por ahí el precio, el chofer, el auto y la patente.",
  },
];

export function jsonLdNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${sitio.url}/#negocio`,
    name: sitio.nombre,
    alternateName: "Saverio",
    description:
      "Traslados a Ezeiza, Aeroparque y viajes de media distancia desde CABA y Gran Buenos Aires, en Chevrolet Spin para hasta 4 pasajeros.",
    url: sitio.url,
    logo: `${sitio.url}/apple-icon`,
    image: [`${sitio.url}/opengraph-image`, ...sitio.choferes.flatMap((c) => (c.foto ? [`${sitio.url}${c.foto}`] : []))],
    ...(sitio.redes.length ? { sameAs: sitio.redes } : {}),
    telephone: sitio.telefonoLink,
    priceRange: "$$",
    paymentAccepted: "Efectivo, transferencia, Mercado Pago, tarjeta de crédito, tarjeta de débito",
    currenciesAccepted: "ARS",
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
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

import { sitio } from "@/config/sitio";
import { zonas } from "@/config/tarifas";

export const faqsGenerales = [
  {
    pregunta: "¿Cómo se calcula el precio?",
    respuesta:
      "Los aeropuertos tienen una tarifa de referencia desde el AMBA. El resto de los viajes se calcula por kilómetro recorrido. El cotizador te da un precio aproximado y te lo confirmamos por WhatsApp antes del viaje.",
  },
  {
    pregunta: "¿Hacen factura?",
    respuesta: "Sí, factura C. Pasanos los datos de facturación al reservar.",
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
    url: sitio.url,
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
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: zonas.amba.centro.lat,
        longitude: zonas.amba.centro.lon,
      },
      geoRadius: zonas.amba.radioKm * 1000,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
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

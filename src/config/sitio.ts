// Datos del negocio. ⚠️ Los marcados con EJEMPLO hay que reemplazarlos por los reales antes de publicar.

export const sitio = {
  nombre: "Saverio Traslados",
  url: "https://saveriotraslados.com.ar",
  // EJEMPLO: zona desde donde sale. Se usa en títulos y textos SEO.
  zona: "Zona Sur",
  zonaCompleta: "Zona Sur, Buenos Aires",
  // EJEMPLO: punto de referencia para ordenar resultados de búsqueda de direcciones.
  base: { lat: -34.7608, lon: -58.4065 },
  // EJEMPLO: teléfono en formato visible y en formato internacional para WhatsApp (sin + ni espacios).
  telefono: "11 5555-0000",
  telefonoLink: "+5491155550000",
  whatsapp: "5491155550000",
  chofer: "Saverio",
  auto: {
    modelo: "Chevrolet Spin",
    color: "gris", // EJEMPLO
    patente: "AB 123 CD", // EJEMPLO
    pasajeros: 6,
    valijas: 5, // EJEMPLO: confirmar cuántas entran
  },
  // EJEMPLO: confirmar cada punto con Saverio. Solo publicar lo que sea cierto.
  condiciones: [
    "Precio cerrado antes de viajar",
    "Si el vuelo se atrasa, la espera no se cobra",
    "Factura A o B",
    "Vuelos de madrugada",
  ],
  // Confirmado por Julian: se acepta cualquier medio de pago; con tarjeta en cuotas puede haber interés.
  pagos: "Aceptamos todos los medios de pago: efectivo, transferencia, Mercado Pago y tarjetas.",
  pagosNota: "Con tarjeta en cuotas puede haber interés.",
  // Reseñas reales de Google. Vacío = la sección no se muestra. Nunca inventar reseñas.
  resenas: [] as { texto: string; autor: string; fecha: string }[],
} as const;

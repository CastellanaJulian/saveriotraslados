// Datos del negocio. ⚠️ Los marcados con EJEMPLO hay que reemplazarlos por los reales antes de publicar.

export const sitio = {
  nombre: "Saverio Traslados",
  url: "https://saveriotraslados.com.ar",
  // Zona de servicio: todo Buenos Aires (CABA y Gran Buenos Aires), sin acotar a una zona.
  zona: "Buenos Aires",
  zonaCompleta: "CABA y Gran Buenos Aires",
  // Punto de referencia para ordenar resultados de búsqueda de direcciones (centro de CABA).
  base: { lat: -34.6037, lon: -58.3816 },
  telefono: "11 5107-7099",
  telefonoLink: "+5491151077099",
  whatsapp: "5491151077099",
  // Equipo de choferes. Se muestran en el bloque "Nuestros choferes".
  choferes: [{ nombre: "Javier Castellana" }],
  auto: {
    modelo: "Chevrolet Spin",
    color: "gris", // EJEMPLO
    patente: "AB 123 CD", // EJEMPLO
    pasajeros: 4,
    valijas: 4, // EJEMPLO: confirmar cuántas entran
  },
  // EJEMPLO: confirmar cada punto. Solo publicar lo que sea cierto.
  condiciones: [
    "Te confirmamos el precio por WhatsApp",
    "Si el vuelo se atrasa, la espera no se cobra",
    "Factura C",
    "Vuelos de madrugada",
  ],
  // Se acepta cualquier medio de pago; con tarjeta en cuotas puede haber interés.
  pagos: "Aceptamos todos los medios de pago: efectivo, transferencia, Mercado Pago y tarjetas.",
  pagosNota: "Con tarjeta en cuotas puede haber interés.",
  // Reseñas reales de Google. Vacío = la sección no se muestra. Nunca inventar reseñas.
  resenas: [] as { texto: string; autor: string; fecha: string }[],
} as const;

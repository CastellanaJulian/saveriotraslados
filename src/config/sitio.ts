// Datos del negocio. ⚠️ Los marcados con EJEMPLO hay que reemplazarlos por los reales antes de publicar.

export const sitio = {
  nombre: "Saverio Traslados",
  // URL pública (canonical, sitemap, datos estructurados). Orden:
  // 1) NEXT_PUBLIC_SITE_URL si se define a mano en Vercel.
  // 2) El dominio de producción del proyecto en Vercel (cambia solo al conectar saveriotraslados.com.ar).
  // 3) El dominio previsto.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://saveriotraslados.com.ar"),
  // Zona de servicio: todo Buenos Aires (CABA y Gran Buenos Aires), sin acotar a una zona.
  zona: "Buenos Aires",
  zonaCompleta: "CABA y Gran Buenos Aires",
  // Punto de referencia para ordenar resultados de búsqueda de direcciones (centro de CABA).
  base: { lat: -34.6037, lon: -58.3816 },
  // TEMPORAL (2026-11-15): WhatsApp de Julian para medir las consultas; él se las pasa a su papá.
  // El del negocio es 11 5107-7099 (+5491151077099). Volver a ese antes de crear el Perfil de Google.
  telefono: "11 5801-7970",
  telefonoLink: "+5491158017970",
  whatsapp: "5491158017970",
  // Equipo de choferes. Se muestran en el bloque "Nuestros choferes".
  // foto: archivo en /public (null = sin foto).
  choferes: [{ nombre: "Javier Castellana", foto: "/javier-castellana.jpg" as string | null }],
  auto: {
    modelo: "Chevrolet Spin",
    color: "gris", // EJEMPLO
    patente: "AB 123 CD", // EJEMPLO
    pasajeros: 4,
    valijas: 4, // EJEMPLO: confirmar cuántas entran
  },
  // Se acepta cualquier medio de pago; con tarjeta (en cuotas o no) puede haber interés.
  pagos: "Aceptamos todos los medios de pago: efectivo, transferencia, Mercado Pago y tarjetas.",
  pagosNota: "Con tarjeta puede haber interés.",
  // Perfiles oficiales (Perfil de Empresa de Google, Instagram, Facebook). Se publican en los
  // datos estructurados (sameAs) para que Google relacione todo con el mismo negocio.
  redes: [] as string[],
  // Reseñas reales de Google. Vacío = la sección no se muestra. Nunca inventar reseñas.
  resenas: [] as { texto: string; autor: string; fecha: string }[],
} as const;

# Saverio Traslados — Sitio web de traslados

## Contexto
- Negocio familiar: el papá de Julian maneja una **Chevrolet Spin** (hasta 6 pasajeros + equipaje) y hoy la usa como taxi.
- Objetivo: sumar **viajes de media distancia** y **traslados empresariales**.
- El sitio cumple tres funciones: **hacer conocer el servicio (SEO)**, **cotizar** y **reservar**.
- Hosting: **Vercel**.

## Etapa actual
**3) Desarrollo** (2026-11-15). Julian validó la dirección visual (boceto estilo app, negro + amarillo) y pidió armar la página. Datos reales (zona, precios, teléfono, patente, reseñas) siguen pendientes: se usan valores de ejemplo marcados en `config/`.
Etapas: Descubrimiento → Diseño (wireframes → alta fidelidad → prototipo estático) → Desarrollo y testeo → Producción.

## Prioridades (en orden)
1. SEO (define la arquitectura de páginas antes que el contenido).
2. Cotizador con cálculo de km entre dos puntos + tarifas fijas por zona.
3. Reservas.
4. Diseño propio pensado para el público (nada de plantilla genérica).

## Nombre y dominio
- **Nombre definido (2026-11-15): "Saverio Traslados".** Usar exactamente este nombre en el sitio, el Perfil de Empresa de Google, Instagram y WhatsApp Business (consistencia de nombre, dirección y teléfono).
  - Por qué: "traslados" cubre aeropuerto, empresas y media distancia; "viajes" compite con agencias de turismo y "remis" implica una habilitación de remis. El nombre real del negocio puede llevar la palabra clave en la ficha de Google; agregarla como relleno está prohibido.
  - No incluir la ciudad en el nombre: va en el contenido de las páginas y en la ficha de Google.
- **Dominio principal: `saveriotraslados.com.ar`**, con `saveriotraslados.com` redirigiendo con 301. **Pendiente de registrar** (la gestión de dominio, redes y ficha de Google se hace más adelante).
- Antes de registrar: chequear que no exista otro "Saverio Traslados" en Google Maps ni en Instagram.
- Chequeo whois del 2026-11-15 (no es reserva, puede cambiar):
  - Libres: `viajessaverio.com.ar`, `saverioviajes.com.ar`, `saveriotraslados.com.ar`, `trasladossaverio.com.ar`, `viajessaverio.com`, `saveriotraslados.com`, `trasladossaverio.com`
  - Ocupado: `saverio.com.ar`
- Recomendación: registrar el `.com.ar` (señal geográfica para Google Argentina, se registra en NIC.ar con clave fiscal) y el `.com` equivalente que redirija 301.

## Estrategia SEO
**Lo que más pesa para un servicio de traslados local, en orden:**
1. **Perfil de Empresa de Google (Google Business Profile)** — aparece en Maps y en el "local pack". Categoría tipo "Servicio de traslado"/"Servicio de chofer". Pedir reseñas a cada pasajero. Mismo nombre/teléfono/zona en sitio y perfil (NAP consistente).
2. **Una página por intención de búsqueda** (programmatic SEO, generadas desde un archivo de datos):
   - `/traslados/aeropuerto-ezeiza`, `/traslados/aeroparque`
   - `/viajes/buenos-aires-a-mar-del-plata`, `/viajes/buenos-aires-a-rosario`, etc. (rutas reales que se hagan)
   - `/empresas` (traslados corporativos, cuenta corriente, factura)
   - Cada página: precio de referencia, km y tiempo estimado, cotizador precargado con origen/destino, FAQ propia. Contenido único por página, no plantilla con el nombre cambiado.
3. **Técnico:**
   - Next.js (App Router) con páginas **estáticas (SSG)** → HTML completo, rapidísimo en Vercel.
   - Core Web Vitals: el mapa y el autocompletado se cargan **solo al interactuar** (lazy), nunca en el primer render.
   - Datos estructurados JSON-LD: `TaxiService`/`LocalBusiness` (zona de servicio, horario, teléfono), `Service` + `Offer` por ruta, `FAQPage`, `BreadcrumbList`.
   - `sitemap.xml`, `robots.txt`, canonical, `lang="es-AR"`, metadatos Open Graph (se comparte mucho por WhatsApp).
   - Search Console desde el día 1.
4. **Palabras clave semilla** (validar con Search Console / Keyword Planner): "traslado a Ezeiza", "remis a Ezeiza", "traslado a Mar del Plata", "chofer para empresas", "traslado aeropuerto zona [barrio]", "viaje a la costa en auto".

## Cotizador (decisión técnica propuesta)
- **Distancia y ruta:** OpenRouteService (basado en OpenStreetMap, software libre, API key gratuita con cupo diario holgado para este volumen). Alternativa a futuro: OSRM auto-hosteado.
- **Autocompletado de direcciones:** Photon/ORS geocoding. Nominatim público **no permite** autocompletado (política de uso), no usarlo para eso. La API Georef de datos.gob.ar sirve para normalizar direcciones argentinas.
- La API key queda del lado del servidor (route handler de Next.js en Vercel) y se cachean las respuestas.
- **Tarifas en código** (archivo `config/tarifas.ts` o similar):
  - Precio por km, mínimo por viaje.
  - Factor de regreso en vacío para media distancia (definir regla).
  - Peajes, espera por hora, recargo nocturno (a definir).
  - **Tarifas fijas por zona** (ej. Ezeiza ↔ AMBA): si origen/destino caen en zonas definidas (polígonos o partidos), se usa el precio fijo en vez del cálculo por km.

## Público y dirección de diseño (a validar en etapa de diseño)
- **Público principal: gente que viaja por trabajo** (aeropuertos, viajes a otras ciudades, a veces paga la empresa). Secundario: familias y grupos de hasta 6.
- Qué necesitan ver: precio claro antes de reservar, confirmación por escrito, factura o comprobante, puntualidad (vuelos temprano, seguimiento del vuelo), chofer identificable, forma de pago simple.
- Diferencial a comunicar: **un chofer con nombre y cara** (no una app), auto amplio, trato directo por WhatsApp.
- **Sensación buscada: confiable y moderna, sin parecer cara.**
  - Evitar señales de lujo (negro y dorado, serif elegante, fotos de stock de ejecutivos) y también lo improvisado (fondo de colores saturados, clipart).
  - Referencia: herramienta bien hecha y clara, tipo check-in de aerolínea.
- ~~"Cartel de ruta" sobrio~~ → descartado por Julian (2026-11-15): se veía muy básico.
- **Dirección vigente: estética de app de viajes (referencia: Uber / Cabify web), limpia y moderna**, sin copiar marca ni tipografía de nadie.
  - **Paleta propia: negro + amarillo taxi porteño** (reemplaza al verde, 2026-11-15). En prueba:
    - Amarillo `#FFC700`: botón principal (con texto negro), marcador de destino, línea de la ruta en el mapa. **Sin resaltar palabras del título** (Julian lo sacó).
    - Logo: provisorio y genérico (texto "Saverio Traslados"); el logo real se diseña después.
    - Amarillo suave `#FFF6CC` (tint): fondo de la tarjeta de precio y de los íconos de destinos frecuentes; texto encima en marrón oscuro `#5C4A00`.
    - Negro `#111`: textos, header, contorno de la ruta.
    - Guiño a la franja a cuadros del taxi: línea fina amarillo/negro bajo el header (usar con medida, solo ahí).
    - Nunca texto amarillo sobre blanco (no se lee).
  - Tipografía Geist (libre), títulos grandes y pesados con letter-spacing negativo.
  - Cotizador tipo app: campos grises rellenos, origen (círculo) y destino (cuadrado) unidos por una línea; chips para fecha/hora y pasajeros; debajo, lista de destinos frecuentes con ícono y precio fijo.
  - Resultado: mini mapa con la ruta, resumen del viaje, precio grande, lo que incluye.
  - **Un solo botón principal** (negro, "Reservar"). WhatsApp va como link secundario de texto; además barra/acción fija de WhatsApp en celular a definir.
  - El título grande de arriba hace de h1 (ej. "Traslados a Ezeiza, Aeroparque y el interior").

## Reglas de diseño y redacción (pedidas por Julian)
- Lo más rápido del sitio es **cotizar**. Desde el resultado se puede **reservar** (botón principal, único) o **consultar por WhatsApp** (link secundario, mensaje precargado con ruta, fecha y precio).
- Prohibido el estilo genérico de IA:
  - Nada de frases tipo "todo en uno", "no es X, es Y", eslóganes vacíos.
  - Nada de patrón título + subtítulo en cada sección.
  - Botones sin flechas ni íconos decorativos; texto con verbo claro ("Reservar", "Escribir por WhatsApp").
- Tono: rioplatense, directo, con datos concretos (km, precio, pasajeros, valijas).
- SEO necesita encabezados semánticos (h1/h2): existen en el HTML pero visualmente discretos o funcionales (ej. el h1 es la etiqueta del cotizador), no títulos de marketing.

## Implementación (estado al 2026-11-15)
- Next.js 16 (App Router, TypeScript, Tailwind 4), **sitio estático** (sin Cache Components). Repo: github.com/CastellanaJulian/saveriotraslados.
- Antes de tocar APIs de Next, leer la doc local en `node_modules/next/dist/docs/` (ver AGENTS.md).
- Configuración editable en `src/config/` (tarifas, datos del sitio, páginas por destino). Valores marcados EJEMPLO.
- Cotizador: `src/components/Cotizador.tsx` (cliente). APIs: `/api/lugares` (Photon) y `/api/ruta` (ORS con `ORS_API_KEY`, si no OSRM demo).
- Mapa del resultado: SVG propio con la geometría del recorrido (sin librería de mapas, para no afectar la velocidad).
- Reserva v1: formulario → abre WhatsApp con todos los datos. Sin base de datos ni pagos online.
- Pagos: se acepta cualquier medio de pago; con tarjeta en cuotas puede haber interés.
- SEO: metadatos por página, JSON-LD (LocalBusiness, TaxiService, FAQPage, BreadcrumbList), sitemap, robots, imagen OG.
- Reseñas: `sitio.resenas` vacío = no se muestra la sección. Nunca inventar reseñas.

## Preguntas abiertas
- ¿Desde qué ciudad/barrio sale?
- ¿Habilitación actual (taxi/remis) y si cubre viajes fuera de la jurisdicción? (Afecta qué se puede ofrecer y publicar.)
- ¿Factura (monotributo)? Importante para empresas.
- Reservas: ¿alcanza con solicitud que llega por WhatsApp/email y él confirma, o se quiere calendario con disponibilidad y seña online?
- Rutas frecuentes reales y tarifas fijas actuales.
- Fotos reales del auto y del chofer.

# Saverio Traslados — Sitio web de traslados

## Contexto
- Negocio familiar: el papá de Julian maneja una Chevrolet Spin y hoy la usa como taxi. **En el sitio no se nombra el modelo: se dice "auto 0 km"** (Julian, 2026-11-15).
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
- **Dominio principal: `saveriotraslados.com.ar`**, con `saveriotraslados.com` redirigiendo con 301. **Comprado en NIC.ar (2026-11-15), delegado a Vercel y funcionando (2026-11-15)**: http y sin www redirigen a https://www.saveriotraslados.com.ar. La URL de prueba saveriotraslados-gold.vercel.app se borró en Vercel (Julian, 2026-11-15).
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
- Publicado en Vercel (conectado al repo, cada push a `main` publica): https://www.saveriotraslados.com.ar. `sitio.url` toma el dominio de producción de Vercel solo (canonical y sitemap).
- Antes de tocar APIs de Next, leer la doc local en `node_modules/next/dist/docs/` (ver AGENTS.md).
- Configuración editable en `src/config/` (tarifas, datos del sitio, páginas por destino). Valores marcados EJEMPLO.
- Cotizador: `src/components/Cotizador.tsx` (cliente). APIs: `/api/lugares` (Photon) y `/api/ruta` (ORS con `ORS_API_KEY`, si no OSRM demo).
- Distancias en producción: OpenRouteService con `ORS_API_KEY` cargada en Vercel (verificado: header `X-Proveedor-Ruta: ors`). Se pide `radiuses: [-1, -1]` porque puntos dentro de predios (Ezeiza) no tienen calle a menos de 350 m. Si ORS falla, respaldo automático a OSRM demo.
- Favicon: taxi amarillo sobre negro (`src/app/icon.svg`); `apple-icon.tsx` lo convierte a PNG para iPhone.
- Foto del chofer: `public/javier-castellana.jpg` (461×552; conviene una más grande si la hay).
- Mapa del resultado: mapa real con MapLibre GL (libre) + teselas OpenFreeMap positron (OSM, sin key). Se importa dinámicamente solo al mostrar el resultado; debajo queda el recorrido en SVG como respaldo. El worker de MapLibre se copia a `public/maplibre/worker.mjs` en `postinstall` (`scripts/copiar-worker-mapa.mjs`, ignorado en git) porque Turbopack no lo resuelve; créditos OSM plegados en el botón "i".
- Reserva v1: sin base de datos ni pagos online. El mensaje de WhatsApp sale con la reserva completa.
  - Cotizador: origen, destino, **fecha, hora y pasajeros obligatorios** (campos visibles), botón "Ver precio". Sin lista de destinos debajo del buscador (Julian la sacó).
  - Fecha y hora con selectores propios (`components/Selectores.tsx`, estilo app de viajes): calendario con días pasados bloqueados y lista de horarios cada 15 min en 24 h. No usar inputs nativos de fecha/hora (se veían mal y el reloj nativo pide a. m./p. m. según el idioma).
  - Resultado: precio + datos de reserva en la misma tarjeta (nombre, valijas, comentarios; si es aeropuerto: número de vuelo opcional y hora en que sale/aterriza el vuelo, obligatoria). El botón "Reservar" abre WhatsApp directo. Link secundario "Solo quiero consultar por WhatsApp".
  - El sentido del aeropuerto (ida/vuelta) se detecta en `aeropuertoDe()` de `lib/cotizar.ts`, con cualquier tarifa.
- Sección "Viajes seguros": seguro para pasajeros, choferes con licencia profesional, vehículos 0 km (confirmado por Julian).
- Pagos: se acepta cualquier medio de pago; con tarjeta (en cuotas o no) puede haber interés.
- Cambios pedidos por Julian (2026-11-15):
  - Zona de servicio: todo CABA y Gran Buenos Aires (no acotar a "Zona Sur").
  - Choferes: bloque "Nuestros choferes"; hoy Javier Castellana (`sitio.choferes`). En el resultado no se nombra chofer: "Te confirmamos chofer, auto y patente".
  - Auto: hasta 4 pasajeros.
  - **Solo factura C** (monotributo): remarcarlo, "no emitimos factura A". No afirmar en el sitio que sirve para deducir impuestos.
  - **Todos los precios incluyen peajes** (cotizador, tarifas, FAQ, JSON-LD).
  - El precio siempre es **aproximado, sujeto a confirmación**. Nunca decir "precio cerrado".
  - El cotizador no calcula solo: se elige origen y destino y se toca **"Ver precio"**.
  - Tarifas de referencia en una sección aparte ("Tarifas aproximadas"), no debajo del buscador.
  - WhatsApp del negocio: +54 9 11 5107-7099. **Temporalmente el sitio usa el de Julian (+54 9 11 5801-7970)** para medir consultas; volver al del negocio antes de cargar el Perfil de Google (mismo teléfono en todos lados).
  - Tarifas reales: $1.500/km; Ezeiza ↔ CABA $80.000; Aeroparque ↔ CABA $30.000 (fijas solo si el otro extremo está dentro de CABA, polígono en `tarifas.ts`; desde el Gran Buenos Aires se cobra por km). Recargo nocturno y regreso en vacío: no se cobran (confirmado). El mínimo de $15.000 sigue de ejemplo.
- SEO: metadatos por página, JSON-LD (WebSite con nombre del sitio, LocalBusiness con logo/imagen/zonas/sameAs, TaxiService, FAQPage, BreadcrumbList), sitemap con fecha, robots, imagen OG general y una por destino (`traslados/[slug]/opengraph-image.tsx`), párrafo descriptivo bajo el h1, "Otros traslados" al pie de cada destino (enlaces internos), `GOOGLE_SITE_VERIFICATION` opcional. Perfiles oficiales van en `sitio.redes` (sameAs).
- Páginas de destino (2026-11-15): Ezeiza, Aeroparque, **Ezeiza ↔ Aeroparque** ($80.000 fija, Julian; usa `origen` en rutas.ts para precargar los dos aeropuertos), Aeropuerto San Fernando, Pilar, Tigre, Luján, La Plata, Mar del Plata, Rosario (Julian confirmó que hace todas). km medidos con ORS desde el centro de CABA; minutos con margen de tránsito. `traslado` opcional en `rutas.ts` para títulos tipo "Traslado al Aeropuerto de San Fernando". San Fernando está en `otrosAeropuertos` (tarifas.ts): se cobra por km pero pide hora de vuelo.
- Sale desde Castelar, pero **no se publica** (Julian, 2026-11-15): sin página por zona de salida ni mención en el sitio. El precio siempre se calcula desde donde se busca al pasajero; el acercamiento no se cobra.
- Carpeta `impresos/` (tarjeta y flyer) no es del sitio: no commitear sin preguntar.
- Dirección del negocio: **no se publica**, es negocio con zona de servicio (Julian, 2026-11-15). En JSON-LD solo región; en el Perfil de Google, zona de servicio con dirección oculta.
- Dominio en Vercel: www.saveriotraslados.com.ar es el de producción y el dominio sin www redirige a www (canonical y sitemap usan www, vía VERCEL_PROJECT_PRODUCTION_URL). Search Console verificado (propiedad de dominio) y sitemap enviado con la URL completa (2026-11-15). Bing Webmaster Tools importado desde Search Console (para ChatGPT/Copilot). Firewall de Vercel: Bot Protection, AI Bots y Attack Mode apagados (no bloquear crawlers). Pendiente: Bing Places cuando se verifique el Perfil de Google.
- Header (2026-11-15): logo, links Ezeiza / Aeroparque / Tarifas (desde md) y píldora blanca "WhatsApp" + teléfono (en celu solo "WhatsApp").
- Choferes: foto, nombre, auto y link "Escribir por WhatsApp". Sin chips de condiciones (Julian: repetían info). Se eliminó `sitio.condiciones`.
- Animación al bajar: clase `.aparecer` (CSS scroll-driven, sin JS; respeta "reducir movimiento").
- Reseñas: `sitio.resenas` vacío = no se muestra la sección. Nunca inventar reseñas.

## Página /empresas (2026-11-15)
- Enfocada en traslados corporativos a aeropuertos, hoteles, Terminal de Retiro e interior (pedido de Julian). Reservás vos y viaja otra persona; solo factura C. Sin "cuenta corriente" (no confirmado).
- Bloques: h1 + párrafo, cotizador, "Viajes que hacemos" (con links a destinos), "Cómo reservar" (4 pasos), tarifas, chofer, seguridad, FAQ propias. JSON-LD Service con BusinessAudience. Link en header ("Empresas") y pie.

## Tarifas y grupos (2026-11-15)
- Página `/tarifas` con la lista completa (Aeropuertos / Ciudades e interior) y FAQ de precios. En la home, empresas y destinos va una lista corta (3) con link "Ver todas las tarifas" (Julian: en celu la lista era enorme). Header "Tarifas" → /tarifas.
- Más de 4 pasajeros: se suma otro chofer con su auto propio (Julian). Nota bajo "Pasajeros" en el cotizador con link a WhatsApp, FAQ general y de empresas. El precio del segundo auto se pasa por WhatsApp (no definido).
- Equipaje máximo por auto: **3 valijas grandes y 4 de mano** (estimado prudente para la Spin con 4 pasajeros, baúl ~550 L; Julian no lo sabía exacto, conviene confirmarlo cargando el auto). En `sitio.auto` (valijas, valijasMano, equipaje). La reserva avisa si eligen más de 3 grandes (puede hacer falta otro auto).

## Confianza (2026-11-15)
- "Viajes seguros" suma "Taxi con licencia de la Ciudad de Buenos Aires" (4 ítems, grilla 2×2).
- Bajo "Reservar": "No pagás nada en la web…" + "Tus datos solo se usan para tu reserva". En el pie: "No cobramos nada en la web. Tus datos solo se usan para coordinar tu viaje."
- Pendiente con datos de Julian: reseñas reales, fotos del auto, Data Fiscal (QR ARCA) + CUIT en el pie, línea sobre la trayectoria de Javier. Seña: no confirmado si cobran por adelantado (no afirmar "sin seña").

- WiFi a bordo sin cargo (Julian, 2026-11-15): `sitio.auto.wifi`; se muestra en el chofer, en lo que incluye el resultado, en la FAQ de valijas y como amenityFeature en JSON-LD.

## Versión en inglés (2026-11-15)
- Para pasajeros que llegan del exterior: `/en` (home), `/en/ezeiza-airport-transfer`, `/en/aeroparque-airport-transfer`, `/en/ezeiza-aeroparque-transfer`. Textos en `config/rutas-en.ts` (reusan km, tarifa y puntos de la página en español vía `esSlug`) y `faqsEn` en `lib/seo.tsx`.
- Dos layouts raíz: `app/(es)/layout.tsx` (lang es-AR) y `app/(en)/layout.tsx` (lang en). 404 general en `app/global-not-found.tsx` (flag `experimental.globalNotFound`). Ir de un idioma al otro recarga la página (normal con layouts raíz distintos).
- hreflang (es-AR, en, x-default = español) en metadatos y sitemap. Link "English" / "Español" en header (md+) y pie.
- Cotizador, Selectores, MapaRuta, Bloques, Marco y mensajes de WhatsApp reciben `idioma`. En inglés el precio se muestra "ARS 80,000" (el "$" solo se confunde con dólares) y el WhatsApp sale en inglés.
- **Dólares** (Julian): se aceptan sin problema, **US$1 por km** (`tarifas.precioPorKmUSD`). Tarifas fijas en dólares: se pasan al dólar de referencia `tarifas.dolar` = 1500 (Julian) y se redondean a múltiplos de 5: Ezeiza US$55, Aeroparque US$20 (`usdDeTarifaFija`). Si el dólar cambia, actualizar `dolar`.
- No prometer chofer que hable inglés (no confirmado).

## Javier (2026-11-15)
- Más de 25 años de servicio (`sitio.choferes[].anios`). Lo que lo distingue: cordialidad, responsabilidad y limpieza.
- No mencionar atención 24 h. Todavía no hay Instagram ni reseñas.

## Auditoría SEO (2026-11-16)
- Sin horario en el JSON-LD del negocio (antes decía 24 h todos los días; no se publica). Monedas: ARS y USD; pago en efectivo en pesos o dólares.
- Distancias medidas con ORS desde el centro de CABA: La Plata 58 km, Mar del Plata 417 km, Rosario 298 km. **Aeroparque sin distancia ni tiempo** (`sinDistancia` en rutas.ts; Julian: depende de dónde se busca al pasajero); en listas dice "Desde cualquier punto de CABA".
- Títulos de menos de 60 caracteres (con "| Saverio Traslados") y descripciones de menos de 160. Mar del Plata y Rosario: "Traslado de Buenos Aires a ..." (se sacó "auto particular").
- La Plata y Rosario con más texto y preguntas propias. og:title descriptivo en home (es y en) y /tarifas. LocalBusiness con descripción en inglés en /en.

## Métricas
- Vercel Analytics (`@vercel/analytics`, componente en `layout.tsx`): visitas por página, sin cookies. Hay que activarlo en Vercel → proyecto → Analytics. Eventos propios (Ver precio, Reservar) requieren plan Pro.

## Confirmado por Julian (2026-11-15, segunda tanda)
- **Taxi con licencia de CABA** (no remis). Se puede usar "taxi" en el sitio; no usar "remis".
- **Sin recargo nocturno y sin cobro de regreso en vacío** (quedan en 0 y 1 en `tarifas.ts`).
- Confirmado: espera sin cargo si el vuelo se atrasa, y viajes de madrugada.

## Perfil de Empresa de Google
- Creado el 2026-11-15 con el mail personal de Julian, como "Empresa de servicios" con dirección en Castelar (oculta, zona de servicio). Estado: **en verificación**.
- Teléfono cargado = el del sitio (hoy el de Julian, temporal). Si se cambia, cambiar sitio y perfil juntos.
- Pendiente: fotos reales (auto, interior, baúl, Javier), logo, sumar al papá como propietario, pedir reseñas. Flyer solo como publicación, no como foto. Crédito de Google Ads: omitido por ahora.

## Preguntas abiertas
- ¿Desde qué ciudad/barrio sale?
- ~~¿Habilitación?~~ Taxi con licencia de CABA.
- ¿Factura (monotributo)? Importante para empresas.
- Reservas: ¿alcanza con solicitud que llega por WhatsApp/email y él confirma, o se quiere calendario con disponibilidad y seña online?
- Rutas frecuentes reales y tarifas fijas actuales.
- Fotos reales del auto y del chofer.

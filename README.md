# Saverio Traslados

Sitio de traslados con cotizador (km entre dos direcciones + precios fijos por zona) y reserva por WhatsApp. Next.js, hosteado en Vercel.

## Correr en local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Precio por km, mínimo, recargo nocturno, precios fijos (Ezeiza, Aeroparque) | `src/config/tarifas.ts` |
| Teléfono, WhatsApp, zona, auto, patente, condiciones, reseñas | `src/config/sitio.ts` |
| Páginas por destino (SEO): textos, km, preguntas frecuentes | `src/config/rutas.ts` |

Los valores marcados como **EJEMPLO** hay que reemplazarlos por los reales antes de publicar.

## Servicios de mapas (software libre, OpenStreetMap)

- Autocompletado de direcciones: Photon (`/api/lugares`), sin API key.
- Distancia y recorrido: OpenRouteService (`/api/ruta`). En producción definir `ORS_API_KEY` en Vercel (key gratuita en openrouteservice.org). Sin key usa el servidor demo de OSRM, que sirve solo para desarrollo.

## Variables de entorno

Ver `.env.example`.

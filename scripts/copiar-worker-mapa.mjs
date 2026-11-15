// Copia el worker de MapLibre a /public para servirlo como archivo estático.
// Turbopack no resuelve el `new URL("./maplibre-gl-worker.mjs", import.meta.url)` que usa la librería.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/maplibre", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/maplibre/worker.mjs");

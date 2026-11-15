// Tarifas del cotizador. Valores en pesos argentinos.
// Confirmado por Julian (2026-11-15): $1.500 por km, Ezeiza ↔ CABA $80.000, Aeroparque ↔ CABA $30.000.

export type Punto = { lat: number; lon: number };

export const tarifas = {
  precioPorKm: 1500,
  // EJEMPLO: precio mínimo por viaje (para viajes muy cortos). Confirmar.
  minimo: 15000,
  // Opcional: cobrar parte del regreso en vacío en viajes largos.
  // Desde `kmMediaDistancia` km, el precio por km se multiplica por `factorMediaDistancia`.
  // 1 = desactivado (se cobra solo el km recorrido).
  kmMediaDistancia: 80,
  factorMediaDistancia: 1,
  // Opcional: recargo entre las 22 y las 6 (0.15 = 15%). 0 = desactivado.
  recargoNocturno: 0,
  horaInicioNocturno: 22,
  horaFinNocturno: 6,
  // El precio final se redondea hacia arriba a este múltiplo.
  redondeo: 500,
};

// Zonas para tarifas fijas, como polígono [lon, lat].
// CABA: contorno simplificado (Gral. Paz, Riachuelo y costa del río). Los casos de borde se
// resuelven al confirmar por WhatsApp, porque el precio es siempre aproximado.
export const zonas = {
  caba: {
    nombre: "CABA",
    poligono: [
      [-58.458, -34.533],
      [-58.41, -34.552],
      [-58.38, -34.575],
      [-58.355, -34.595],
      [-58.335, -34.615],
      [-58.348, -34.64],
      [-58.38, -34.652],
      [-58.415, -34.665],
      [-58.445, -34.69],
      [-58.463, -34.705],
      [-58.5, -34.68],
      [-58.531, -34.65],
      [-58.53, -34.615],
      [-58.515, -34.582],
      [-58.5, -34.56],
      [-58.478, -34.545],
    ] as [number, number][],
  },
} as const;

export type ZonaId = keyof typeof zonas;

// Lugares con tarifa de referencia fija cuando el otro extremo del viaje está dentro de la zona.
export const tarifasFijas: {
  id: string;
  nombre: string;
  detalle: string;
  lugar: Punto;
  radioKm: number;
  zona: ZonaId;
  precio: number;
  aeropuerto: boolean;
}[] = [
  {
    id: "ezeiza",
    nombre: "Aeropuerto Ezeiza",
    detalle: "Tarifa desde CABA",
    lugar: { lat: -34.8222, lon: -58.5358 },
    radioKm: 4,
    zona: "caba",
    precio: 80000,
    aeropuerto: true,
  },
  {
    id: "aeroparque",
    nombre: "Aeroparque",
    detalle: "Tarifa desde CABA",
    lugar: { lat: -34.5592, lon: -58.4156 },
    radioKm: 2,
    zona: "caba",
    precio: 30000,
    aeropuerto: true,
  },
];

// Aeropuertos sin tarifa fija (se cobran por km). Sirven para pedir la hora del vuelo al reservar.
export const otrosAeropuertos: { nombre: string; lugar: Punto; radioKm: number }[] = [
  { nombre: "Aeropuerto San Fernando", lugar: { lat: -34.4532, lon: -58.5862 }, radioKm: 2 },
];

// Tarifas del cotizador. Valores en pesos argentinos. ⚠️ Todos los montos son de EJEMPLO.

export type Punto = { lat: number; lon: number };

export const tarifas = {
  precioPorKm: 900,
  minimo: 15000,
  // Viajes largos: se cobra parte del regreso en vacío.
  // Desde `kmMediaDistancia` km, el precio por km se multiplica por `factorMediaDistancia`.
  kmMediaDistancia: 80,
  factorMediaDistancia: 1.5,
  // Recargo entre las 22 y las 6 (0.15 = 15%).
  recargoNocturno: 0.15,
  horaInicioNocturno: 22,
  horaFinNocturno: 6,
  // El precio final se redondea hacia arriba a este múltiplo.
  redondeo: 500,
};

// Zonas para tarifas fijas. Aproximación con círculo (centro + radio).
export const zonas = {
  amba: {
    nombre: "AMBA",
    centro: { lat: -34.6037, lon: -58.3816 }, // Obelisco
    radioKm: 45,
  },
} as const;

export type ZonaId = keyof typeof zonas;

// Lugares con precio fijo cuando el otro extremo del viaje está dentro de la zona.
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
    detalle: "Precio fijo desde AMBA",
    lugar: { lat: -34.8222, lon: -58.5358 },
    radioKm: 4,
    zona: "amba",
    precio: 38000,
    aeropuerto: true,
  },
  {
    id: "aeroparque",
    nombre: "Aeroparque",
    detalle: "Precio fijo desde AMBA",
    lugar: { lat: -34.5592, lon: -58.4156 },
    radioKm: 2,
    zona: "amba",
    precio: 34000,
    aeropuerto: true,
  },
];

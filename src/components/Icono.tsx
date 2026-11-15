// Íconos de línea propios (sin librería, para no sumar peso).
const paths = {
  avion: "M10 14 3 11l1.5-1.5 6 1L15 6c.8-.8 2.2-1.2 3-.4.8.8.4 2.2-.4 3l-4.5 4.5 1 6L12.5 20.5 10 14Zm-6 6h16",
  ruta: "M7 3 4 21M17 3l3 18M12 4v3m0 4v3m0 4v2",
  reloj: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  persona: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0",
  check: "m5 12 5 5L20 7",
  atras: "m15 6-6 6 6 6",
  ubicacion: "m3 11 18-8-8 18-2-8-8-2Z",
  cerrar: "M6 6l12 12M18 6 6 18",
} as const;

export type NombreIcono = keyof typeof paths;

export function Icono({ nombre, className = "size-5" }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[nombre]} />
    </svg>
  );
}

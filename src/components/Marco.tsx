import Link from "next/link";
import { sitio } from "@/config/sitio";
import { rutas } from "@/config/rutas";
import { linkWhatsApp } from "@/lib/whatsapp";

// Logo provisorio (texto). El logo real se diseña más adelante.
export function Encabezado() {
  return (
    <header className="bg-tinta text-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-[17px] font-extrabold tracking-tight">
          {sitio.nombre}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <a href={`tel:${sitio.telefonoLink}`} className="hidden sm:inline">
            {sitio.telefono}
          </a>
          <a href={linkWhatsApp("Hola, quiero consultar por un viaje.")} target="_blank" rel="noopener" className="font-medium">
            WhatsApp
          </a>
        </nav>
      </div>
      <div
        className="h-1"
        aria-hidden="true"
        style={{ background: "repeating-linear-gradient(90deg,#ffc700 0 12px,#111 12px 24px)" }}
      />
    </header>
  );
}

export function Pie() {
  return (
    <footer className="mt-20 border-t border-linea bg-gris">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-bold">{sitio.nombre}</p>
          <p className="mt-1 text-apagado">{sitio.zonaCompleta}</p>
          <p className="mt-1">
            <a href={`tel:${sitio.telefonoLink}`}>{sitio.telefono}</a>
          </p>
        </div>
        <ul className="space-y-1">
          {rutas.map((r) => (
            <li key={r.slug}>
              <Link href={`/traslados/${r.slug}`} className="hover:underline">
                Traslado a {r.destino}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-apagado">
          {sitio.pagos} {sitio.pagosNota}
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { sitio } from "@/config/sitio";
import { rutas, tituloTraslado } from "@/config/rutas";
import { linkWhatsApp } from "@/lib/whatsapp";

// Logo provisorio (texto). El logo real se diseña más adelante.
export function Encabezado() {
  return (
    <header className="bg-tinta text-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="whitespace-nowrap text-[17px] font-extrabold tracking-tight">
          {sitio.nombre}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <ul className="hidden items-center gap-6 text-white/80 md:flex">
            <li>
              <Link href="/traslados/aeropuerto-ezeiza" className="hover:text-white">
                Ezeiza
              </Link>
            </li>
            <li>
              <Link href="/traslados/aeroparque" className="hover:text-white">
                Aeroparque
              </Link>
            </li>
            <li>
              <Link href="/#tarifas" className="hover:text-white">
                Tarifas
              </Link>
            </li>
          </ul>
          <a
            href={linkWhatsApp("Hola, quiero consultar por un viaje.")}
            target="_blank"
            rel="noopener"
            className="flex h-9 shrink-0 items-center rounded-full bg-white px-4 font-semibold text-tinta hover:bg-white/90"
          >
            <span className="hidden sm:inline">WhatsApp {sitio.telefono}</span>
            <span className="sm:hidden">WhatsApp</span>
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
                {tituloTraslado(r)}
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

import Link from "next/link";
import { sitio } from "@/config/sitio";
import { rutas, tituloTraslado } from "@/config/rutas";
import { rutasEn } from "@/config/rutas-en";
import type { Idioma } from "@/lib/cotizar";
import { linkWhatsApp } from "@/lib/whatsapp";

// Teléfono en formato internacional para la versión en inglés: +54 9 11 5801-7970
const telefonoInternacional = `+54 9 ${sitio.telefono}`;

const NAV = {
  es: [
    { href: "/traslados/aeropuerto-ezeiza", texto: "Ezeiza" },
    { href: "/traslados/aeroparque", texto: "Aeroparque" },
    { href: "/empresas", texto: "Empresas" },
    { href: "/tarifas", texto: "Tarifas" },
  ],
  en: [
    { href: "/en/ezeiza-airport-transfer", texto: "Ezeiza" },
    { href: "/en/aeroparque-airport-transfer", texto: "Aeroparque" },
    { href: "/en/ezeiza-aeroparque-transfer", texto: "EZE ↔ AEP" },
  ],
};

// Logo provisorio (texto). El logo real se diseña más adelante.
export function Encabezado({ idioma }: { idioma: Idioma }) {
  const en = idioma === "en";
  return (
    <header className="bg-tinta text-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href={en ? "/en" : "/"} className="whitespace-nowrap text-[15px] font-extrabold tracking-tight sm:text-[17px]">
          {sitio.nombre}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <ul className="hidden items-center gap-6 text-white/80 md:flex">
            {NAV[idioma].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.texto}
                </Link>
              </li>
            ))}
            <li>
              <Link href={en ? "/" : "/en"} hrefLang={en ? "es-AR" : "en"} lang={en ? "es" : "en"} className="hover:text-white">
                {en ? "Español" : "English"}
              </Link>
            </li>
          </ul>
          <a
            href={linkWhatsApp(en ? "Hi, I'd like to ask about a trip." : "Hola, quiero consultar por un viaje.")}
            target="_blank"
            rel="noopener"
            className="flex h-9 shrink-0 items-center rounded-full bg-white px-3.5 font-semibold sm:px-4 text-tinta hover:bg-white/90"
          >
            <span className="hidden sm:inline">WhatsApp {en ? telefonoInternacional : sitio.telefono}</span>
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

export function Pie({ idioma }: { idioma: Idioma }) {
  const en = idioma === "en";
  return (
    <footer className="mt-20 border-t border-linea bg-gris">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-bold">{sitio.nombre}</p>
          <p className="mt-1 text-apagado">{en ? "Buenos Aires, Argentina" : sitio.zonaCompleta}</p>
          <p className="mt-1">
            <a href={`tel:${sitio.telefonoLink}`}>{en ? telefonoInternacional : sitio.telefono}</a>
          </p>
          <p className="mt-3">
            <Link href={en ? "/" : "/en"} hrefLang={en ? "es-AR" : "en"} lang={en ? "es" : "en"} className="underline underline-offset-4">
              {en ? "Ver el sitio en español" : "English version"}
            </Link>
          </p>
        </div>
        <ul className="space-y-1">
          {en
            ? rutasEn.map((r) => (
                <li key={r.slug}>
                  <Link href={`/en/${r.slug}`} className="hover:underline">
                    {r.titulo}
                  </Link>
                </li>
              ))
            : rutas.map((r) => (
                <li key={r.slug}>
                  <Link href={`/traslados/${r.slug}`} className="hover:underline">
                    {tituloTraslado(r)}
                  </Link>
                </li>
              ))}
          {!en && (
            <li>
              <Link href="/empresas" className="hover:underline">
                Traslados para empresas
              </Link>
            </li>
          )}
        </ul>
        <div className="space-y-2 text-apagado">
          <p>{en ? `${sitio.payments} ${sitio.paymentsNote}` : `${sitio.pagos} ${sitio.pagosNota}`}</p>
          <p>
            {en
              ? "We don't charge anything online. Your details are only used to arrange your trip."
              : "No cobramos nada en la web. Tus datos solo se usan para coordinar tu viaje."}
          </p>
        </div>
      </div>
    </footer>
  );
}

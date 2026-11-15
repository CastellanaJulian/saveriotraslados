import type { Metadata } from "next";
import Link from "next/link";
import { sitio } from "@/config/sitio";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Resenas, Tarifas, ViajesSeguros } from "@/components/Bloques";
import { Icono, type NombreIcono } from "@/components/Icono";
import { frecuentes } from "@/lib/frecuentes";
import { linkWhatsApp } from "@/lib/whatsapp";
import { JsonLd, jsonLdFaq } from "@/lib/seo";

const titulo = "Traslados para empresas: aeropuertos, hoteles y viajes al interior";
const descripcion =
  "Traslados corporativos en CABA y Gran Buenos Aires: Ezeiza, Aeroparque, hoteles, Terminal de Retiro y viajes al interior. Reservás para tu equipo o tus visitas, factura C.";

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/empresas" },
  openGraph: { title: titulo, description: descripcion, url: "/empresas" },
};

// Viajes típicos de una empresa. Cada uno lleva a la página que corresponde.
const viajes: { icono: NombreIcono; titulo: string; texto: string; links: { href: string; texto: string }[] }[] = [
  {
    icono: "avion",
    titulo: "Aeropuertos",
    texto: "Ida y vuelta de vuelos de trabajo, a cualquier hora. Si el vuelo se atrasa, la espera no se cobra.",
    links: [
      { href: "/traslados/aeropuerto-ezeiza", texto: "Ezeiza" },
      { href: "/traslados/aeroparque", texto: "Aeroparque" },
      { href: "/traslados/aeropuerto-san-fernando", texto: "San Fernando" },
    ],
  },
  {
    icono: "ubicacion",
    titulo: "Hoteles",
    texto: "Buscamos a tus visitas en el aeropuerto y las dejamos en el hotel, o del hotel a la oficina y a reuniones.",
    links: [],
  },
  {
    icono: "auto",
    titulo: "Terminal de Retiro",
    texto: "Llevamos o buscamos a quien viaja en micro o en tren, con el horario de salida o llegada que nos pases.",
    links: [],
  },
  {
    icono: "ruta",
    titulo: "Interior",
    texto: "Reuniones, visitas a planta o clientes fuera de la ciudad. Ida y vuelta en el día con espera.",
    links: [
      { href: "/traslados/la-plata", texto: "La Plata" },
      { href: "/traslados/pilar", texto: "Pilar" },
      { href: "/traslados/rosario", texto: "Rosario" },
      { href: "/traslados/mar-del-plata", texto: "Mar del Plata" },
    ],
  },
];

const faqs = [
  {
    pregunta: "¿Puedo reservar un viaje para otra persona?",
    respuesta:
      "Sí. En la reserva poné el nombre de quien viaja y, si va al aeropuerto, el vuelo. Te confirmamos por WhatsApp el chofer, el auto y la patente para que se los pases.",
  },
  {
    pregunta: "¿Qué factura hacen?",
    respuesta: "Hacemos solo factura C, no emitimos factura A. Pasanos los datos de facturación de la empresa al reservar.",
  },
  {
    pregunta: "¿Buscan a visitas en el aeropuerto y las llevan al hotel?",
    respuesta:
      "Sí. Pasanos el número de vuelo y el hotel. Seguimos el vuelo y, si se atrasa, la espera no se cobra.",
  },
  {
    pregunta: "¿Hacen viajes al interior por trabajo?",
    respuesta:
      "Sí. Para ida y vuelta en el día, avisanos cuánto dura la reunión y sumamos la espera al precio. Todos los precios incluyen peajes.",
  },
  {
    pregunta: "¿Cómo se paga?",
    respuesta: `${sitio.pagos} ${sitio.pagosNota}`,
  },
  {
    pregunta: "¿Es un taxi o un remis?",
    respuesta:
      "Es un taxi con licencia de la Ciudad de Buenos Aires y chofer profesional, que se reserva con anticipación.",
  },
];

export default function Empresas() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Traslados para empresas",
          name: titulo,
          url: `${sitio.url}/empresas`,
          provider: { "@id": `${sitio.url}/#negocio` },
          audience: { "@type": "BusinessAudience" },
          areaServed: [
            { "@type": "City", name: "Ciudad Autónoma de Buenos Aires" },
            { "@type": "AdministrativeArea", name: "Gran Buenos Aires" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: sitio.nombre, item: sitio.url },
            { "@type": "ListItem", position: 2, name: "Empresas", item: `${sitio.url}/empresas` },
          ],
        }}
      />
      <JsonLd data={jsonLdFaq(faqs)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <nav aria-label="Ruta de navegación" className="text-sm text-apagado">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / Empresas
          </nav>
          <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]">
            Traslados para empresas
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-apagado">
            Para tu equipo y tus visitas: aeropuertos, hoteles, la Terminal de Retiro y viajes al interior, desde{" "}
            {sitio.zonaCompleta}. Reservás vos, viaja quien necesites, y te confirmamos chofer, auto y patente por
            WhatsApp. Hacemos factura C.
          </p>
          <a
            href={linkWhatsApp("Hola, quiero consultar por traslados para mi empresa.")}
            target="_blank"
            rel="noopener"
            className="mt-5 inline-block text-[15px] font-semibold underline underline-offset-4"
          >
            Escribir por WhatsApp
          </a>
        </div>
        <div className="lg:row-span-2">
          <Cotizador />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <section aria-labelledby="viajes" className="aparecer">
          <h2 id="viajes" className="text-2xl font-extrabold tracking-tight">
            Viajes que hacemos
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {viajes.map((v) => (
              <li key={v.titulo} className="aparecer flex gap-4 rounded-2xl bg-gris p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-taxi-suave text-taxi-texto">
                  <Icono nombre={v.icono} className="size-6" />
                </span>
                <span>
                  <span className="block text-[17px] font-bold">{v.titulo}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-apagado">{v.texto}</span>
                  {v.links.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[15px]">
                      {v.links.map((l) => (
                        <Link key={l.href} href={l.href} className="font-medium underline underline-offset-4">
                          {l.texto}
                        </Link>
                      ))}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="como" className="aparecer">
          <h2 id="como" className="text-2xl font-extrabold tracking-tight">
            Cómo reservar
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              "Cotizás origen y destino en esta página.",
              "Completás quién viaja, el vuelo o el horario, y las valijas.",
              "Se abre WhatsApp con todo cargado y te confirmamos chofer, auto y patente.",
              "Pagás como prefieras y te enviamos la factura C.",
            ].map((paso, i) => (
              <li key={paso} className="aparecer rounded-2xl border border-linea p-5">
                <span className="text-sm font-bold text-apagado">{i + 1}</span>
                <span className="mt-1 block text-[15px] leading-relaxed">{paso}</span>
              </li>
            ))}
          </ol>
        </section>

        <Tarifas items={frecuentes} />
        <Chofer />
        <ViajesSeguros />
        <Resenas />
        <Preguntas faqs={faqs} />
      </div>
    </>
  );
}

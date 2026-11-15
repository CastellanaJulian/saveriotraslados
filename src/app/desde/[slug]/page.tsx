import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { origenes, origenPorSlug } from "@/config/origenes";
import { sitio } from "@/config/sitio";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Resenas, Tarifas, ViajesSeguros } from "@/components/Bloques";
import { destinosDesde } from "@/lib/origenes";
import { formatoPrecio } from "@/lib/cotizar";
import { JsonLd, jsonLdFaq } from "@/lib/seo";

// Solo existen las zonas cargadas en config/origenes.ts; cualquier otra da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return origenes.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/desde/[slug]">): Promise<Metadata> {
  const o = origenPorSlug((await params).slug);
  if (!o) return {};
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: `/desde/${o.slug}` },
    openGraph: { title: o.title, description: o.description, url: `/desde/${o.slug}` },
  };
}

export default async function PaginaOrigen({ params }: PageProps<"/desde/[slug]">) {
  const o = origenPorSlug((await params).slug);
  if (!o) notFound();

  const destinos = destinosDesde(o);
  const ezeiza = destinos.find((d) => d.slug === "aeropuerto-ezeiza");
  const aeroparque = destinos.find((d) => d.slug === "aeroparque");
  const url = `${sitio.url}/desde/${o.slug}`;

  // Preguntas propias de la zona + precios reales calculados desde acá.
  const faqs = [
    ...(ezeiza
      ? [
          {
            pregunta: `¿Cuánto sale un traslado de ${o.nombre} a Ezeiza?`,
            respuesta: `Unos ${ezeiza.precio} aproximados por ${ezeiza.km} km, con peajes incluidos. Depende de tu dirección exacta: te lo confirmamos por WhatsApp antes del viaje.`,
          },
        ]
      : []),
    ...(aeroparque
      ? [
          {
            pregunta: `¿Y de ${o.nombre} a Aeroparque?`,
            respuesta: `Unos ${aeroparque.precio} aproximados por ${aeroparque.km} km, con peajes incluidos.`,
          },
        ]
      : []),
    ...o.faqs,
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: `Traslados desde ${o.nombre}`,
          url,
          provider: { "@id": `${sitio.url}/#negocio` },
          areaServed: [o.nombre, ...o.cercanos].map((name) => ({ "@type": "Place", name })),
          offers: destinos.map((d) => ({
            "@type": "Offer",
            name: `${o.nombre} a ${d.titulo}`,
            priceCurrency: "ARS",
            price: d.precioNumero,
            description: "Precio aproximado con peajes incluidos, sujeto a confirmación",
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: sitio.nombre, item: sitio.url },
            { "@type": "ListItem", position: 2, name: `Traslados desde ${o.nombre}`, item: url },
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
            / Traslados desde {o.nombre}
          </nav>
          <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]">
            Traslados desde {o.nombre}
          </h1>
          {ezeiza && (
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="text-sm text-apagado">A Ezeiza aprox.</dt>
                <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{formatoPrecio(ezeiza.precioNumero)}</dd>
              </div>
              {aeroparque && (
                <div>
                  <dt className="text-sm text-apagado">A Aeroparque aprox.</dt>
                  <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">
                    {formatoPrecio(aeroparque.precioNumero)}
                  </dd>
                </div>
              )}
            </dl>
          )}
          <div className="mt-6 hidden max-w-md space-y-3 text-[17px] leading-relaxed text-apagado lg:block">
            {o.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="lg:row-span-2">
          <Cotizador
            origenInicial={{ nombre: o.nombreCompleto, detalle: "", lat: o.punto.lat, lon: o.punto.lon }}
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <div className="max-w-2xl space-y-3 text-[17px] leading-relaxed text-apagado lg:hidden">
          {o.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Tarifas
          items={destinos}
          titulo={`Desde ${o.nombre}`}
          nota={`Precios aproximados desde el centro de ${o.nombre}, con peajes incluidos. Cambian según tu dirección y te los confirmamos por WhatsApp.`}
        />
        <Chofer />
        <ViajesSeguros />
        <Resenas />
        <Preguntas faqs={faqs} />
      </div>
    </>
  );
}

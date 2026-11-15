import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rutas, rutaPorSlug } from "@/config/rutas";
import { sitio } from "@/config/sitio";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Resenas } from "@/components/Bloques";
import { aFrecuente, frecuentes, precioReferencia } from "@/lib/frecuentes";
import { formatoDuracion, formatoPrecio } from "@/lib/cotizar";
import { JsonLd, jsonLdFaq } from "@/lib/seo";

// Solo existen las rutas cargadas en config/rutas.ts; cualquier otra da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return rutas.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/traslados/[slug]">): Promise<Metadata> {
  const r = rutaPorSlug((await params).slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: `/traslados/${r.slug}` },
    openGraph: { title: r.title, description: r.description, url: `/traslados/${r.slug}` },
  };
}

export default async function PaginaRuta({ params }: PageProps<"/traslados/[slug]">) {
  const r = rutaPorSlug((await params).slug);
  if (!r) notFound();

  const { precio, fijo } = precioReferencia(r);
  const otras = frecuentes.filter((f) => f.lugar.nombre !== r.destinoCompleto);
  const url = `${sitio.url}/traslados/${r.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: `Traslado a ${r.destino}`,
          url,
          provider: { "@id": `${sitio.url}/#negocio` },
          areaServed: r.destino,
          offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: precio,
            description: fijo ? "Tarifa de referencia desde CABA, sujeta a confirmación" : `Precio aproximado desde ${sitio.zonaCompleta}, peajes aparte, sujeto a confirmación`,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: sitio.nombre, item: sitio.url },
            { "@type": "ListItem", position: 2, name: `Traslado a ${r.destino}`, item: url },
          ],
        }}
      />
      <JsonLd data={jsonLdFaq(r.faqs)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <nav aria-label="Ruta de navegación" className="text-sm text-apagado">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / Traslado a {r.destino}
          </nav>
          <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]">
            Traslado a {r.destino}
          </h1>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="text-sm text-apagado">{fijo ? "Tarifa aprox." : "Desde aprox."}</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{formatoPrecio(precio)}</dd>
            </div>
            <div>
              <dt className="text-sm text-apagado">Distancia</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{r.km} km</dd>
            </div>
            <div>
              <dt className="text-sm text-apagado">Viaje</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{formatoDuracion(r.minutos)}</dd>
            </div>
          </dl>
          <div className="mt-6 hidden max-w-md space-y-3 text-[17px] leading-relaxed text-apagado lg:block">
            {r.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="lg:row-span-2">
          <Cotizador frecuentes={otras} destinoInicial={aFrecuente(r).lugar} />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <div className="max-w-2xl space-y-3 text-[17px] leading-relaxed text-apagado lg:hidden">
          {r.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Chofer />
        <Resenas />
        <Preguntas faqs={r.faqs} />
      </div>
    </>
  );
}

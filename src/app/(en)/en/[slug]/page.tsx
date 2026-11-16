import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { rutaEnPorSlug, rutaEs, rutasEn } from "@/config/rutas-en";
import { usdDeTarifaFija } from "@/config/tarifas";
import { sitio } from "@/config/sitio";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Tarifas, ViajesSeguros } from "@/components/Bloques";
import { aFrecuente, frecuentesEn, precioReferencia } from "@/lib/frecuentes";
import { formatoDuracion, formatoPrecio, formatoUSD, precioUSDPorKm } from "@/lib/cotizar";
import { JsonLd, jsonLdFaq } from "@/lib/seo";

// Solo existen las rutas de config/rutas-en.ts; cualquier otra da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return rutasEn.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/en/[slug]">): Promise<Metadata> {
  const r = rutaEnPorSlug((await params).slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.description,
    alternates: {
      canonical: `/en/${r.slug}`,
      languages: { "es-AR": `/traslados/${r.esSlug}`, en: `/en/${r.slug}`, "x-default": `/traslados/${r.esSlug}` },
    },
    openGraph: { title: r.title, description: r.description, url: `/en/${r.slug}`, locale: "en_US" },
  };
}

export default async function PaginaRutaEn({ params }: PageProps<"/en/[slug]">) {
  const r = rutaEnPorSlug((await params).slug);
  if (!r) notFound();

  const es = rutaEs(r);
  const { precio, fijo } = precioReferencia(es);
  const usd = fijo ? usdDeTarifaFija(precio) : precioUSDPorKm(es.km);
  const url = `${sitio.url}/en/${r.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TaxiService",
          name: r.titulo,
          url,
          inLanguage: "en",
          provider: { "@id": `${sitio.url}/#negocio` },
          areaServed: "Buenos Aires",
          offers: {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: precio,
            description: "Reference fare, tolls included, confirmed when you book",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: sitio.nombre, item: `${sitio.url}/en` },
            { "@type": "ListItem", position: 2, name: r.titulo, item: url },
          ],
        }}
      />
      <JsonLd data={jsonLdFaq(r.faqs)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-apagado">
            <Link href="/en" className="hover:underline">
              Home
            </Link>{" "}
            / {r.titulo}
          </nav>
          <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]">
            {r.titulo}
          </h1>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="text-sm text-apagado">{fijo ? "Fare approx." : "From approx."}</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">
                {formatoPrecio(precio, "en")}
                <span className="block text-base font-semibold text-apagado">or {formatoUSD(usd)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-apagado">Distance</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{es.km} km</dd>
            </div>
            <div>
              <dt className="text-sm text-apagado">Drive</dt>
              <dd className="whitespace-nowrap text-xl font-extrabold sm:text-2xl">{formatoDuracion(es.minutos)}</dd>
            </div>
          </dl>
          <div className="mt-6 hidden max-w-md space-y-3 text-[17px] leading-relaxed text-apagado lg:block">
            {r.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="lg:row-span-2">
          <Cotizador
            idioma="en"
            origenInicial={
              es.origen ? { nombre: es.origen.nombre, detalle: "", lat: es.origen.punto.lat, lon: es.origen.punto.lon } : null
            }
            destinoInicial={aFrecuente(es).lugar}
          />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <div className="max-w-2xl space-y-3 text-[17px] leading-relaxed text-apagado lg:hidden">
          {r.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Chofer idioma="en" />
        <ViajesSeguros idioma="en" />
        <Preguntas faqs={r.faqs} idioma="en" />
        <Tarifas
          items={frecuentesEn.filter((f) => f.slug !== r.slug)}
          titulo="Other transfers"
          id="otros"
          nota={null}
        />
      </div>
    </>
  );
}

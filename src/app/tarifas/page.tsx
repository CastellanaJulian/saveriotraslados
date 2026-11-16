import type { Metadata } from "next";
import Link from "next/link";
import { sitio } from "@/config/sitio";
import { Preguntas, Tarifas } from "@/components/Bloques";
import { frecuentes } from "@/lib/frecuentes";
import { faqsGenerales, JsonLd, jsonLdFaq } from "@/lib/seo";

const titulo = "Tarifas de traslados a Ezeiza, Aeroparque y el interior";
const descripcion =
  "Precios aproximados de traslados desde CABA a Ezeiza ($80.000), Aeroparque ($30.000), Ezeiza ↔ Aeroparque y viajes a Pilar, Tigre, Luján, La Plata, Mar del Plata y Rosario. Peajes incluidos.";

export const metadata: Metadata = {
  title: titulo,
  description: descripcion,
  alternates: { canonical: "/tarifas" },
};

const esAeropuerto = (slug: string) => /aeropuerto|aeroparque|ezeiza/.test(slug);

// Preguntas sobre precios (las mismas de la home, solo las que hablan de plata).
const faqs = faqsGenerales.filter((f) => /precio|recargo|pago|factura/i.test(f.pregunta));

export default function PaginaTarifas() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: sitio.nombre, item: sitio.url },
            { "@type": "ListItem", position: 2, name: "Tarifas", item: `${sitio.url}/tarifas` },
          ],
        }}
      />
      <JsonLd data={jsonLdFaq(faqs)} />

      <div className="mx-auto max-w-3xl space-y-12 px-4 pt-8 sm:px-6 sm:pt-14">
        <div>
          <nav aria-label="Ruta de navegación" className="text-sm text-apagado">
            <Link href="/" className="hover:underline">
              Inicio
            </Link>{" "}
            / Tarifas
          </nav>
          <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]">
            Tarifas aproximadas
          </h1>
          <p className="mt-4 text-[17px] text-apagado">
            Desde CABA, con peajes incluidos y sujetas a confirmación. Para tu dirección exacta,{" "}
            <Link href="/" className="font-semibold text-tinta underline underline-offset-4">
              cotizá tu viaje
            </Link>
            .
          </p>
        </div>
        <Tarifas items={frecuentes.filter((f) => esAeropuerto(f.slug))} titulo="Aeropuertos" id="aeropuertos" nota={null} />
        <Tarifas
          items={frecuentes.filter((f) => !esAeropuerto(f.slug))}
          titulo="Ciudades e interior"
          id="interior"
          nota="Fuera de los aeropuertos con tarifa fija, el precio se calcula por kilómetro desde donde salís."
        />
        <Preguntas faqs={faqs} />
      </div>
    </>
  );
}

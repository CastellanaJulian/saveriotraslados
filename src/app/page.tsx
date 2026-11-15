import Link from "next/link";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Resenas, Tarifas, ViajesSeguros } from "@/components/Bloques";
import { frecuentes } from "@/lib/frecuentes";
import { faqsGenerales, JsonLd, jsonLdFaq, jsonLdNegocio, jsonLdSitio } from "@/lib/seo";
import { sitio } from "@/config/sitio";

export default function Inicio() {
  return (
    <>
      <JsonLd data={jsonLdSitio()} />
      <JsonLd data={jsonLdNegocio()} />
      <JsonLd data={jsonLdFaq(faqsGenerales)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <h1 className="mt-2 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Traslados a Ezeiza, Aeroparque y el interior
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-apagado">
            Viajes desde {sitio.zonaCompleta} a los aeropuertos, La Plata, Mar del Plata, Rosario y otras ciudades, en{" "}
            {sitio.auto.modelo} para hasta {sitio.auto.pasajeros} pasajeros. Salimos desde{" "}
            <Link href="/desde/castelar" className="text-tinta underline underline-offset-4">
              Castelar
            </Link>
            . Cotizás acá y reservás por WhatsApp.
          </p>
        </div>
        <div className="lg:row-span-2">
          <Cotizador />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <Tarifas items={frecuentes} />
        <Chofer />
        <ViajesSeguros />
        <Resenas />
        <Preguntas faqs={faqsGenerales} />
      </div>
    </>
  );
}

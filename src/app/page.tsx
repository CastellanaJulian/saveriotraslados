import { sitio } from "@/config/sitio";
import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Resenas } from "@/components/Bloques";
import { frecuentes } from "@/lib/frecuentes";
import { faqsGenerales, JsonLd, jsonLdFaq, jsonLdNegocio } from "@/lib/seo";

export default function Inicio() {
  return (
    <>
      <JsonLd data={jsonLdNegocio()} />
      <JsonLd data={jsonLdFaq(faqsGenerales)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <p className="text-sm text-apagado">{sitio.zonaCompleta}</p>
          <h1 className="mt-2 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Traslados a Ezeiza, Aeroparque y el interior
          </h1>
        </div>
        <div className="lg:row-span-2">
          <Cotizador frecuentes={frecuentes} />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <Chofer />
        <Resenas />
        <Preguntas faqs={faqsGenerales} />
      </div>
    </>
  );
}

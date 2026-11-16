import { Cotizador } from "@/components/Cotizador";
import { Chofer, Preguntas, Tarifas, ViajesSeguros } from "@/components/Bloques";
import { frecuentesEn } from "@/lib/frecuentes";
import { faqsEn, JsonLd, jsonLdFaq, jsonLdNegocio } from "@/lib/seo";
import { sitio } from "@/config/sitio";

export default function HomeIngles() {
  return (
    <>
      <JsonLd data={jsonLdNegocio()} />
      <JsonLd data={jsonLdFaq(faqsEn)} />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-10 px-4 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <h1 className="mt-2 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            Airport transfers in Buenos Aires
          </h1>
          <p className="mt-4 text-[17px] text-apagado">
            <span className="whitespace-nowrap">Ezeiza (EZE) and Aeroparque (AEP)</span> ·{" "}
            <span className="whitespace-nowrap">Up to {sitio.auto.pasajeros} passengers</span> ·{" "}
            <span className="whitespace-nowrap">Pay in pesos or US dollars</span>
          </p>
        </div>
        <div className="lg:row-span-2">
          <Cotizador idioma="en" />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-16 px-4 sm:px-6">
        <Tarifas
          items={frecuentesEn}
          titulo="Airport fares"
          nota="Reference prices to and from the City of Buenos Aires, tolls included, confirmed when you book."
        />
        <Chofer idioma="en" />
        <ViajesSeguros idioma="en" />
        <Preguntas faqs={faqsEn} idioma="en" />
      </div>
    </>
  );
}

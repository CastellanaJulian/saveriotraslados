import Image from "next/image";
import Link from "next/link";
import { sitio } from "@/config/sitio";
import type { Frecuente } from "./Cotizador";
import { Icono, type NombreIcono } from "./Icono";
import { linkWhatsApp } from "@/lib/whatsapp";

// Bloques de la home y de las páginas de ruta. Sin títulos de marketing:
// cada bloque se entiende por su contenido.

export function Chofer() {
  return (
    <section aria-labelledby="choferes" className="aparecer grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center">
      {sitio.choferes.map((c) =>
        c.foto ? (
          <Image
            key={c.nombre}
            src={c.foto}
            alt={`${c.nombre}, chofer de ${sitio.nombre}`}
            width={461}
            height={552}
            sizes="(min-width: 640px) 200px, 160px"
            className="aspect-[5/6] w-40 rounded-2xl object-cover sm:w-full"
          />
        ) : null,
      )}
      <div>
        <h2 id="choferes" className="text-sm text-apagado">
          Nuestros choferes
        </h2>
        {sitio.choferes.map((c) => (
          <p key={c.nombre} className="mt-1 text-2xl font-extrabold tracking-tight">
            {c.nombre}
          </p>
        ))}
        <p className="mt-1 text-[15px] text-apagado">
          Auto 0 km · hasta {sitio.auto.pasajeros} pasajeros · {sitio.auto.valijas} valijas grandes
        </p>
        <a
          href={linkWhatsApp("Hola, quiero consultar por un viaje.")}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-block text-[15px] font-semibold underline underline-offset-4"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}

export function Resenas() {
  if (!sitio.resenas.length) return null;
  return (
    <section aria-label="Reseñas de pasajeros" className="aparecer grid gap-3 sm:grid-cols-2">
      {sitio.resenas.map((r) => (
        <figure key={r.autor + r.fecha} className="rounded-2xl border border-linea p-5">
          <blockquote className="text-[15px] leading-relaxed">{r.texto}</blockquote>
          <figcaption className="mt-2 text-sm text-apagado">
            {r.autor} · Google · {r.fecha}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

export function Preguntas({ faqs }: { faqs: { pregunta: string; respuesta: string }[] }) {
  return (
    <section id="preguntas" aria-label="Preguntas frecuentes" className="aparecer scroll-mt-6 divide-y divide-linea border-y border-linea">
      {faqs.map((f) => (
        <details key={f.pregunta} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
            <h2 className="text-[17px] font-medium">{f.pregunta}</h2>
            <span className="text-2xl leading-none text-apagado transition group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="mt-2 text-[15px] leading-relaxed text-apagado">{f.respuesta}</p>
        </details>
      ))}
    </section>
  );
}

// Tarifas aproximadas: separadas del buscador, con link a la página de cada destino.
// En la home y las demás páginas va una lista corta con link a /tarifas (la lista completa).
export function Tarifas({
  items,
  titulo = "Tarifas aproximadas",
  id = "tarifas",
  nota = "Precios de referencia desde CABA con peajes incluidos, sujetos a confirmación.",
  verTodas = false,
}: {
  items: Frecuente[];
  titulo?: string;
  id?: string;
  nota?: string | null;
  verTodas?: boolean;
}) {
  return (
    <section aria-labelledby={id} className="aparecer">
      <h2 id={id} className="scroll-mt-6 text-2xl font-extrabold tracking-tight">
        {titulo}
      </h2>
      <ul className="mt-4 divide-y divide-linea border-y border-linea">
        {items.map((f) => (
          <li key={f.slug} className="aparecer">
            <Link href={`/traslados/${f.slug}`} className="flex items-center gap-4 py-4 hover:bg-gris">
              <span className="flex-1">
                <span className="block text-[17px] font-medium">{f.titulo}</span>
                <span className="block text-sm text-apagado">{f.detalle}</span>
              </span>
              <span className="text-[17px] font-bold">{f.precio}</span>
            </Link>
          </li>
        ))}
      </ul>
      {nota && <p className="mt-3 text-sm text-apagado">{nota}</p>}
      {verTodas && (
        <Link href="/tarifas" className="mt-4 inline-block text-[15px] font-semibold underline underline-offset-4">
          Ver todas las tarifas
        </Link>
      )}
    </section>
  );
}

// Viajes seguros. ⚠️ Cada punto lo confirmó Julian; mantenerlo actualizado si cambia.
const seguridad: { icono: NombreIcono; texto: string }[] = [
  { icono: "escudo", texto: "Vehículo con seguro para pasajeros" },
  { icono: "licencia", texto: "Choferes con licencia profesional" },
  { icono: "auto", texto: "Vehículos 0 km" },
];

export function ViajesSeguros() {
  return (
    <section aria-labelledby="seguros" className="aparecer">
      <h2 id="seguros" className="text-2xl font-extrabold tracking-tight">
        Viajes seguros
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {seguridad.map((s) => (
          <li key={s.texto} className="aparecer flex items-center gap-3 rounded-2xl bg-gris p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-taxi-suave text-taxi-texto">
              <Icono nombre={s.icono} className="size-6" />
            </span>
            <span className="text-[15px] font-medium leading-snug">{s.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { sitio } from "@/config/sitio";

// Bloques de la home y de las páginas de ruta. Sin títulos de marketing:
// cada bloque se entiende por su contenido.

export function Chofer() {
  return (
    <section aria-label="Chofer y vehículo" className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
      {/* EJEMPLO: reemplazar por foto real de Saverio con la Spin (next/image, public/saverio.jpg) */}
      <div className="grid aspect-square w-32 place-items-center rounded-2xl bg-gris text-sm text-apagado sm:w-full">
        Foto
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight">{sitio.chofer}</p>
        <p className="mt-1 text-[15px] text-apagado">
          {sitio.auto.modelo} {sitio.auto.color} · {sitio.auto.patente}
        </p>
        <p className="mt-1 text-[15px] text-apagado">
          Hasta {sitio.auto.pasajeros} pasajeros · {sitio.auto.valijas} valijas grandes
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {sitio.condiciones.map((c) => (
            <li key={c} className="rounded-full bg-gris px-3 py-1.5 text-sm">
              {c}
            </li>
          ))}
          <li className="rounded-full bg-gris px-3 py-1.5 text-sm">Todos los medios de pago</li>
        </ul>
        <p className="mt-3 text-sm text-apagado">{sitio.pagosNota}</p>
      </div>
    </section>
  );
}

export function Resenas() {
  if (!sitio.resenas.length) return null;
  return (
    <section aria-label="Reseñas de pasajeros" className="grid gap-3 sm:grid-cols-2">
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
    <section aria-label="Preguntas frecuentes" className="divide-y divide-linea border-y border-linea">
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

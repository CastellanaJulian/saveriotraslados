"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { sitio } from "@/config/sitio";
import { cotizar, formatoDuracion, formatoPrecio, type Aeropuerto, type Cotizacion } from "@/lib/cotizar";
import { formatoFecha, linkWhatsApp, mensajeConsulta, mensajeReserva } from "@/lib/whatsapp";
import { Icono, type NombreIcono } from "./Icono";
import { MapaRuta } from "./MapaRuta";
import { SelectorFecha, SelectorHora } from "./Selectores";

export type Lugar = { nombre: string; detalle: string; lat: number; lon: number };

export type Frecuente = {
  lugar: Lugar;
  titulo: string;
  detalle: string;
  precio: string;
  slug: string;
  icono: NombreIcono;
};

type Recorrido = { km: number; minutos: number; coords: [number, number][] };
type Paso = "form" | "cargando" | "resultado" | "enviado";

const CLAVE_ULTIMO = "saverio:ultimo-viaje";

// Último viaje reservado en este dispositivo (para repetirlo con un toque).
const avisos = new Set<() => void>();
function leerUltimo() {
  try {
    return localStorage.getItem(CLAVE_ULTIMO);
  } catch {
    return null;
  }
}
function guardarUltimoViaje(v: { origen: Lugar; destino: Lugar }) {
  try {
    localStorage.setItem(CLAVE_ULTIMO, JSON.stringify(v));
    avisos.forEach((f) => f());
  } catch {}
}
function useUltimoViaje() {
  const crudo = useSyncExternalStore(
    (f) => {
      avisos.add(f);
      return () => avisos.delete(f);
    },
    leerUltimo,
    () => null,
  );
  return useMemo(() => {
    try {
      return crudo ? (JSON.parse(crudo) as { origen: Lugar; destino: Lugar }) : null;
    } catch {
      return null;
    }
  }, [crudo]);
}

function etiqueta(l: Lugar) {
  return l.detalle ? `${l.nombre}, ${l.detalle}` : l.nombre;
}

// ---------- Campo de dirección con autocompletado ----------

function CampoLugar({
  tipo,
  placeholder,
  valor,
  onElegir,
  ref,
  extra,
}: {
  tipo: "origen" | "destino";
  placeholder: string;
  valor: Lugar | null;
  onElegir: (l: Lugar | null) => void;
  ref?: React.Ref<HTMLInputElement>;
  extra?: React.ReactNode;
}) {
  const id = useId();
  const [texto, setTexto] = useState("");
  const [opciones, setOpciones] = useState<Lugar[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const pedido = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Si hay un lugar elegido se muestra su nombre; si no, lo que está escribiendo.
  const mostrado = valor ? etiqueta(valor) : texto;

  function buscar(q: string) {
    clearTimeout(timer.current);
    const n = ++pedido.current;
    if (q.trim().length < 3) {
      setOpciones([]);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lugares?q=${encodeURIComponent(q.trim())}`);
        const data: Lugar[] = res.ok ? await res.json() : [];
        if (n === pedido.current) {
          setOpciones(data);
          setActivo(-1);
        }
      } catch {
        if (n === pedido.current) setOpciones([]);
      }
    }, 300);
  }

  function elegir(l: Lugar) {
    onElegir(l);
    setTexto("");
    setAbierto(false);
    setOpciones([]);
  }

  const marcador =
    tipo === "origen" ? (
      <span className="absolute left-4 top-1/2 z-10 size-3 -translate-y-1/2 rounded-full border-[3px] border-tinta bg-white" />
    ) : (
      <span className="absolute left-4 top-1/2 z-10 size-3 -translate-y-1/2 bg-taxi outline-2 outline-tinta" />
    );

  return (
    <div className="relative">
      {marcador}
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded={abierto && opciones.length > 0}
        aria-controls={`${id}-lista`}
        aria-autocomplete="list"
        aria-label={placeholder}
        autoComplete="off"
        placeholder={placeholder}
        value={mostrado}
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierto(true);
          buscar(e.target.value);
          if (valor) onElegir(null);
        }}
        onFocus={() => setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
        onKeyDown={(e) => {
          if (!opciones.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActivo((a) => Math.min(a + 1, opciones.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActivo((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && activo >= 0) {
            e.preventDefault();
            elegir(opciones[activo]);
          } else if (e.key === "Escape") {
            setAbierto(false);
          }
        }}
        className="h-14 w-full rounded-xl bg-gris pl-11 pr-12 text-base text-tinta outline-none placeholder:text-apagado focus:bg-white focus:ring-2 focus:ring-tinta"
      />
      {extra}
      {abierto && opciones.length > 0 && (
        <ul
          id={`${id}-lista`}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-linea bg-white shadow-lg"
        >
          {opciones.map((o, i) => (
            <li
              key={`${o.lat},${o.lon},${i}`}
              role="option"
              aria-selected={i === activo}
              onMouseDown={(e) => {
                e.preventDefault();
                elegir(o);
              }}
              className={`cursor-pointer px-4 py-3 ${i === activo ? "bg-gris" : "hover:bg-gris"}`}
            >
              <div className="text-[15px] font-medium">{o.nombre}</div>
              {o.detalle && <div className="text-sm text-apagado">{o.detalle}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- Cotizador ----------

export function Cotizador({
  origenInicial = null,
  destinoInicial = null,
}: {
  origenInicial?: Lugar | null;
  destinoInicial?: Lugar | null;
}) {
  const [origen, setOrigen] = useState<Lugar | null>(origenInicial);
  const [destino, setDestino] = useState<Lugar | null>(destinoInicial);
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const fecha = dia && hora ? `${dia}T${hora}` : "";
  // 0 = todavía no eligió. Es obligatorio.
  const [pasajeros, setPasajeros] = useState(0);
  const [faltan, setFaltan] = useState<{ dia?: string; hora?: string; pasajeros?: string }>({});
  const [paso, setPaso] = useState<Paso>("form");
  const [recorrido, setRecorrido] = useState<Recorrido | null>(null);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [ubicando, setUbicando] = useState(false);
  const ultimo = useUltimoViaje();
  const origenRef = useRef<HTMLInputElement>(null);
  const raiz = useRef<HTMLDivElement>(null);

  const pedidoRuta = useRef(0);

  // Cotiza cuando la persona toca "Ver precio" (no automáticamente al elegir lugares).
  async function calcular(o: Lugar | null, d: Lugar | null) {
    const n = ++pedidoRuta.current;
    setRecorrido(null);
    if (!o || !d) {
      setPaso("form");
      return;
    }
    setPaso("cargando");
    setError("");
    try {
      const r = await fetch(`/api/ruta?o=${o.lat},${o.lon}&d=${d.lat},${d.lon}`);
      if (!r.ok) throw new Error();
      const data = (await r.json()) as Recorrido;
      if (n !== pedidoRuta.current) return;
      setRecorrido(data);
      setPaso("resultado");
      requestAnimationFrame(() => raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      if (n !== pedidoRuta.current) return;
      setError("No pudimos calcular el recorrido. Probá de nuevo o escribinos por WhatsApp.");
      setPaso("form");
    }
  }

  function cambiarOrigen(l: Lugar | null) {
    setOrigen(l);
    setAviso("");
    setError("");
  }

  function cambiarDestino(l: Lugar | null) {
    setDestino(l);
    setError("");
  }

  function verPrecio() {
    if (!origen) {
      setAviso("Elegí desde dónde salís en la lista de sugerencias.");
      origenRef.current?.focus();
      return;
    }
    if (!destino) {
      setAviso("Elegí a dónde vas en la lista de sugerencias.");
      return;
    }
    const f = {
      dia: dia ? "" : "Elegí la fecha",
      hora: hora ? "" : "Elegí la hora",
      pasajeros: pasajeros ? "" : "Elegí cuántos viajan",
    };
    setFaltan(f);
    if (f.dia || f.hora || f.pasajeros) {
      setAviso("");
      return;
    }
    setAviso("");
    calcular(origen, destino);
  }

  // El precio depende también de la fecha (recargo nocturno).
  const cotizacion: Cotizacion | null = useMemo(
    () =>
      origen && destino && recorrido
        ? cotizar({ origen, destino, km: recorrido.km, fecha: fecha ? new Date(fecha) : undefined })
        : null,
    [origen, destino, recorrido, fecha],
  );

  function usarUbicacion() {
    if (!navigator.geolocation) return;
    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(`/api/lugares?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const [l] = (await r.json()) as Lugar[];
          cambiarOrigen(
            l
              ? { ...l, lat: pos.coords.latitude, lon: pos.coords.longitude }
              : { nombre: "Mi ubicación", detalle: "", lat: pos.coords.latitude, lon: pos.coords.longitude },
          );
        } finally {
          setUbicando(false);
        }
      },
      () => setUbicando(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function volver() {
    pedidoRuta.current++;
    setPaso("form");
    setDestino(null);
    setRecorrido(null);
  }

  const viaje =
    origen && destino && cotizacion && recorrido
      ? {
          origen: etiqueta(origen),
          destino: etiqueta(destino),
          fecha,
          pasajeros,
          precio: formatoPrecio(cotizacion.precio),
          km: recorrido.km,
        }
      : null;

  // ---------- Resultado / reserva ----------
  if ((paso === "resultado" || paso === "enviado") && viaje && recorrido && cotizacion) {
    return (
      <div ref={raiz} className="scroll-mt-4 overflow-hidden rounded-2xl border border-linea bg-white">
        <div className="relative h-56 sm:h-64">
          <MapaRuta coords={recorrido.coords} />
          <button
            type="button"
            onClick={volver}
            aria-label="Cambiar el viaje"
            className="absolute left-3 top-3 grid size-10 place-items-center rounded-full bg-white shadow"
          >
            <Icono nombre="atras" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-sm text-apagado">
            {origen!.nombre} · {destino!.nombre}
          </p>
          <p className="text-sm text-apagado">
            {[fecha ? formatoFecha(fecha) : "", `${pasajeros} ${pasajeros === 1 ? "pasajero" : "pasajeros"}`]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <div className="mt-4 rounded-xl bg-taxi-suave px-4 py-3">
            <div className="flex flex-wrap items-end justify-between gap-x-3">
              <span className="text-4xl font-extrabold tracking-tight">{formatoPrecio(cotizacion.precio)}</span>
              <span className="whitespace-nowrap pb-1 text-sm text-taxi-texto">
                {Math.round(recorrido.km)} km · {formatoDuracion(recorrido.minutos)}
              </span>
            </div>
            <p className="text-sm text-taxi-texto">
              {cotizacion.nota}
              {cotizacion.nocturno && " Incluye recargo nocturno."}
            </p>
          </div>

          <ul className="mt-4 space-y-2 text-[15px]">
            {cotizacion.aeropuerto && (
              <li className="flex gap-2">
                <Icono nombre="check" className="size-5 shrink-0" /> Si el vuelo se atrasa, la espera no se cobra
              </li>
            )}
            <li className="flex gap-2">
              <Icono nombre="check" className="size-5 shrink-0" /> Todos los medios de pago
            </li>
            <li className="flex gap-2">
              <Icono nombre="check" className="size-5 shrink-0" /> Te confirmamos chofer, auto y patente
            </li>
          </ul>

          {paso === "resultado" && (
            <>
              <FormReserva
                viaje={viaje}
                aeropuerto={cotizacion.aeropuerto}
                pasajeros={pasajeros}
                onEnviado={() => {
                  guardarUltimoViaje({ origen: origen!, destino: destino! });
                  setPaso("enviado");
                }}
              />
              <a
                href={linkWhatsApp(mensajeConsulta(viaje))}
                target="_blank"
                rel="noopener"
                className="mt-4 block text-center text-sm underline underline-offset-4"
              >
                Solo quiero consultar por WhatsApp
              </a>
            </>
          )}

          {paso === "enviado" && (
            <p className="mt-6 rounded-xl bg-gris p-4 text-[15px]">
              Te abrimos WhatsApp con los datos del viaje. Mandá el mensaje y te confirmamos el precio y la reserva
              por ahí.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---------- Formulario ----------
  return (
    <div ref={raiz} className="scroll-mt-4">
      <div className="relative space-y-2">
        <span className="absolute bottom-7 left-[21px] top-7 z-10 w-0.5 bg-tinta" aria-hidden="true" />
        <CampoLugar
          tipo="origen"
          placeholder="Desde dónde salís"
          valor={origen}
          onElegir={cambiarOrigen}
          ref={origenRef}
          extra={
            <button
              type="button"
              onClick={usarUbicacion}
              aria-label="Usar mi ubicación"
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-tinta hover:bg-white"
            >
              <Icono nombre="ubicacion" className={`size-5 ${ubicando ? "animate-pulse" : ""}`} />
            </button>
          }
        />
        <CampoLugar tipo="destino" placeholder="A dónde vas" valor={destino} onElegir={cambiarDestino} />
      </div>

      {aviso && <p className="mt-2 text-sm font-medium">{aviso}</p>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 space-y-2">
        <CampoChico etiqueta="Cuándo" error={faltan.dia || faltan.hora}>
          <div className="space-y-2">
            <SelectorFecha
              valor={dia}
              error={!!faltan.dia}
              onValor={(v) => {
                setDia(v);
                setFaltan((f) => ({ ...f, dia: "" }));
              }}
            />
            <SelectorHora
              valor={hora}
              dia={dia}
              error={!!faltan.hora}
              onValor={(v) => {
                setHora(v);
                setFaltan((f) => ({ ...f, hora: "" }));
              }}
            />
          </div>
        </CampoChico>
      </div>
      <div className="mt-2">
        <CampoChico etiqueta="Pasajeros" error={faltan.pasajeros}>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Cantidad de pasajeros">
            {Array.from({ length: sitio.auto.pasajeros }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={pasajeros === n}
                onClick={() => {
                  setPasajeros(n);
                  setFaltan((f) => ({ ...f, pasajeros: "" }));
                }}
                className={`h-12 rounded-xl text-base font-bold ${
                  pasajeros === n ? "bg-tinta text-white" : "bg-gris text-tinta hover:bg-linea"
                } ${faltan.pasajeros ? "ring-2 ring-red-600" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-apagado">
            ¿Son más de {sitio.auto.pasajeros}? Sumamos otro chofer con su auto.{" "}
            <a
              href={linkWhatsApp(`Hola, somos más de ${sitio.auto.pasajeros} pasajeros y quiero consultar por un viaje.`)}
              target="_blank"
              rel="noopener"
              className="font-medium text-tinta underline underline-offset-4"
            >
              Consultanos
            </a>
          </p>
        </CampoChico>
      </div>
      {ultimo && !origen && !destino && (
        <button
          type="button"
          onClick={() => {
            setOrigen(ultimo.origen);
            setDestino(ultimo.destino);
          }}
          className="mt-3 flex h-10 items-center rounded-full border border-linea px-4 text-sm font-medium hover:bg-gris"
        >
          Repetir: {ultimo.destino.nombre}
        </button>
      )}

      <button
        type="button"
        onClick={verPrecio}
        className="mt-4 h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover"
      >
        {paso === "cargando" ? "Calculando…" : "Ver precio"}
      </button>
    </div>
  );
}

// ---------- Formulario de reserva ----------
// Arma el mensaje de WhatsApp con la reserva completa.

function FormReserva(props: {
  viaje: Parameters<typeof mensajeReserva>[0];
  aeropuerto: Aeropuerto | null;
  pasajeros: number;
  onEnviado: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [valijas, setValijas] = useState(1);
  const [vuelo, setVuelo] = useState("");
  const [horaVuelo, setHoraVuelo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  const a = props.aeropuerto;
  const etiquetaVuelo = a?.sentido === "ida" ? "Sale el vuelo" : "Aterriza el vuelo";
  const labelVuelo = a?.sentido === "ida" ? "Hora en que sale el vuelo" : "Hora en que aterriza el vuelo";

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (nombre.trim().length < 2) err.nombre = "Escribí tu nombre";
    if (a && !horaVuelo) err.horaVuelo = "Completá la hora del vuelo";
    setErrores(err);
    if (Object.keys(err).length) return;
    window.open(
      linkWhatsApp(
        mensajeReserva(
          props.viaje,
          {
            nombre: nombre.trim(),
            pasajeros: props.pasajeros,
            valijas: valijas === 4 ? "4 o más" : valijas,
            vuelo: vuelo.trim(),
            horaVuelo: a ? `${etiquetaVuelo}: ${horaVuelo} h` : "",
            comentarios: comentarios.trim(),
          },
        ),
      ),
      "_blank",
      "noopener",
    );
    props.onEnviado();
  }

  const campo =
    "h-12 w-full rounded-xl bg-gris px-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-tinta";

  return (
    <form onSubmit={enviar} noValidate className="mt-6 space-y-3 border-t border-linea pt-5">
      <Campo etiqueta="Nombre y apellido" error={errores.nombre}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
          className={campo}
        />
      </Campo>
      {a && (
        <Campo etiqueta="Número de vuelo (opcional)">
          <input
            value={vuelo}
            onChange={(e) => setVuelo(e.target.value.toUpperCase())}
            placeholder="AR 1302"
            className={campo}
          />
        </Campo>
      )}
      {a && (
        <CampoChico etiqueta={labelVuelo} error={errores.horaVuelo}>
          <SelectorHora
            valor={horaVuelo}
            etiqueta={labelVuelo}
            error={!!errores.horaVuelo}
            onValor={setHoraVuelo}
          />
        </CampoChico>
      )}
      {a?.sentido === "ida" && (
        <p className="text-sm text-apagado">Con el horario del vuelo te confirmamos a qué hora te buscamos.</p>
      )}
      <Campo etiqueta="Valijas">
        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Cantidad de valijas">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={valijas === n}
              onClick={() => setValijas(n)}
              className={`h-12 rounded-xl text-base font-bold ${
                valijas === n ? "bg-tinta text-white" : "bg-gris text-tinta hover:bg-linea"
              }`}
            >
              {n === 4 ? "4+" : n}
            </button>
          ))}
        </div>
      </Campo>
      <Campo etiqueta="Comentarios (opcional)">
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          rows={2}
          placeholder="Datos para la factura C, ida y vuelta, silla de bebé…"
          className="w-full rounded-xl bg-gris px-4 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-tinta"
        />
      </Campo>
      <button type="submit" className="h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover">
        Reservar
      </button>
      <p className="text-center text-sm text-apagado">
        Se abre WhatsApp con la reserva completa. Te confirmamos el precio y el horario por ahí.
      </p>
    </form>
  );
}

function CampoChico({ etiqueta, error, children }: { etiqueta: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{etiqueta}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </div>
  );
}

function Campo({ etiqueta, error, children }: { etiqueta: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-apagado">{etiqueta}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

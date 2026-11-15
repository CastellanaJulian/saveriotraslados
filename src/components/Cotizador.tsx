"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { sitio } from "@/config/sitio";
import { cotizar, formatoDuracion, formatoPrecio, type Cotizacion } from "@/lib/cotizar";
import { formatoFecha, linkWhatsApp, mensajeConsulta, mensajeReserva } from "@/lib/whatsapp";
import { Icono, type NombreIcono } from "./Icono";
import { MapaRuta } from "./MapaRuta";

export type Lugar = { nombre: string; detalle: string; lat: number; lon: number };

export type Frecuente = {
  lugar: Lugar;
  titulo: string;
  detalle: string;
  precio: string;
  icono: NombreIcono;
};

type Recorrido = { km: number; minutos: number; coords: [number, number][] };
type Paso = "form" | "cargando" | "resultado" | "reserva" | "enviado";

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
  frecuentes,
  destinoInicial = null,
}: {
  frecuentes: Frecuente[];
  destinoInicial?: Lugar | null;
}) {
  const [origen, setOrigen] = useState<Lugar | null>(null);
  const [destino, setDestino] = useState<Lugar | null>(destinoInicial);
  const [fecha, setFecha] = useState("");
  const [pasajeros, setPasajeros] = useState(1);
  const [paso, setPaso] = useState<Paso>("form");
  const [recorrido, setRecorrido] = useState<Recorrido | null>(null);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [ubicando, setUbicando] = useState(false);
  const ultimo = useUltimoViaje();
  const origenRef = useRef<HTMLInputElement>(null);
  const raiz = useRef<HTMLDivElement>(null);

  const pedidoRuta = useRef(0);

  // Cotiza solo cuando están origen y destino. Se llama desde los eventos que los cambian.
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
    calcular(l, destino);
  }

  function cambiarDestino(l: Lugar | null) {
    setDestino(l);
    calcular(origen, l);
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

  function elegirFrecuente(f: Frecuente) {
    cambiarDestino(f.lugar);
    if (!origen) {
      setAviso("Ahora decinos desde dónde salís.");
      origenRef.current?.focus();
    }
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
  if ((paso === "resultado" || paso === "reserva" || paso === "enviado") && viaje && recorrido && cotizacion) {
    return (
      <div ref={raiz} className="scroll-mt-4 overflow-hidden rounded-2xl border border-linea bg-white">
        <div className="relative h-44 sm:h-56">
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
            <div className="flex items-end justify-between gap-3">
              <span className="text-4xl font-extrabold tracking-tight">{formatoPrecio(cotizacion.precio)}</span>
              <span className="pb-1 text-sm text-taxi-texto">
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
              <Icono nombre="check" className="size-5 shrink-0" /> {sitio.chofer} · {sitio.auto.modelo}{" "}
              {sitio.auto.color} · {sitio.auto.patente}
            </li>
          </ul>

          {paso === "resultado" && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setPaso("reserva")}
                className="h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover"
              >
                Reservar
              </button>
              <a
                href={linkWhatsApp(mensajeConsulta(viaje))}
                target="_blank"
                rel="noopener"
                className="mt-4 block text-center text-sm underline underline-offset-4"
              >
                Consultar por WhatsApp
              </a>
            </div>
          )}

          {paso === "reserva" && (
            <FormReserva
              viaje={viaje}
              aeropuerto={cotizacion.aeropuerto}
              fecha={fecha}
              setFecha={setFecha}
              onEnviado={() => {
                guardarUltimoViaje({ origen: origen!, destino: destino! });
                setPaso("enviado");
              }}
            />
          )}

          {paso === "enviado" && (
            <p className="mt-6 rounded-xl bg-gris p-4 text-[15px]">
              Te abrimos WhatsApp con los datos del viaje. Mandá el mensaje y {sitio.chofer} te confirma la reserva
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
      {paso === "cargando" && <p className="mt-2 text-sm text-apagado">Calculando el recorrido…</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <label className="relative flex h-10 items-center gap-2 rounded-full bg-gris px-4 text-sm font-medium">
          <Icono nombre="reloj" className="size-4" />
          <span>{fecha ? formatoFecha(fecha) : "Cuándo"}</span>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            aria-label="Fecha y hora del viaje"
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <label className="relative flex h-10 items-center gap-2 rounded-full bg-gris px-4 text-sm font-medium">
          <Icono nombre="persona" className="size-4" />
          <span>
            {pasajeros} {pasajeros === 1 ? "pasajero" : "pasajeros"}
          </span>
          <select
            value={pasajeros}
            onChange={(e) => setPasajeros(Number(e.target.value))}
            aria-label="Cantidad de pasajeros"
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {Array.from({ length: sitio.auto.pasajeros }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {ultimo && !origen && !destino && (
          <button
            type="button"
            onClick={() => {
              setOrigen(ultimo.origen);
              setDestino(ultimo.destino);
              calcular(ultimo.origen, ultimo.destino);
            }}
            className="flex h-10 items-center rounded-full border border-linea px-4 text-sm font-medium hover:bg-gris"
          >
            Repetir: {ultimo.destino.nombre}
          </button>
        )}
      </div>

      <ul className="mt-4">
        {frecuentes.map((f) => (
          <li key={f.titulo} className="border-b border-linea last:border-0">
            <button
              type="button"
              onClick={() => elegirFrecuente(f)}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-taxi-suave text-taxi-texto">
                <Icono nombre={f.icono} className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium">{f.titulo}</span>
                <span className="block text-sm text-apagado">{f.detalle}</span>
              </span>
              <span className="text-[15px] font-bold">{f.precio}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Formulario de reserva ----------

function FormReserva(props: {
  viaje: Parameters<typeof mensajeReserva>[0];
  aeropuerto: boolean;
  fecha: string;
  setFecha: (v: string) => void;
  onEnviado: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vuelo, setVuelo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!props.fecha) err.fecha = "Elegí fecha y hora";
    if (nombre.trim().length < 2) err.nombre = "Escribí tu nombre";
    if (telefono.replace(/\D/g, "").length < 8) err.telefono = "Revisá el teléfono";
    setErrores(err);
    if (Object.keys(err).length) return;
    window.open(
      linkWhatsApp(
        mensajeReserva(
          { ...props.viaje, fecha: props.fecha },
          { nombre: nombre.trim(), telefono: telefono.trim(), vuelo: vuelo.trim(), comentarios: comentarios.trim() },
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
    <form onSubmit={enviar} noValidate className="mt-6 space-y-3">
      <Campo etiqueta="Fecha y hora" error={errores.fecha}>
        <input
          type="datetime-local"
          value={props.fecha}
          onChange={(e) => props.setFecha(e.target.value)}
          className={campo}
        />
      </Campo>
      <Campo etiqueta="Nombre" error={errores.nombre}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />
      </Campo>
      <Campo etiqueta="Teléfono" error={errores.telefono}>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          autoComplete="tel"
          placeholder="11 2345-6789"
          className={campo}
        />
      </Campo>
      {props.aeropuerto && (
        <Campo etiqueta="Número de vuelo (opcional)">
          <input
            value={vuelo}
            onChange={(e) => setVuelo(e.target.value)}
            placeholder="AR 1302"
            className={campo}
          />
        </Campo>
      )}
      <Campo etiqueta="Comentarios (opcional)">
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          rows={2}
          placeholder="Valijas, factura a nombre de la empresa, ida y vuelta…"
          className="w-full rounded-xl bg-gris px-4 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-tinta"
        />
      </Campo>
      <button type="submit" className="h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover">
        Enviar reserva
      </button>
      <p className="text-center text-sm text-apagado">Se abre WhatsApp con todos los datos para confirmar.</p>
    </form>
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

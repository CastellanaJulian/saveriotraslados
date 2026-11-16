"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { sitio } from "@/config/sitio";
import {
  cotizar,
  formatoDuracion,
  formatoPrecio,
  formatoUSD,
  type Aeropuerto,
  type Cotizacion,
  type Idioma,
} from "@/lib/cotizar";
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
  href: string;
  icono: NombreIcono;
};

// Textos del cotizador en los dos idiomas del sitio.
const TX = {
  es: {
    errorRuta: "No pudimos calcular el recorrido. Probá de nuevo o escribinos por WhatsApp.",
    elegiOrigen: "Elegí desde dónde salís en la lista de sugerencias.",
    elegiDestino: "Elegí a dónde vas en la lista de sugerencias.",
    elegiFecha: "Elegí la fecha",
    elegiHora: "Elegí la hora",
    elegiPasajeros: "Elegí cuántos viajan",
    miUbicacion: "Mi ubicación",
    cambiarViaje: "Cambiar el viaje",
    pasajero: "pasajero",
    pasajerosPl: "pasajeros",
    nota: "Precio aproximado, sujeto a confirmación. Incluye peajes.",
    nocturno: " Incluye recargo nocturno.",
    usd: (p: string) => `En dólares: ${p}`,
    usdConsultar: "",
    esperaVuelo: "Si el vuelo se atrasa, la espera no se cobra",
    wifi: "WiFi a bordo sin cargo",
    pagos: "Todos los medios de pago",
    confirmamos: "Te confirmamos chofer, auto y patente",
    soloConsultar: "Solo quiero consultar por WhatsApp",
    enviado:
      "Te abrimos WhatsApp con los datos del viaje. Mandá el mensaje y te confirmamos el precio y la reserva por ahí.",
    desde: "Desde dónde salís",
    usarUbicacion: "Usar mi ubicación",
    hasta: "A dónde vas",
    cuando: "Cuándo",
    pasajerosTitulo: "Pasajeros",
    cantidadPasajeros: "Cantidad de pasajeros",
    masDe: (n: number) => `¿Son más de ${n}? Sumamos otro chofer con su auto.`,
    masDeMensaje: (n: number) => `Hola, somos más de ${n} pasajeros y quiero consultar por un viaje.`,
    consultanos: "Consultanos",
    repetir: "Repetir",
    calculando: "Calculando…",
    verPrecio: "Ver precio",
    sale: "Sale el vuelo",
    aterriza: "Aterriza el vuelo",
    horaSale: "Hora en que sale el vuelo",
    horaAterriza: "Hora en que aterriza el vuelo",
    escribiNombre: "Escribí tu nombre",
    completaVuelo: "Completá la hora del vuelo",
    cuatroOMas: "4 o más",
    nombre: "Nombre y apellido",
    numeroVuelo: "Número de vuelo (opcional)",
    horarioIda: "Con el horario del vuelo te confirmamos a qué hora te buscamos.",
    valijas: "Valijas grandes",
    cantidadValijas: "Cantidad de valijas grandes",
    masValijas: (n: number) => `Con más de ${n} valijas grandes puede hacer falta otro auto. Te confirmamos por WhatsApp.`,
    entran: (e: string) => `Entran hasta ${e}.`,
    comentarios: "Comentarios (opcional)",
    comentariosEj: "Datos para la factura C, ida y vuelta, silla de bebé…",
    reservar: "Reservar",
    sinPago:
      "No pagás nada en la web. Se abre WhatsApp con la reserva completa y te confirmamos precio, chofer y patente antes del viaje. Tus datos solo se usan para tu reserva.",
  },
  en: {
    errorRuta: "We couldn't calculate the route. Try again or message us on WhatsApp.",
    elegiOrigen: "Pick your pickup point from the suggestions.",
    elegiDestino: "Pick your destination from the suggestions.",
    elegiFecha: "Pick a date",
    elegiHora: "Pick a time",
    elegiPasajeros: "Choose how many are traveling",
    miUbicacion: "My location",
    cambiarViaje: "Change the trip",
    pasajero: "passenger",
    pasajerosPl: "passengers",
    nota: "Approximate price, confirmed before the trip. Tolls included.",
    nocturno: " Includes night surcharge.",
    usd: (p: string) => `Or ${p} in US dollars`,
    usdConsultar: "Paying in US dollars? Ask us for the price on WhatsApp.",
    esperaVuelo: "If your flight is delayed, waiting time is free",
    wifi: "Free WiFi on board",
    pagos: "Cash in pesos or US dollars, transfer or card",
    confirmamos: "We confirm the driver, car and license plate",
    soloConsultar: "I just want to ask on WhatsApp",
    enviado: "WhatsApp is open with your trip details. Send the message and we'll confirm the price and booking there.",
    desde: "Pickup address",
    usarUbicacion: "Use my location",
    hasta: "Where to",
    cuando: "When",
    pasajerosTitulo: "Passengers",
    cantidadPasajeros: "Number of passengers",
    masDe: (n: number) => `More than ${n}? We add a second driver with his own car.`,
    masDeMensaje: (n: number) => `Hi, we are more than ${n} passengers and I'd like to ask about a trip.`,
    consultanos: "Ask us",
    repetir: "Repeat",
    calculando: "Calculating…",
    verPrecio: "See price",
    sale: "Flight departs",
    aterriza: "Flight lands",
    horaSale: "Flight departure time",
    horaAterriza: "Flight arrival time",
    escribiNombre: "Enter your name",
    completaVuelo: "Enter the flight time",
    cuatroOMas: "4 or more",
    nombre: "Full name",
    numeroVuelo: "Flight number (optional)",
    horarioIda: "With your flight time we'll confirm when we pick you up.",
    valijas: "Large suitcases",
    cantidadValijas: "Number of large suitcases",
    masValijas: (n: number) => `With more than ${n} large suitcases you may need a second car. We'll confirm on WhatsApp.`,
    entran: () => `Fits up to ${sitio.auto.valijas} large suitcases and ${sitio.auto.valijasMano} carry-ons.`,
    comentarios: "Comments (optional)",
    comentariosEj: "Round trip, child seat, a stop on the way…",
    reservar: "Book",
    sinPago:
      "You don't pay anything online. WhatsApp opens with your booking and we confirm the price, driver and license plate before the trip. Your details are only used for your booking.",
  },
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
  idioma = "es",
}: {
  origenInicial?: Lugar | null;
  destinoInicial?: Lugar | null;
  idioma?: Idioma;
}) {
  const t = TX[idioma];
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
      setError(t.errorRuta);
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
      setAviso(t.elegiOrigen);
      origenRef.current?.focus();
      return;
    }
    if (!destino) {
      setAviso(t.elegiDestino);
      return;
    }
    const f = {
      dia: dia ? "" : t.elegiFecha,
      hora: hora ? "" : t.elegiHora,
      pasajeros: pasajeros ? "" : t.elegiPasajeros,
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
              : { nombre: t.miUbicacion, detalle: "", lat: pos.coords.latitude, lon: pos.coords.longitude },
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
          precio:
            formatoPrecio(cotizacion.precio, idioma) +
            (idioma === "en" && cotizacion.precioUSD ? ` / ${formatoUSD(cotizacion.precioUSD)}` : ""),
          km: recorrido.km,
        }
      : null;

  // ---------- Resultado / reserva ----------
  if ((paso === "resultado" || paso === "enviado") && viaje && recorrido && cotizacion) {
    return (
      <div ref={raiz} className="scroll-mt-4 overflow-hidden rounded-2xl border border-linea bg-white">
        <div className="relative h-56 sm:h-64">
          <MapaRuta coords={recorrido.coords} idioma={idioma} />
          <button
            type="button"
            onClick={volver}
            aria-label={t.cambiarViaje}
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
            {[fecha ? formatoFecha(fecha, idioma) : "", `${pasajeros} ${pasajeros === 1 ? t.pasajero : t.pasajerosPl}`]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <div className="mt-4 rounded-xl bg-taxi-suave px-4 py-3">
            <div className="flex flex-wrap items-end justify-between gap-x-3">
              <span className="text-4xl font-extrabold tracking-tight">{formatoPrecio(cotizacion.precio, idioma)}</span>
              <span className="whitespace-nowrap pb-1 text-sm text-taxi-texto">
                {Math.round(recorrido.km)} km · {formatoDuracion(recorrido.minutos)}
              </span>
            </div>
            <p className="text-sm text-taxi-texto">
              {t.nota}
              {cotizacion.nocturno && t.nocturno}
            </p>
            {idioma === "en" && (
              <p className="mt-1 text-sm font-semibold text-taxi-texto">
                {cotizacion.precioUSD ? t.usd(formatoUSD(cotizacion.precioUSD)) : t.usdConsultar}
              </p>
            )}
          </div>

          <ul className="mt-4 space-y-2 text-[15px]">
            {cotizacion.aeropuerto && (
              <li className="flex gap-2">
                <Icono nombre="check" className="size-5 shrink-0" /> {t.esperaVuelo}
              </li>
            )}
            {sitio.auto.wifi && (
              <li className="flex gap-2">
                <Icono nombre="check" className="size-5 shrink-0" /> {t.wifi}
              </li>
            )}
            <li className="flex gap-2">
              <Icono nombre="check" className="size-5 shrink-0" /> {t.pagos}
            </li>
            <li className="flex gap-2">
              <Icono nombre="check" className="size-5 shrink-0" /> {t.confirmamos}
            </li>
          </ul>

          {paso === "resultado" && (
            <>
              <FormReserva
                viaje={viaje}
                aeropuerto={cotizacion.aeropuerto}
                pasajeros={pasajeros}
                idioma={idioma}
                onEnviado={() => {
                  guardarUltimoViaje({ origen: origen!, destino: destino! });
                  setPaso("enviado");
                }}
              />
              <a
                href={linkWhatsApp(mensajeConsulta(viaje, idioma))}
                target="_blank"
                rel="noopener"
                className="mt-4 block text-center text-sm underline underline-offset-4"
              >
                {t.soloConsultar}
              </a>
            </>
          )}

          {paso === "enviado" && (
            <p className="mt-6 rounded-xl bg-gris p-4 text-[15px]">
              {t.enviado}
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
          placeholder={t.desde}
          valor={origen}
          onElegir={cambiarOrigen}
          ref={origenRef}
          extra={
            <button
              type="button"
              onClick={usarUbicacion}
              aria-label={t.usarUbicacion}
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-tinta hover:bg-white"
            >
              <Icono nombre="ubicacion" className={`size-5 ${ubicando ? "animate-pulse" : ""}`} />
            </button>
          }
        />
        <CampoLugar tipo="destino" placeholder={t.hasta} valor={destino} onElegir={cambiarDestino} />
      </div>

      {aviso && <p className="mt-2 text-sm font-medium">{aviso}</p>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 space-y-2">
        <CampoChico etiqueta={t.cuando} error={faltan.dia || faltan.hora}>
          <div className="space-y-2">
            <SelectorFecha
              valor={dia}
              idioma={idioma}
              error={!!faltan.dia}
              onValor={(v) => {
                setDia(v);
                setFaltan((f) => ({ ...f, dia: "" }));
              }}
            />
            <SelectorHora
              valor={hora}
              dia={dia}
              idioma={idioma}
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
        <CampoChico etiqueta={t.pasajerosTitulo} error={faltan.pasajeros}>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={t.cantidadPasajeros}>
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
            {t.masDe(sitio.auto.pasajeros)}{" "}
            <a
              href={linkWhatsApp(t.masDeMensaje(sitio.auto.pasajeros))}
              target="_blank"
              rel="noopener"
              className="font-medium text-tinta underline underline-offset-4"
            >
              {t.consultanos}
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
          {t.repetir}: {ultimo.destino.nombre}
        </button>
      )}

      <button
        type="button"
        onClick={verPrecio}
        className="mt-4 h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover"
      >
        {paso === "cargando" ? t.calculando : t.verPrecio}
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
  idioma: Idioma;
  onEnviado: () => void;
}) {
  const t = TX[props.idioma];
  const [nombre, setNombre] = useState("");
  const [valijas, setValijas] = useState(1);
  const [vuelo, setVuelo] = useState("");
  const [horaVuelo, setHoraVuelo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});

  const a = props.aeropuerto;
  const etiquetaVuelo = a?.sentido === "ida" ? t.sale : t.aterriza;
  const labelVuelo = a?.sentido === "ida" ? t.horaSale : t.horaAterriza;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (nombre.trim().length < 2) err.nombre = t.escribiNombre;
    if (a && !horaVuelo) err.horaVuelo = t.completaVuelo;
    setErrores(err);
    if (Object.keys(err).length) return;
    window.open(
      linkWhatsApp(
        mensajeReserva(
          props.viaje,
          {
            nombre: nombre.trim(),
            pasajeros: props.pasajeros,
            valijas: valijas === 4 ? t.cuatroOMas : valijas,
            vuelo: vuelo.trim(),
            horaVuelo: a ? `${etiquetaVuelo}: ${horaVuelo}${props.idioma === "en" ? "" : " h"}` : "",
            comentarios: comentarios.trim(),
          },
          props.idioma,
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
      <Campo etiqueta={t.nombre} error={errores.nombre}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
          className={campo}
        />
      </Campo>
      {a && (
        <Campo etiqueta={t.numeroVuelo}>
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
            idioma={props.idioma}
            error={!!errores.horaVuelo}
            onValor={setHoraVuelo}
          />
        </CampoChico>
      )}
      {a?.sentido === "ida" && (
        <p className="text-sm text-apagado">{t.horarioIda}</p>
      )}
      <Campo etiqueta={t.valijas}>
        <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={t.cantidadValijas}>
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
        <p className="mt-2 text-sm text-apagado">
          {valijas > sitio.auto.valijas
            ? t.masValijas(sitio.auto.valijas)
            : t.entran(sitio.auto.equipaje)}
        </p>
      </Campo>
      <Campo etiqueta={t.comentarios}>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          rows={2}
          placeholder={t.comentariosEj}
          className="w-full rounded-xl bg-gris px-4 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-tinta"
        />
      </Campo>
      <button type="submit" className="h-14 w-full rounded-xl bg-taxi text-base font-bold text-tinta hover:bg-taxi-hover">
        {t.reservar}
      </button>
      <p className="text-center text-sm text-apagado">
        {t.sinPago}
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

"use client";

// Selectores propios de fecha y hora (estilo app de viajes), sin librerías.
// Fecha: "YYYY-MM-DD". Hora: "HH:MM" (24 h).

import { useEffect, useRef, useState } from "react";
import { Icono } from "./Icono";
import type { Idioma } from "@/lib/cotizar";

const T = {
  es: {
    locale: "es-AR",
    hoy: "Hoy",
    manana: "Mañana",
    sinElegir: "sin elegir",
    fecha: "Fecha del viaje",
    elegirDia: "Elegí el día",
    elegirFecha: "Elegir fecha",
    mesAnterior: "Mes anterior",
    mesSiguiente: "Mes siguiente",
    dias: ["lu", "ma", "mi", "ju", "vi", "sá", "do"],
    hora: "Hora",
    elegirHora: "Elegí la hora",
  },
  en: {
    locale: "en-US",
    hoy: "Today",
    manana: "Tomorrow",
    sinElegir: "not set",
    fecha: "Trip date",
    elegirDia: "Pick a date",
    elegirFecha: "Pick a date",
    mesAnterior: "Previous month",
    mesSiguiente: "Next month",
    dias: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    hora: "Time",
    elegirHora: "Pick a time",
  },
};

const DIAS_ADELANTE = 180;
const PASO_MINUTOS = 15;

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function desdeYmd(v: string) {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function hoyYmd() {
  return ymd(new Date());
}

export function textoDia(v: string, idioma: Idioma = "es") {
  const t = T[idioma];
  if (!v) return "";
  const hoy = new Date();
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  if (v === ymd(hoy)) return t.hoy;
  if (v === ymd(manana)) return t.manana;
  return desdeYmd(v).toLocaleDateString(t.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// Cierra el panel al tocar afuera o con Escape.
function useCerrarAfuera(abierto: boolean, cerrar: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const click = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cerrar();
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("pointerdown", click);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", click);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto, cerrar]);
  return ref;
}

function Disparador(props: {
  icono: "calendario" | "reloj";
  texto: string;
  vacio: boolean;
  abierto: boolean;
  error?: boolean;
  etiqueta: string;
  sinElegir: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={props.abierto}
      aria-label={`${props.etiqueta}: ${props.vacio ? props.sinElegir : props.texto}`}
      onClick={props.onClick}
      className={`flex h-14 w-full items-center gap-3 rounded-xl px-4 text-left text-base ${
        props.abierto ? "bg-white ring-2 ring-tinta" : "bg-gris"
      } ${props.error && !props.abierto ? "ring-2 ring-red-600" : ""}`}
    >
      <Icono nombre={props.icono} className="size-5 shrink-0" />
      <span
        className={`flex-1 first-letter:uppercase ${props.vacio ? "text-apagado" : "font-medium"}`}
      >
        {props.texto}
      </span>
      <Icono
        nombre="abajo"
        className={`size-4 shrink-0 transition ${props.abierto ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// ---------- Fecha ----------

export function SelectorFecha(props: {
  valor: string;
  onValor: (v: string) => void;
  error?: boolean;
  idioma?: Idioma;
}) {
  const idioma = props.idioma ?? "es";
  const t = T[idioma];
  const [abierto, setAbierto] = useState(false);
  const ref = useCerrarAfuera(abierto, () => setAbierto(false));
  const hoy = new Date();
  const min = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const max = new Date(
    min.getFullYear(),
    min.getMonth(),
    min.getDate() + DIAS_ADELANTE,
  );
  const base = props.valor ? desdeYmd(props.valor) : min;
  const [mes, setMes] = useState({ y: base.getFullYear(), m: base.getMonth() });

  const primero = new Date(mes.y, mes.m, 1);
  const offset = (primero.getDay() + 6) % 7; // semana empieza el lunes
  const diasMes = new Date(mes.y, mes.m + 1, 0).getDate();
  const titulo = primero.toLocaleDateString(t.locale, {
    month: "long",
    year: "numeric",
  });
  const puedeAtras =
    new Date(mes.y, mes.m, 1) > new Date(min.getFullYear(), min.getMonth(), 1);
  const puedeAdelante = new Date(mes.y, mes.m + 1, 1) <= max;

  function mover(n: number) {
    const d = new Date(mes.y, mes.m + n, 1);
    setMes({ y: d.getFullYear(), m: d.getMonth() });
  }

  return (
    <div ref={ref} className="relative">
      <Disparador
        icono="calendario"
        etiqueta={t.fecha}
        sinElegir={t.sinElegir}
        texto={props.valor ? textoDia(props.valor, idioma) : t.elegirDia}
        vacio={!props.valor}
        abierto={abierto}
        error={props.error}
        onClick={() => setAbierto((a) => !a)}
      />
      {abierto && (
        <div
          role="dialog"
          aria-label={t.elegirFecha}
          className="absolute inset-x-0 top-full z-40 mt-2 rounded-2xl border border-linea bg-white p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => mover(-1)}
              disabled={!puedeAtras}
              aria-label={t.mesAnterior}
              className="grid size-9 place-items-center rounded-full hover:bg-gris disabled:opacity-25"
            >
              <Icono nombre="izquierda" className="size-5" />
            </button>
            <span className="font-bold first-letter:uppercase">{titulo}</span>
            <button
              type="button"
              onClick={() => mover(1)}
              disabled={!puedeAdelante}
              aria-label={t.mesSiguiente}
              className="grid size-9 place-items-center rounded-full hover:bg-gris disabled:opacity-25"
            >
              <Icono nombre="derecha" className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-apagado">
            {t.dias.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {Array.from({ length: offset }, (_, i) => (
              <span key={`v${i}`} />
            ))}
            {Array.from({ length: diasMes }, (_, i) => {
              const fecha = new Date(mes.y, mes.m, i + 1);
              const v = ymd(fecha);
              const fuera = fecha < min || fecha > max;
              const elegido = v === props.valor;
              const esHoy = v === ymd(min);
              return (
                <button
                  key={v}
                  type="button"
                  disabled={fuera}
                  aria-pressed={elegido}
                  aria-label={fecha.toLocaleDateString(t.locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  onClick={() => {
                    props.onValor(v);
                    setAbierto(false);
                  }}
                  className={`mx-auto grid size-10 place-items-center rounded-full text-[15px] ${
                    elegido
                      ? "bg-tinta font-bold text-white"
                      : fuera
                        ? "text-linea"
                        : `hover:bg-gris ${esHoy ? "font-bold ring-1 ring-tinta" : ""}`
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Hora ----------

export function SelectorHora(props: {
  valor: string;
  onValor: (v: string) => void;
  error?: boolean;
  etiqueta?: string;
  dia?: string; // si es hoy, se bloquean los horarios que ya pasaron
  idioma?: Idioma;
}) {
  const t = T[props.idioma ?? "es"];
  const [abierto, setAbierto] = useState(false);
  const ref = useCerrarAfuera(abierto, () => setAbierto(false));
  const lista = useRef<HTMLUListElement>(null);

  const ahora = new Date();
  const esHoy = props.dia === ymd(ahora);
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const horas = Array.from({ length: (24 * 60) / PASO_MINUTOS }, (_, i) => {
    const t = i * PASO_MINUTOS;
    return {
      v: `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
      pasada: esHoy && t <= minutosAhora,
    };
  });

  // Al abrir, muestra la hora elegida o la primera disponible desde las 7.
  useEffect(() => {
    if (!abierto || !lista.current) return;
    const destino =
      lista.current.querySelector<HTMLElement>('[aria-selected="true"]') ??
      lista.current.querySelector<HTMLElement>('[data-sugerida="true"]');
    destino?.scrollIntoView({ block: "center" });
  }, [abierto]);

  const sugerida =
    horas.find((h) => !h.pasada && h.v >= "07:00")?.v ??
    horas.find((h) => !h.pasada)?.v;

  return (
    <div ref={ref} className="relative">
      <Disparador
        icono="reloj"
        etiqueta={props.etiqueta ?? t.hora}
        sinElegir={t.sinElegir}
        texto={
          props.valor
            ? props.idioma === "en"
              ? props.valor
              : `${props.valor} h`
            : t.elegirHora
        }
        vacio={!props.valor}
        abierto={abierto}
        error={props.error}
        onClick={() => setAbierto((a) => !a)}
      />
      {abierto && (
        <ul
          ref={lista}
          role="listbox"
          aria-label={props.etiqueta ?? t.hora}
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-linea bg-white py-2 shadow-xl"
        >
          {horas.map((h) => (
            <li
              key={h.v}
              role="option"
              aria-selected={h.v === props.valor}
              data-sugerida={h.v === sugerida}
            >
              <button
                type="button"
                disabled={h.pasada}
                onClick={() => {
                  props.onValor(h.v);
                  setAbierto(false);
                }}
                className={`block w-full px-5 py-3 text-left text-base ${
                  h.pasada
                    ? "cursor-not-allowed text-linea"
                    : h.v === props.valor
                      ? "bg-gris font-bold"
                      : "hover:bg-gris focus:bg-gris focus:outline-none"
                }`}
              >
                {h.v}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

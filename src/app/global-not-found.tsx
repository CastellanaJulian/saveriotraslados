import type { Metadata } from "next";
import Link from "next/link";
import { geist } from "@/lib/fuente";
import { sitio } from "@/config/sitio";
import "./globals.css";

// 404 para direcciones que no existen. Hace falta porque el sitio tiene dos layouts raíz (español e inglés).
export const metadata: Metadata = {
  title: `Página no encontrada | ${sitio.nombre}`,
};

export default function NoEncontrada() {
  return (
    <html lang="es-AR" className={`${geist.variable} antialiased`}>
      <body className="grid min-h-dvh place-items-center px-4 font-sans">
        <div className="max-w-md">
          <p className="text-sm text-apagado">{sitio.nombre}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">No encontramos esta página</h1>
          <p className="mt-3 text-apagado">Puede que el link esté mal escrito o que la página ya no exista.</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            <Link href="/" className="underline underline-offset-4">
              Cotizar un viaje
            </Link>
            <Link href="/en" lang="en" className="underline underline-offset-4">
              English version
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

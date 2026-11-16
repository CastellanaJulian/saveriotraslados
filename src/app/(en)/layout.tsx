import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { geist } from "@/lib/fuente";
import { sitio } from "@/config/sitio";
import { Encabezado, Pie } from "@/components/Marco";
import "../globals.css";

// Versión en inglés (/en) para pasajeros que llegan del exterior. Layout raíz propio para tener lang="en".
const description =
  "Private airport transfers in Buenos Aires: Ezeiza (EZE) and Aeroparque (AEP). Get a price instantly, book on WhatsApp, pay in pesos or US dollars.";

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `Buenos Aires Airport Transfers: Ezeiza and Aeroparque | ${sitio.nombre}`,
    template: `%s | ${sitio.nombre}`,
  },
  description,
  alternates: { canonical: "/en", languages: { "es-AR": "/", en: "/en", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: sitio.nombre,
    title: sitio.nombre,
    description,
  },
  formatDetection: { telephone: false },
  applicationName: sitio.nombre,
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function LayoutIngles({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <Encabezado idioma="en" />
        <main className="flex-1">{children}</main>
        <Pie idioma="en" />
        <Analytics />
      </body>
    </html>
  );
}

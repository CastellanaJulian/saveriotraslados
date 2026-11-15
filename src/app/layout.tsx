import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { sitio } from "@/config/sitio";
import { Encabezado, Pie } from "@/components/Marco";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

const descripcion = `Traslados a Ezeiza, Aeroparque y viajes de media distancia desde CABA y Gran Buenos Aires. Cotizá al instante y reservá por WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `Traslados a Ezeiza, Aeroparque y viajes | ${sitio.nombre}`,
    template: `%s | ${sitio.nombre}`,
  },
  description: descripcion,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: sitio.nombre,
    title: sitio.nombre,
    description: descripcion,
  },
  formatDetection: { telephone: false },
  applicationName: sitio.nombre,
  // Search Console: si se verifica por etiqueta HTML, cargar el código en Vercel como GOOGLE_SITE_VERIFICATION.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${geist.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <Encabezado />
        <main className="flex-1">{children}</main>
        <Pie />
      </body>
    </html>
  );
}

import type { NextConfig } from "next";

// Sitio 100% estático (mejor para SEO y velocidad). Sin Cache Components:
// las páginas de ruta se generan en el build con generateStaticParams.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

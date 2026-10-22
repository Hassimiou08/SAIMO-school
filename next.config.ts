import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le site public d'une école s'enregistre en une action avec son logo et sa
  // photo d'accueil (images redimensionnées) : on dépasse parfois 1 Mo.
  experimental: {
    serverActions: { bodySizeLimit: "3mb" },
  },
  // Le service worker (mode hors ligne) doit toujours être revérifié par le
  // navigateur, sinon une nouvelle version mettrait longtemps à s'installer.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;

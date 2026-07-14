import type { NextConfig } from "next";

// basePath para GitHub Pages (p. ej. "/clasesia"). Vacío = raíz de dominio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Coolify/Docker → standalone (servidor Node). Por defecto → export estático
  // (para GitHub Pages / cualquier hosting estático). La app es 100% cliente.
  output: process.env.BUILD_STANDALONE ? "standalone" : "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

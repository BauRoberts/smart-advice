/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "localhost"],
  },
  experimental: {
    // Esto permite que las páginas y rutas de API con contenido dinámico se compilen correctamente
    appDir: true,
  },
};

module.exports = nextConfig;

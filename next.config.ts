import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ⚠️ Desactivar ESLint durante build (solo para deployment)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ También ignorar errores de TypeScript durante build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'irukhaxtflhvhewuzzfq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Optimizaciones de performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Compresión
  compress: true,
};

export default nextConfig;

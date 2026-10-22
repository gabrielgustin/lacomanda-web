/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

// PREVIEW_EXPORT=1 genera un sitio estático en out/ (sin optimizador de imágenes) para previsualizarlo.
if (process.env.PREVIEW_EXPORT) {
  nextConfig.output = 'export'
  nextConfig.images = { unoptimized: true }
}

export default nextConfig

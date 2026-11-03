/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 solo permite la calidad 75 (se nota en degradés oscuros y caras): todas las fotos salen a 90.
    qualities: [90],
  },
}

// PREVIEW_EXPORT=1 genera un sitio estático en out/ (sin optimizador de imágenes) para previsualizarlo.
if (process.env.PREVIEW_EXPORT) {
  nextConfig.output = 'export'
  nextConfig.images = { unoptimized: true }
}

export default nextConfig

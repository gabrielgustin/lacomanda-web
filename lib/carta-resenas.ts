import type { GoogleReview } from '@/lib/google-reviews'

// Dónde vive el backoffice de la carta (comparte la base con las reservas). En local se pisa con CARTA_ORIGIN.
export const CARTA_ORIGIN = process.env.CARTA_ORIGIN ?? 'https://lacomanda-xi.vercel.app'

/** Reseñas que el local carga y edita en su backoffice. null si no se pudo leer (la web usa las de respaldo). */
export async function getCartaResenas(): Promise<GoogleReview[] | null> {
  try {
    const res = await fetch(`${CARTA_ORIGIN}/carta/api/resenas`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = (await res.json()) as { resenas?: { autor: string; texto: string; estrellas: number | null }[] }
    if (!Array.isArray(data.resenas)) return null
    return data.resenas.map((r) => ({ author: r.autor, text: r.texto, rating: r.estrellas ?? undefined, when: 'Reseña de Google' }))
  } catch (error) {
    console.error('No se pudieron leer las reseñas del backoffice', error)
    return null
  }
}

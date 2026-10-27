// Reseñas reales de Google (Places API, versión nueva). Se piden del lado del servidor y se refrescan una vez por día.
// Requiere GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID (ver .env.example). Sin ellas devuelve null.

export type GoogleReview = {
  author: string
  authorUrl?: string
  rating: number
  text: string
  when: string
}

export type GooglePlace = {
  rating?: number
  total?: number
  mapsUrl?: string
  reviews: GoogleReview[]
}

type ApiReview = {
  rating?: number
  relativePublishTimeDescription?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string; uri?: string }
}

export async function getGooglePlace(): Promise<GooglePlace | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!key || !placeId) return null

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=es`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
      next: { revalidate: 60 * 60 * 24 },
    })
    if (!res.ok) {
      console.error(`Google Places respondió ${res.status}: ${await res.text()}`)
      return null
    }
    const data = (await res.json()) as {
      rating?: number
      userRatingCount?: number
      googleMapsUri?: string
      reviews?: ApiReview[]
    }
    return {
      rating: data.rating,
      total: data.userRatingCount,
      mapsUrl: data.googleMapsUri,
      reviews: (data.reviews ?? [])
        .map((review) => ({
          author: review.authorAttribution?.displayName ?? 'Cliente de Google',
          authorUrl: review.authorAttribution?.uri,
          rating: review.rating ?? 5,
          text: (review.text?.text ?? review.originalText?.text ?? '').trim(),
          when: review.relativePublishTimeDescription ?? '',
        }))
        .filter((review) => review.text),
    }
  } catch (error) {
    // Si Google no responde, la sección sigue andando sin reseñas en lugar de romper la página.
    console.error('No se pudieron traer las reseñas de Google', error)
    return null
  }
}

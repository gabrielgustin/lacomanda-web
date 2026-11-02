'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { SplitTitle } from '@/components/ui'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import type { GooglePlace, GoogleReview } from '@/lib/google-reviews'

// Reseñas reales de Google elegidas a mano (texto tal como lo escribió cada persona). Si más adelante se conecta la API
// de Google Places (GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID), las que traiga la API reemplazan a estas.
// Sin fecha ("hace X años" quedaría desactualizado) y sin estrellas hasta cargar la nota real de cada una:
// agregar `rating: 5` (entero de 1 a 5, tal como figura en Google) a una reseña y se muestran sus estrellas.
const curated: GoogleReview[] = [
  {
    author: 'Florencia Elena Gomez',
    text: 'Muy rico el lomo, buena atención. Lugar limpio, tranquilo. Me gusto',
  },
  {
    author: 'Eugenia',
    text: 'Excelente atención!! Muy buena la promo de la pizza los domingos.\nMuy ricos los postres.',
  },
  {
    author: 'Eleonora Valvasori',
    text: 'Excelentes todos los platos, abundantes, ricos, y precios acordes. Atención muy amable. El baño limpio tiene cambiador cómodo (si hay niños o bebés). Súper!',
  },
  {
    author: 'ceci ceci',
    text: 'Muy rico los menúes\nPedimos matambre muy rico, ravioles súper caseros, milanesa....\nEl lugar es muy agradable\nSirven rápido\nLa atención es excelente todos muy atentos!',
  },
  {
    author: 'Rosario Concioni',
    text: 'Excelente lugar para ir a almorzar, los menu ejecutivos son abundantes y muy ricos, y el precio es muy razonable! La atención excelente',
  },
  {
    author: 'Juan Manuel Arroyo',
    text: 'Hermoso lugar para compartir un lindo momento y desayunar, merendar o cenar algo muy rico.\nTotalmente recomendable!!',
  },
  {
    author: 'Fede Morales Rampulla',
    text: 'Muy buena atención y mucho mejor sus sandwiches que está de más decir son abundantes, ricos, tiernos!',
  },
  {
    author: 'Gabriela Valcelli',
    text: 'Nos sorprendió este lugar lo rico que se come, encontramos que en el cerro hacen cosas con mollejas de lo que somos fans. Pedimos pizza de molleja, sándwich de mollejas y los sándwiches de entraña terribleeee',
  },
].map((review) => ({ ...review, when: 'Reseña de Google' }))

const formatRating = (n: number) => n.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const arrow =
  'inline-flex size-11 items-center justify-center rounded-full border border-primary/30 text-primary outline-none transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground disabled:pointer-events-none disabled:opacity-30'

// Tira horizontal con scroll propio (dedo, trackpad o flechas): no depende del scroll vertical de la página.
export function Reviews({ place }: { place: GooglePlace | null }) {
  const real = place?.reviews ?? []
  const reviews = real.length ? real : curated
  const mapsUrl = place?.mapsUrl ?? site.mapsUrl

  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [measure])

  const scrollBy = (direction: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')?.getBoundingClientRect().width ?? 360
    el.scrollBy({ left: direction * (card + 24), behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="resenas-title" className="relative z-10 overflow-x-clip bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-end justify-between gap-6 px-5 md:px-8">
        <div>
          <SplitTitle
            id="resenas-title"
            lines={['Lo que dicen', 'en la mesa']}
            className="text-[clamp(2.6rem,6vw,5rem)] text-primary"
          />
          {place?.rating && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-baseline gap-3 rounded-sm text-primary hover:opacity-80"
            >
              <span className="font-display text-3xl">{formatRating(place.rating)}</span>
              <span className="text-sm text-muted-foreground">
                de 5 en Google{place.total ? `, ${place.total.toLocaleString('es-AR')} reseñas` : ''}
              </span>
            </a>
          )}
        </div>
        <div className={cn('hidden gap-3 md:flex', edges.start && edges.end && 'md:hidden')}>
          <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Reseñas anteriores" className={arrow}>
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Reseñas siguientes" className={arrow}>
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="scrollbar-hide mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-6 overflow-x-auto overscroll-x-contain px-5 pb-10 pt-4 md:scroll-pl-8 md:px-8 lg:scroll-pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-90rem)/2+2rem))]"
      >
        {reviews.map((review, index) => (
          <li key={index} className="w-[82vw] shrink-0 snap-start sm:w-[360px] lg:w-[400px]" style={{ rotate: `${[-1.5, 1, -0.5, 1.5, -1][index % 5]}deg` }}>
            <div className="ticket-shadow">
              <article className="ticket flex min-h-[340px] flex-col justify-between px-6 pt-6 md:px-7">
                <div>
                  <p className="flex justify-between gap-4 text-xs font-bold">
                    <span>{review.when}</span>
                  </p>
                  <div className="ticket-rule my-3" />
                  <blockquote
                    className={cn(
                      'font-display whitespace-pre-line leading-snug text-primary',
                      real.length > 0 && 'line-clamp-[8]',
                      review.text.length > 180 ? 'text-base md:text-lg' : 'text-lg md:text-xl',
                    )}
                  >
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                </div>
                <p className="mt-6 flex items-baseline justify-between gap-4 text-xs">
                  {review.authorUrl ? (
                    <a href={review.authorUrl} target="_blank" rel="noreferrer" className="rounded-sm underline underline-offset-4">
                      {review.author}
                    </a>
                  ) : (
                    <span>{review.author}</span>
                  )}
                  {review.rating ? (
                    <span className="flex shrink-0 gap-0.5 text-accent" role="img" aria-label={`${review.rating} de 5 estrellas`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={cn('size-3.5', i < Math.round(review.rating!) ? 'fill-current' : 'opacity-30')} aria-hidden="true" />
                      ))}
                    </span>
                  ) : null}
                </p>
              </article>
            </div>
          </li>
        ))}
        <li className="flex w-[82vw] shrink-0 snap-start flex-col items-center justify-center border-2 border-dashed border-primary/30 p-8 text-center sm:w-[380px]">
          <p className="max-w-[16rem] text-sm text-muted-foreground">¿Ya viniste? Contanos cómo te fue.</p>
          <a
            href={site.reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 rounded-full text-sm font-semibold text-primary underline underline-offset-4"
          >
            Dejanos tu reseña en Google
          </a>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-3 rounded-full text-xs text-muted-foreground underline underline-offset-4">
            Ver todas las reseñas
          </a>
        </li>
      </ul>
    </section>
  )
}

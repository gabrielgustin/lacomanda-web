'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'
import { site } from '@/lib/site'

// TODO: textos de ejemplo. Reemplazar por reseñas reales de clientes (con su permiso) antes de publicar.
const reviews = [
  { quote: 'Las papas jodidas son un peligro: pedimos una para compartir y terminamos pidiendo tres.', author: 'Cliente de ejemplo' },
  { quote: 'Fuimos al cumple de una amiga, éramos quince y nos atendieron re bien. La pizza La Comanda, top.', author: 'Cliente de ejemplo' },
  { quote: 'El bife de chorizo vino justo como lo pedí. Chopp bien frío y buena música. Volvemos seguro.', author: 'Cliente de ejemplo' },
  { quote: 'Las fajitas para compartir son ideales. Seis salsas y todas buenísimas.', author: 'Cliente de ejemplo' },
  { quote: 'Lugar cálido, precios justos y una burger de costillas que no me olvido más.', author: 'Cliente de ejemplo' },
]

export function Reviews() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // En escritorio la sección queda fija y las tarjetas se desplazan de costado.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const el = track.current!
        const distance = () => el.scrollWidth - el.clientWidth
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="resenas-title" className="relative z-10 flex flex-col justify-center overflow-x-clip bg-background py-20 lg:min-h-svh">
      <div className="mx-auto w-full max-w-[90rem] px-5 md:px-8">
        <SplitTitle
          id="resenas-title"
          lines={['Lo que dicen', 'en la mesa']}
          className="text-[clamp(2.6rem,6vw,5rem)] text-primary"
        />
      </div>

      <ul
        ref={track}
        className="scrollbar-hide mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-10 pt-4 md:px-8 lg:snap-none lg:overflow-visible"
      >
        {reviews.map((review, index) => (
          <li key={index} className="w-[82vw] shrink-0 snap-start sm:w-[360px] lg:w-[400px]" style={{ rotate: `${[-1.5, 1, -0.5, 1.5, -1][index % 5]}deg` }}>
            <div className="ticket-shadow">
              <div className="ticket flex min-h-[320px] flex-col justify-between px-6 pt-6 md:px-7">
                <div>
                  <p className="flex justify-between text-xs font-bold">
                    <span>Mesa {String(index * 3 + 4).padStart(2, '0')}</span>
                    <span>5 de 5</span>
                  </p>
                  <div className="ticket-rule my-3" />
                  <blockquote className="font-display text-xl leading-snug text-primary md:text-2xl">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                </div>
                <p className="mt-6 text-xs">{review.author}</p>
              </div>
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
        </li>
      </ul>
    </section>
  )
}

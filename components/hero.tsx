'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowDown, Star } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { site } from '@/lib/site'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Entrada: la foto se acerca y el título sube línea por línea.
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .from('[data-hero-img]', { scale: 1.25, duration: 2.2, ease: 'power3.out' })
        .from('[data-hero-line]', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.2)
        .from('[data-hero-side]', { opacity: 0, y: 12, duration: 0.9, stagger: 0.1 }, 0.7)
        .from('[data-hero-foot]', { opacity: 0, y: 24, duration: 1, stagger: 0.1 }, 0.9)

      // Al bajar, el hero queda fijo, se oscurece y el panel siguiente se apila encima.
      gsap.to('[data-hero-content]', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-img]', {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section
      id="inicio"
      ref={root}
      aria-labelledby="hero-title"
      className="sticky top-0 z-0 flex h-svh min-h-[600px] flex-col overflow-hidden bg-ink text-primary-foreground"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          data-hero-img
          src="/fotos/principales.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/85" />
      </div>

      <div data-hero-content className="relative flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-5">
          <div className="flex w-full max-w-6xl items-center justify-center gap-6 md:gap-10">
            <p data-hero-side className="eyebrow hidden w-36 text-right text-primary-foreground/80 md:block">
              Cocina para compartir
            </p>
            <h1 id="hero-title" className="font-display whitespace-nowrap text-center text-[clamp(2.2rem,6.5vw,5rem)] leading-[0.9]">
              <span className="-mt-[0.18em] block overflow-hidden pb-[0.06em] pt-[0.18em]">
                <span data-hero-line className="block">
                  Lo bueno
                </span>
              </span>
              <span className="-mt-[0.18em] block overflow-hidden pb-[0.06em] pt-[0.18em]">
                <span data-hero-line className="block">
                  se comparte
                </span>
              </span>
            </h1>
            <p data-hero-side className="eyebrow hidden w-36 text-primary-foreground/80 md:block">
              Desde {site.since}
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-8 md:pb-10">
          <p data-hero-foot className="max-w-sm text-sm leading-relaxed text-primary-foreground/85 text-pretty">
            En La Comanda la mesa siempre es larga: burgers que chorrean, pizzas al horno, bifes como en casa y
            cerveza bien fría. Vení con hambre y con amigos.
          </p>

          <div data-hero-foot className="flex items-center gap-4">
            {site.rating ? (
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-card px-5 py-4 text-foreground shadow-md"
              >
                <span className="font-display text-4xl text-primary">{site.rating.score}</span>
                <span className="text-xs leading-tight">
                  <span className="mb-1 flex gap-0.5 text-accent" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="font-semibold">Excelente en Google</span>
                  <br />
                  <span className="text-muted-foreground">{site.rating.reviews} reseñas</span>
                </span>
              </a>
            ) : (
              <a
                href="#platos"
                className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/40 py-2 pl-5 pr-2 text-xs font-semibold transition-colors hover:bg-primary-foreground hover:text-primary"
              >
                ¿Qué tenés ganas de comer?
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-foreground text-primary">
                  <ArrowDown className="size-4" aria-hidden="true" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

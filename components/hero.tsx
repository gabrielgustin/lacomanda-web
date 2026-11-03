'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink } from '@/components/ui'
import { site } from '@/lib/site'
import { OpenStatus } from '@/components/open-status'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Único momento orquestado: la foto se asienta y el título sube.
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .from('[data-hero-img]', { scale: 1.2, duration: 2.2, ease: 'power3.out' })
        .from('[data-hero-line]', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.2)
        .from('[data-hero-foot]', { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 0.7)

      // Al bajar, el hero queda fijo y se oscurece: solo en escritorio (lg), donde es fijo.
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.to('[data-hero-content]', {
          yPercent: -14,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-hero-img]', {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section
      id="inicio"
      data-tone="dark"
      ref={root}
      aria-labelledby="hero-title"
      className="relative z-0 flex min-h-svh flex-col overflow-hidden bg-ink text-primary-foreground lg:sticky lg:top-0 lg:h-svh lg:min-h-[640px]"
    >
      {/* El cartel de la foto está al tercio de la altura: el texto va abajo (justify-end) para no pisarlo. */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          data-hero-img
          src="/fotos/local-noche.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/50" />
      </div>

      <div
        data-hero-content
        className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pb-10 pt-28 md:px-8 md:pb-14"
      >
        <div>
          {/* Dónde y si está abierto: lo primero que se pregunta quien llega. */}
          <div data-hero-foot className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-foreground/85">
            <span>{site.address} · Cerro de las Rosas</span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-primary-foreground/30 sm:block" />
            <OpenStatus />
          </div>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9]"
            aria-label="Lo bueno se comparte"
          >
            <span className="-mb-[0.1em] -mt-[0.18em] block overflow-hidden pb-[0.2em] pt-[0.18em]" aria-hidden="true">
              <span data-hero-line className="block">
                Lo bueno
              </span>
            </span>
            <span className="-mb-[0.1em] -mt-[0.18em] block overflow-hidden pb-[0.2em] pt-[0.18em]" aria-hidden="true">
              <span data-hero-line className="block text-accent">
                se comparte
              </span>
            </span>
          </h1>
          <div data-hero-foot className="mt-8 flex flex-wrap gap-3">
            <PillLink href="#reservas" variant="cream" className="h-12 px-7">
              Reservá tu mesa
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  )
}

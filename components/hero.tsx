'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink } from '@/components/ui'
import { site } from '@/lib/site'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Al bajar, el hero queda fijo y se oscurece: solo en escritorio (lg), donde es fijo.
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.to('[data-hero-content]', {
          yPercent: -14,
          opacity: 0,
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
          src="/fotos/fachada-noche.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20 max-md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/50 max-md:from-ink/70 max-md:via-transparent max-md:via-50% max-md:to-ink/15" />
      </div>

      <div
        data-hero-content
        className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pb-10 pt-28 md:px-8 md:pb-14"
      >
        <div>
          {/* Dónde queda: lo primero que se pregunta quien llega. */}
          <p className="mb-6 text-sm text-primary-foreground/85">
            {site.address} · Cerro de las Rosas
          </p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9]"
            aria-label="Lo bueno se comparte"
          >
            <span className="-mb-[0.1em] -mt-[0.18em] block overflow-hidden pb-[0.2em] pt-[0.18em]" aria-hidden="true">
              <span className="block">
                Lo bueno
              </span>
            </span>
            <span className="-mb-[0.1em] -mt-[0.18em] block overflow-hidden pb-[0.2em] pt-[0.18em]" aria-hidden="true">
              <span className="block text-accent">
                se comparte
              </span>
            </span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href="#reservas" variant="cream" className="h-12 px-7">
              Reservá tu mesa
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink } from '@/components/ui'
import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'
import { site } from '@/lib/site'

// Pedido de ejemplo que se imprime en el ticket del hero (precios de la carta).
const order = [
  { id: 'entradas-papas-jodidas', qty: 1 },
  { id: 'pizzas-la-comanda', qty: 1 },
  { id: 'burgers-de-costillas', qty: 2 },
  { id: 'cervezas-chopp-pinta', qty: 4 },
]
  .filter((line) => itemsById[line.id])
  .map((line) => ({ ...line, item: itemsById[line.id] }))
const orderTotal = order.reduce((sum, line) => sum + line.item.price * line.qty, 0)

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Único momento orquestado: el título sube y el ticket se imprime de arriba hacia abajo.
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .from('[data-hero-img]', { scale: 1.2, duration: 2.2, ease: 'power3.out' })
        .from('[data-hero-line]', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.2)
        .from('[data-hero-foot]', { opacity: 0, y: 20, duration: 0.9, stagger: 0.1 }, 0.7)
        .from(
          '[data-ticket]',
          { clipPath: 'inset(0 0 100% 0)', y: -24, duration: 2, ease: 'steps(22)' },
          0.9,
        )
        .from('[data-stamp]', { scale: 2.4, opacity: 0, rotate: -24, duration: 0.35, ease: 'power4.in' }, '>-0.1')

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
    },
    { scope: root },
  )

  return (
    <section
      id="inicio"
      ref={root}
      aria-labelledby="hero-title"
      className="relative z-0 flex min-h-svh flex-col overflow-hidden bg-ink text-primary-foreground lg:sticky lg:top-0 lg:h-svh lg:min-h-[640px]"
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
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/50" />
      </div>

      <div
        data-hero-content
        className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end gap-10 px-5 pb-10 pt-28 md:px-8 md:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12"
      >
        <div>
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.4rem,10.5vw,9.5rem)] leading-[0.88]"
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
          <p data-hero-foot className="mt-8 max-w-md text-base leading-relaxed text-primary-foreground/90 text-pretty">
            Mesas largas, burgers que chorrean, pizzas al horno y cerveza bien fría. Desde {site.since} se pide al
            centro y nadie mira el reloj.
          </p>
          <div data-hero-foot className="mt-7 flex flex-wrap gap-3">
            <PillLink href="#reservas" variant="cream" className="h-12 px-7">
              Reservá tu mesa
            </PillLink>
            <PillLink href="#platos" variant="outline-light" className="h-12 px-7">
              Mirá los platos
            </PillLink>
          </div>
        </div>

        {/* El ticket es decorativo: lo que importa ya está dicho en el título y el texto. */}
        <div aria-hidden="true" className="ticket-shadow w-full max-w-[19rem] self-end md:max-w-[20rem] lg:rotate-[2.5deg]">
          <div data-ticket className="ticket px-5 pt-6 text-[13px] leading-snug">
            <p className="font-display text-center text-2xl">La Comanda</p>
            <p className="mt-1 flex justify-between font-bold">
              <span>Mesa 12</span>
              <span>6 personas</span>
            </p>
            <div className="ticket-rule my-3" />
            <ul className="space-y-1.5">
              {order.map((line) => (
                <li key={line.id} className="flex gap-2">
                  <span className="w-4 shrink-0">{line.qty}</span>
                  <span className="flex-1 uppercase">{line.item.name.es}</span>
                  <span className="tabular-nums">{formatPrice(line.item.price * line.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="ticket-rule my-3" />
            <p className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(orderTotal)}</span>
            </p>
            <p className="mt-3 text-center text-xs">Para compartir entre todos</p>
            <div className="mt-3 flex justify-center">
              <span data-stamp className="stamp inline-block -rotate-6 text-lg">
                Se comparte
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

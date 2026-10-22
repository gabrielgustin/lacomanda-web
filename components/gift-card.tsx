'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Gift } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

// Cada tarjeta: color de fondo, posición final y giro (en grados) al quedar apoyada.
const cards = [
  { tone: 'bg-primary text-primary-foreground', x: -150, y: 10, rotate: -18, amount: '$20.000' },
  { tone: 'bg-card text-primary ring-1 ring-border', x: 140, y: -20, rotate: 14, amount: '$30.000' },
  { tone: 'bg-ink text-primary-foreground', x: -40, y: 60, rotate: -6, amount: '$50.000' },
  { tone: 'bg-muted text-primary ring-1 ring-border', x: 60, y: 0, rotate: 8, amount: 'La Comanda' },
]

export function GiftCard() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('[data-gift]')
      // Sin animación: las tarjetas quedan directamente en su lugar.
      if (prefersReducedMotion()) {
        const spread = window.innerWidth < 640 ? 0.45 : 1
        els.forEach((el, i) => gsap.set(el, { x: cards[i].x * spread, y: cards[i].y, rotate: cards[i].rotate }))
        return
      }
      // Las tarjetas caen girando en 3D y se apoyan desordenadas a medida que bajás.
      const spread = window.innerWidth < 640 ? 0.45 : 1
      els.forEach((el, i) => {
        const card = { ...cards[i], x: cards[i].x * spread }
        gsap.fromTo(
          el,
          { x: card.x * 0.3, y: -420 - i * 90, rotate: card.rotate * -3, rotateX: 65, rotateY: -35 + i * 20, opacity: 0 },
          {
            x: card.x,
            y: card.y,
            rotate: card.rotate,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: '[data-gift-stage]', start: 'top 95%', end: 'center 55%', scrub: 1 },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="regala" ref={root} aria-labelledby="regala-title" className="relative z-10 overflow-hidden bg-background py-20 md:py-28">
      <div className="dot-pattern absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[90rem] px-5 md:px-8">
        <SplitTitle
          id="regala-title"
          lines={['Regalá', 'La Comanda']}
          className="text-center text-[clamp(2.5rem,7vw,5.5rem)] text-primary"
        />

        <div className="mt-8 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <p className="eyebrow hidden text-primary md:block">Para el que tiene todo</p>
          <div
            data-gift-stage
            className="relative mx-auto h-[300px] w-full max-w-[520px] [perspective:1200px] md:h-[380px]"
            aria-hidden="true"
          >
            {cards.map((card, index) => (
              <div
                key={index}
                data-gift
                className={cn(
                  'absolute left-1/2 top-1/2 -ml-[115px] -mt-[72px] flex h-[144px] w-[230px] flex-col justify-between rounded-2xl p-4 shadow-md md:-ml-[140px] md:-mt-[88px] md:h-[176px] md:w-[280px] md:p-5',
                  card.tone,
                )}
                style={{ zIndex: index }}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow opacity-80">Gift card</span>
                  <Image src="/logo-la-comanda.svg" alt="" width={36} height={36} className="size-8 md:size-9" />
                </div>
                <p className="font-display text-2xl md:text-3xl">{card.amount}</p>
              </div>
            ))}
          </div>
          <p className="eyebrow hidden text-right text-primary md:block">O para el que no sabés qué</p>
        </div>

        <p data-reveal className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed text-muted-foreground md:text-base">
          Un cumple, un gracias o un &ldquo;te debo una&rdquo;. Regalá una cena en La Comanda con el monto que
          quieras y nosotros ponemos la mesa.
        </p>
        <div data-reveal className="mt-6 flex justify-center">
          <PillLink
            href={whatsappLink('¡Hola La Comanda! Quiero comprar una gift card.')}
            target="_blank"
            rel="noreferrer"
          >
            <Gift className="size-4" aria-hidden="true" /> Pedí tu gift card
          </PillLink>
        </div>
      </div>
    </section>
  )
}

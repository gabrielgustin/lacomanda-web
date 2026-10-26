'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Gift } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

// Cada vale: color de papel, posición final y giro (en grados) al quedar apoyado.
const cards = [
  { tone: 'bg-primary text-primary-foreground', x: -150, y: 10, rotate: -18, amount: '$20.000' },
  { tone: 'bg-[#ecd9bd] text-ink', x: 140, y: -20, rotate: 14, amount: '$30.000' },
  { tone: 'bg-ink text-primary-foreground', x: -40, y: 60, rotate: -6, amount: '$50.000' },
  { tone: 'bg-paper text-ink', x: 60, y: 0, rotate: 8, amount: 'Vale una cena' },
]

export function GiftCard() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>('[data-gift]')
      const spread = window.innerWidth < 640 ? 0.45 : 1
      // Sin animación: los vales quedan directamente en su lugar.
      if (prefersReducedMotion()) {
        els.forEach((el, i) => gsap.set(el, { x: cards[i].x * spread, y: cards[i].y, rotate: cards[i].rotate }))
        return
      }
      // Los vales caen girando en 3D y se apoyan desordenados a medida que bajás.
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
    <section id="regala" ref={root} aria-labelledby="regala-title" className="relative z-10 overflow-hidden bg-muted py-20 md:py-28">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <SplitTitle
            id="regala-title"
            lines={['Regalá', 'una mesa']}
            className="text-[clamp(2.8rem,6.4vw,5.5rem)] text-primary"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Un cumple, un gracias o un &ldquo;te debo una&rdquo;. Regalá una cena en La Comanda con el monto que
            quieras y nosotros ponemos la mesa.
          </p>
          <PillLink
            href={whatsappLink('¡Hola La Comanda! Quiero comprar una gift card.')}
            target="_blank"
            rel="noreferrer"
            className="mt-7"
          >
            <Gift className="size-4" aria-hidden="true" /> Pedí tu gift card
          </PillLink>
        </div>

        <div
          data-gift-stage
          className="relative mx-auto h-[320px] w-full max-w-[560px] [perspective:1200px] md:h-[420px]"
          aria-hidden="true"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              data-gift
              className="absolute left-1/2 top-1/2 -ml-[115px] -mt-[80px] w-[230px] md:-ml-[140px] md:-mt-[96px] md:w-[280px]"
              style={{ zIndex: index }}
            >
              <div className="ticket-shadow">
                <div
                  className={cn(
                    'ticket flex h-[160px] flex-col justify-between px-4 pt-4 md:h-[192px] md:px-5 md:pt-5',
                    card.tone,
                  )}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Gift card</span>
                    <Image src="/logo-la-comanda.svg" alt="" width={36} height={36} className="size-8 md:size-9" />
                  </div>
                  <p className="font-display text-2xl md:text-3xl">{card.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

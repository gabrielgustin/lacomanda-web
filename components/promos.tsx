'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

// Promos vigentes de La Comanda. `highlight` es lo que se lee de un vistazo en el ticket.
const promos = [
  { day: 'Martes', highlight: '2º al 50%', text: 'Consumiendo dos sándwiches, el segundo sale al 50%.' },
  {
    day: 'Miércoles',
    highlight: '15% off',
    text: '15% de descuento para mesas de mujeres. Superando los $40.000, 15% en efectivo.',
  },
  { day: 'Jueves', highlight: '2x1', text: '2x1 en hamburguesas.' },
  { day: 'Domingos', highlight: '2ª al 50%', text: 'Consumiendo dos pizzas, la más económica al 50%.' },
  {
    day: 'Martes a jueves',
    tag: 'Happy hour 17 a 20 hs',
    highlight: '2x1',
    text: '2x1 en tragos: Aperol, Campari y Fernet.',
  },
  { day: 'Viernes', tag: 'Happy hour 17 a 20 hs', highlight: '2x1', text: '2x1 en chopp Stella.' },
]

// Papel de cada ticket y su giro al quedar apoyado en la pila.
const looks = [
  { tone: 'bg-paper text-ink', rotate: -2 },
  { tone: 'bg-[#ecd9bd] text-ink', rotate: 1.5 },
  { tone: 'bg-primary text-primary-foreground', rotate: -1 },
  { tone: 'bg-paper text-ink', rotate: 2 },
  { tone: 'bg-ink text-primary-foreground', rotate: -1.5 },
  { tone: 'bg-[#ecd9bd] text-ink', rotate: 1 },
]

const CARD_HEIGHT = 216

// Escena fija: los tickets de promo se apilan uno sobre otro a medida que bajás, cada uno un poco más abajo,
// así siempre se lee el día de los de abajo y el último queda entero. Con movimiento reducido, la pila ya está armada.
export function Promos() {
  const root = useRef<HTMLElement>(null)
  const stack = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // El paso entre tickets se ajusta al alto disponible, para que la pila entre en cualquier pantalla.
      const fit = () => {
        const el = stack.current
        if (!el) return
        const step = Math.min(64, Math.max(30, (el.clientHeight - CARD_HEIGHT) / (promos.length - 1)))
        const pile = CARD_HEIGHT + step * (promos.length - 1)
        el.style.setProperty('--step', `${step}px`)
        // Si sobra alto, la pila se centra en vez de quedar pegada arriba.
        el.style.setProperty('--offset', `${Math.max(0, (el.clientHeight - pile) / 2)}px`)
      }
      fit()
      window.addEventListener('resize', fit)

      // El giro de cada ticket lo pone GSAP (no CSS): si lo lee de CSS, lo compensa corriéndolo de costado.
      const cards = gsap.utils.toArray<HTMLElement>('[data-promo]')
      cards.forEach((card, i) => gsap.set(card, { rotate: looks[i].rotate }))

      if (!prefersReducedMotion()) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=300%', scrub: 1, pin: true, anticipatePin: 1 },
        })
        // El primero ya está apoyado; los demás suben desde abajo y caen encima, girando hasta su lugar.
        cards.slice(1).forEach((card, i) => {
          const look = looks[i + 1]
          tl.fromTo(
            card,
            { y: () => window.innerHeight, rotate: look.rotate * 6 },
            { y: 0, rotate: look.rotate, duration: 1, ease: 'power3.out' },
            i * 0.9,
          )
        })
        tl.to({}, { duration: 0.5 })
      }

      return () => window.removeEventListener('resize', fit)
    },
    { scope: root },
  )

  return (
    <section
      id="promos"
      ref={root}
      aria-labelledby="promos-title"
      className="relative z-10 flex h-svh flex-col overflow-hidden bg-muted md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center"
    >
      <div className="px-5 pb-6 pt-24 md:py-24 md:pl-8 md:pr-10 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-14">
        <SplitTitle
          id="promos-title"
          lines={['Todos los días', 'hay algo']}
          className="text-[clamp(2.4rem,5.4vw,5rem)] text-primary"
        />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty md:mt-6 md:text-base">
          Las promos de la semana en La Comanda. Elegí el día y venite con hambre.
        </p>
        <div className="mt-6 md:mt-8">
          <PillLink href="#reservas">Reservá tu mesa</PillLink>
        </div>
      </div>

      {/* La pila de tickets: cada uno se ubica un paso más abajo que el anterior. */}
      <div className="relative min-h-0 flex-1 px-5 pb-8 md:h-full md:flex-none md:py-28 md:pr-8 lg:pr-[max(2rem,calc((100vw-90rem)/2+2rem))]">
        <div ref={stack} className="relative mx-auto h-full w-full max-w-[26rem]">
          <ul className="contents">
            {promos.map((promo, i) => (
              <li
                key={promo.day + promo.highlight}
                data-promo
                className="absolute inset-x-0"
                style={{ top: `calc(var(--offset, 0px) + var(--step, 56px) * ${i})`, zIndex: i }}
              >
                <div className="ticket-shadow">
                  <div
                    className={cn('ticket flex flex-col px-5 pt-4 md:px-6', looks[i].tone)}
                    style={{ height: CARD_HEIGHT }}
                  >
                    {/* El día va solo en la primera línea: es lo que queda a la vista cuando otro ticket lo tapa. */}
                    <p className="font-display truncate text-xl md:text-2xl">{promo.day}</p>
                    <div className="mt-auto flex items-end justify-between gap-3">
                      <p className="font-display text-4xl leading-none md:text-5xl">{promo.highlight}</p>
                      {promo.tag && <span className="stamp mb-1 shrink-0 -rotate-3 text-[11px]">{promo.tag}</span>}
                    </div>
                    <p className="mt-2 text-sm leading-snug opacity-85">{promo.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

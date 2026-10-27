'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { whatsappLink } from '@/lib/site'

const plans = [
  {
    image: '/fotos/eventos/cumples.webp',
    alt: 'Amigos festejando un cumpleaños en la mesa, con un globo de Happy Birthday',
    title: 'Cumples y festejos',
    text: 'Mesa larga, torta propia si querés y la pizza que no puede faltar. Nosotros nos encargamos del resto.',
  },
  {
    image: '/fotos/eventos/after-office.webp',
    alt: 'Grupo de amigos brindando con jarras de cerveza en la barra',
    title: 'After office',
    text: 'Salís del laburo, pedís un chopp y una de papas jodidas. El mejor plan de la semana.',
  },
  {
    image: '/fotos/eventos/grupos.webp',
    alt: 'Grupo grande compartiendo una mesa larga en un restaurante',
    title: 'Grupos y empresas',
    text: 'Armamos menú cerrado para grupos grandes, con opciones para todos y precio fijo por persona.',
  },
]

// Escena fija a pantalla completa: arranca con el título sobre la primera foto y, al bajar,
// cada plan entra con un barrido de abajo hacia arriba y un Ken Burns lento. Abajo, una regla
// con los tres planes se va llenando. Con movimiento reducido, los planes quedan uno debajo del otro.
export function Events() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const panels = q('[data-plan]')
      const copies = q('[data-plan-copy]')
      const fills = q('[data-plan-fill]')
      const step = 1.6

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=320%', scrub: 1, pin: true, anticipatePin: 1 },
      })

      // Cada foto se aleja despacio mientras está en pantalla.
      q('[data-plan-img]').forEach((img, i) => tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: step + 1.2 }, i * step))

      // Apertura: el título se va y entra el primer plan.
      tl.to('[data-plan-intro]', { opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' }, 0.5)
        .fromTo(copies[0], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.9)
        .fromTo(fills[0], { scaleX: 0 }, { scaleX: 1, duration: step }, 0.9)

      // Los planes siguientes tapan al anterior de abajo hacia arriba.
      for (let i = 1; i < panels.length; i++) {
        const at = 0.9 + i * step
        tl.fromTo(
          panels[i],
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' },
          at - 0.5,
        )
          .to(copies[i - 1], { opacity: 0, y: -30, duration: 0.3 }, at - 0.5)
          .fromTo(copies[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at)
          .fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: step }, at)
      }
      tl.to({}, { duration: 0.3 })
    },
    { scope: root },
  )

  return (
    <section
      id="eventos"
      ref={root}
      aria-labelledby="eventos-title"
      className="relative z-10 overflow-hidden bg-ink text-paper motion-safe:h-svh"
    >
      {/* Apertura: en la escena va encima de la primera foto, oscurecida. */}
      <div
        data-plan-intro
        className="relative z-10 flex flex-col justify-center px-5 py-24 md:px-8 lg:px-[max(2rem,calc((100vw-90rem)/2+2rem))] motion-safe:absolute motion-safe:inset-0 motion-safe:bg-ink/70"
      >
        <SplitTitle
          id="eventos-title"
          lines={['Mesas largas', 'para planes cortos']}
          className="text-[clamp(2.8rem,8vw,7.5rem)]"
        />
        <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/85 text-pretty md:text-lg">
          Cumpleaños, despedidas, after office o la juntada que venís postergando hace meses. Contanos cuántos son y
          te armamos la mesa.
        </p>
      </div>

      {plans.map((plan, i) => (
        <article
          key={plan.title}
          data-plan
          aria-labelledby={`plan-${i}`}
          className="relative h-[85svh] overflow-hidden motion-safe:absolute motion-safe:inset-0 motion-safe:h-auto"
        >
          <Image data-plan-img src={plan.image} alt={plan.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10 md:bg-gradient-to-r md:from-ink/90 md:via-ink/40 md:to-transparent" />
          <div
            data-plan-copy
            className="absolute bottom-24 left-5 right-5 max-w-xl md:bottom-28 md:left-8 lg:left-[max(2rem,calc((100vw-90rem)/2+2rem))]"
          >
            <h3 id={`plan-${i}`} className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.9]">
              {plan.title}
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-paper/85 md:text-lg">{plan.text}</p>
            <PillLink
              href={whatsappLink(`¡Hola La Comanda! Quiero consultar por ${plan.title.toLowerCase()}.`)}
              target="_blank"
              rel="noreferrer"
              variant="cream"
              className="mt-6"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> Consultá por WhatsApp
            </PillLink>
          </div>
        </article>
      ))}

      {/* Regla de avance: los tres planes, el que está en pantalla se va llenando. */}
      <ol
        aria-hidden="true"
        className="absolute inset-x-5 bottom-6 z-20 hidden grid-cols-3 gap-3 md:inset-x-8 md:bottom-8 md:gap-6 motion-safe:grid lg:inset-x-[max(2rem,calc((100vw-90rem)/2+2rem))]"
      >
        {plans.map((plan) => (
          <li key={plan.title} className="text-xs font-semibold text-paper/80 md:text-sm">
            <span className="block h-0.5 bg-paper/25">
              <span data-plan-fill className="block h-full origin-left scale-x-0 bg-accent" />
            </span>
            <span className="mt-2 block">{plan.title}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

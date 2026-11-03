'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'
import { OrderTicket } from '@/components/order-ticket'

// Texto a la izquierda y, a la derecha, el ticket de la comanda: se imprime al llegar y después tiene un Ken Burns
// guiado por el scroll (zoom y giro lentos, y el resplandor de atrás se mueve a otra velocidad).
// La sección queda fija mientras dura el recorrido.
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const stage = q('[data-kb-stage]')[0]
      const front = q('[data-kb-front]')[0]
      const ticket = q('[data-ticket]')[0]

      // Zoom que deja el ticket entero dentro de la caja (con aire para los degradados de los bordes):
      // en una caja baja (celular, tablet) achica; en una alta lo agranda hasta un tope.
      const fit = () =>
        Math.min(1.4, (0.74 * stage.clientHeight) / ticket.offsetHeight, (0.9 * stage.clientWidth) / ticket.offsetWidth)

      if (prefersReducedMotion()) {
        gsap.set(front, { scale: Math.min(1, fit()) })
        return
      }

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // Ticket: se acerca, sube un poco y gira apenas, como una cámara que lo rodea.
        .fromTo(
          front,
          { scale: () => fit() * 0.88, yPercent: 3, rotate: -2 },
          { scale: () => fit(), yPercent: -2, rotate: 1.5, duration: 4 },
          0,
        )
        // Resplandor: más lento y hacia el otro lado, así el ticket se despega del fondo.
        .fromTo('[data-kb-back]', { scale: 0.9, yPercent: -3 }, { scale: 1.1, yPercent: 4, duration: 4 }, 0)

      // El papel sale de la impresora al entrar la sección y después cae el sello; la rotación final del sello
      // la pone GSAP (no la clase) para no pisarse.
      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: root.current, start: 'top 55%', once: true },
        })
        .fromTo(
          ticket,
          { clipPath: 'inset(0% 0% 100% 0%)', y: -32 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.6, ease: 'power2.inOut' },
        )
        .fromTo(
          '[data-stamp]',
          { scale: 2.2, opacity: 0, rotate: -24 },
          { scale: 1, opacity: 1, rotate: -6, duration: 0.4, ease: 'back.out(2.2)' },
          '>-0.05',
        )
    },
    { scope: root },
  )

  return (
    <section
      id="nosotros"
      data-tone="dark"
      ref={root}
      aria-labelledby="nosotros-title"
      className="relative z-10 flex h-svh flex-col overflow-hidden bg-ink text-paper md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <div className="flex flex-col justify-center gap-5 px-5 pb-4 pt-24 md:gap-8 md:py-24 md:pl-8 md:pr-10 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-14">
        <SplitTitle
          id="nosotros-title"
          lines={['Acá no hay', 'protocolo,', 'hay sobremesa']}
          className="text-[clamp(2.1rem,4.6vw,4.75rem)]"
        />
        <p className="max-w-md text-sm leading-relaxed text-paper/80 text-pretty md:text-base">
          Cocinamos lo que nos gusta comer: porciones generosas, salsas caseras y masa que leva sin apuro. Burgers
          altas, de las que se agarran con las dos manos.
        </p>
        <a
          href="#historia"
          className="w-fit rounded-full text-sm font-semibold underline decoration-accent decoration-2 underline-offset-8 hover:decoration-paper md:text-base"
        >
          Conocé nuestra historia
        </a>
      </div>

      {/* El borde de arriba y de abajo se difumina con degradados (más baratos que una máscara en cada frame). */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div data-kb-stage className="absolute inset-0">
          <div data-kb-back className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_48%,#7a4220_0%,#3a1f12_45%,transparent_75%)]" />
          </div>
          <div data-kb-front className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
            <OrderTicket />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-ink to-transparent" />
      </div>
    </section>
  )
}

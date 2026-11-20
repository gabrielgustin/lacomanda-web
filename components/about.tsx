'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'
import { OrderTicket } from '@/components/order-ticket'

// Texto a la izquierda y, a la derecha, la impresora de comandas con el ticket ya impreso (sin animación).
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const stage = q('[data-stage]')[0]
      const printer = q('[data-printer]')[0]
      // La impresora con el ticket entero tiene que entrar en la caja: en celular achica, en pantallas altas agranda (con tope).
      const fit = () =>
        gsap.set(printer, {
          scale: Math.min(1.25, stage.clientHeight / printer.offsetHeight, stage.clientWidth / printer.offsetWidth),
        })
      fit()
      window.addEventListener('resize', fit)
      return () => window.removeEventListener('resize', fit)
    },
    { scope: root },
  )

  return (
    <div className="relative z-10">
      <section
        id="nosotros"
        ref={root}
        aria-labelledby="nosotros-title"
        className="flex min-h-svh flex-col overflow-hidden bg-dots text-primary md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      >
        <div className="flex flex-col justify-center gap-5 px-5 pb-2 pt-24 md:gap-7 md:py-24 md:pl-8 md:pr-10 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-14">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Nosotros
          </p>
          <SplitTitle
            id="nosotros-title"
            lines={['Acá no hay', 'protocolo,', 'hay sobremesa']}
            className="text-[clamp(2.1rem,4.6vw,4.75rem)]"
          />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            Cocinamos lo que nos gusta comer: porciones generosas, salsas caseras y masa que leva sin apuro. Burgers
            altas, de las que se agarran con las dos manos.
          </p>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* La impresora cuelga desde arriba de su caja: en escritorio, la caja deja libre el alto del header. */}
          <div className="absolute inset-0 px-4 pb-8 pt-4 md:pb-12 md:pt-28">
          <div data-stage className="flex size-full justify-center">
            <div data-printer className="relative h-fit w-[21.5rem] origin-top">
              {/* Boca de la impresora: cuerpo oscuro y ranura. */}
              <div className="relative z-10 h-8 rounded-xl bg-[#1d120c] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_14px_28px_-10px_rgb(0_0_0/0.7)]">
                <span className="absolute inset-x-4 bottom-2 h-1 rounded-full bg-black" aria-hidden="true" />
              </div>
              {/* El papel sale por la ranura: el recorte esconde lo que todavía no salió. El ticket va sin sombra: con el
                  recorte se veía como un rectángulo gris detrás. */}
              <div className="-mt-3 flex justify-center px-3 [clip-path:inset(0.75rem_0_0_0)]">
                <OrderTicket />
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}

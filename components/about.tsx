'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, scrollTimelines } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'
import { OrderTicket } from '@/components/order-ticket'
import { formatPrice } from '@/lib/format'

// Texto a la izquierda y, a la derecha, la impresora de comandas: con el scroll sale el papel, se imprime renglón
// por renglón, el total se va sumando y al final cae el sello. La sección queda fija (sticky) mientras dura.
export function About() {
  const root = useRef<HTMLElement>(null)
  const scene = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const stage = q('[data-stage]')[0]
      const printer = q('[data-printer]')[0]
      const total = q('[data-total]')[0]

      // La impresora con el ticket entero tiene que entrar en la caja: en celular achica, en pantallas altas agranda (con tope).
      const fit = () =>
        gsap.set(printer, {
          scale: Math.min(1.25, stage.clientHeight / printer.offsetHeight, stage.clientWidth / printer.offsetWidth),
        })
      fit()
      if (prefersReducedMotion()) return

      const sum = { value: 0 }
      const showSum = () => (total.textContent = formatPrice(Math.round(sum.value / 100) * 100))
      showSum()

      // Con animaciones de CSS atadas al scroll (`.print-scene` en globals.css) el papel, los renglones y el sello los
      // mueve el navegador; acá solo se va sumando el total (entre el 54 % y el 74 % del recorrido, frenando al final).
      if (scrollTimelines()) {
        const el = scene.current!
        q('[data-line]').forEach((line, i) => line.style.setProperty('--i', String(i)))
        el.classList.add('print-scene')
        const target = Number(total.dataset.total)
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = gsap.utils.clamp(0, 1, (self.progress - 0.538) / 0.206)
            sum.value = target * (1 - (1 - p) ** 2)
            showSum()
          },
        })
        return () => el.classList.remove('print-scene')
      }

      gsap
        .timeline({
          defaults: { ease: 'none' },
          // Mismo tramo que la versión en CSS: mientras la sección está anclada.
          scrollTrigger: { trigger: scene.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefresh: fit },
        })
        // El papel sale por la ranura (se mueve la capa entera, con su sombra: no se redibuja en cada cuadro).
        // `y: 0` anula el corrimiento inicial del CSS (GSAP lo leería como `y` y lo sumaría al yPercent).
        .fromTo('[data-feed]', { y: 0, yPercent: -100 }, { y: 0, yPercent: 0, duration: 3 }, 0)
        .fromTo('[data-line]', { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.4 }, 0.5)
        .to(sum, { value: Number(total.dataset.total), duration: 0.8, ease: 'power1.out', onUpdate: showSum }, 2.1)
        .fromTo(
          '[data-stamp]',
          { scale: 2.4, opacity: 0, rotate: -24 },
          { scale: 1, opacity: 1, rotate: -6, duration: 0.35, ease: 'back.out(2)' },
          3.05,
        )
        .to({}, { duration: 0.5 })
    },
    { scope: root },
  )

  return (
    // La escena se ancla con sticky (lo resuelve el navegador, sin saltos en el celular); el contenedor
    // de 250svh da el recorrido: pantalla y media para imprimir la comanda y que quede un rato sellada.
    <div ref={scene} className="relative z-10 motion-safe:h-[250svh]">
      <section
        id="nosotros"
        ref={root}
        aria-labelledby="nosotros-title"
        className="sticky top-0 flex h-svh flex-col overflow-hidden bg-dots text-primary md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
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
              {/* Boca de la impresora: cuerpo oscuro, ranura y la luz de encendido. */}
              <div className="relative z-10 h-8 rounded-xl bg-[#1d120c] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_14px_28px_-10px_rgb(0_0_0/0.7)]">
                <span className="absolute inset-x-4 bottom-2 h-1 rounded-full bg-black" aria-hidden="true" />
                <span className="absolute right-3.5 top-2 size-1.5 rounded-full bg-[#8fdc8f] shadow-[0_0_6px_#8fdc8f]" aria-hidden="true" />
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

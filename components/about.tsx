'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'

// Recorte con fondo transparente: la burger flota sobre la escena.
const photo = '/fotos/burger-nosotros.png'

// Texto a la izquierda y, a la derecha, la burger con un Ken Burns guiado por el scroll:
// zoom y paneo lentos, un parallax 2.5D (la burger y el resplandor de atrás se mueven a distinta velocidad)
// y un golpe tipo impacto. La sección queda fija mientras dura el recorrido.
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const marker = q('[data-hud-marker]')[0]

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
            onUpdate: (self) => {
              marker.style.left = `${self.progress * 100}%`
            },
          },
        })
        // Burger: se acerca, sube y gira apenas, como una cámara que la rodea.
        .fromTo(
          '[data-kb-front]',
          { scale: 0.86, yPercent: 6, rotate: -3 },
          { scale: 1.18, yPercent: -6, rotate: 2, duration: 4 },
          0,
        )
        // Resplandor y sombra: más lentos y hacia el otro lado, así la burger se despega del fondo.
        .fromTo('[data-kb-back]', { scale: 0.9, yPercent: -4 }, { scale: 1.1, yPercent: 6, duration: 4 }, 0)
        // Impacto: sacudida corta y un destello.
        .to('[data-kb-stage]', { keyframes: { x: [0, -12, 10, -6, 3, 0], y: [0, 7, -6, 3, -1, 0] }, duration: 0.5, ease: 'power2.out' }, 2.6)
        .fromTo('[data-kb-flash]', { opacity: 0 }, { opacity: 0.18, duration: 0.08, yoyo: true, repeat: 1 }, 2.6)
        .to({}, { duration: 0.6 })
    },
    { scope: root },
  )

  return (
    <section
      id="nosotros"
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

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div data-kb-stage className="absolute inset-0">
          <div data-kb-back className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_48%,#7a4220_0%,#3a1f12_45%,transparent_75%)]" />
            <div className="absolute inset-x-[18%] bottom-[16%] h-[8%] rounded-[50%] bg-black/70 blur-2xl" />
          </div>
          <Image
            data-kb-front
            src={photo}
            alt="Burger doble con panceta, cheddar, pepinillos y pan con sésamo"
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-contain px-4 drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)] md:px-8"
          />
        </div>
        <div data-kb-flash className="pointer-events-none absolute inset-0 bg-paper opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      </div>

      {/* Barra de progreso: una regla a todo lo ancho que se va midiendo con el scroll. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 bottom-5 z-20 h-4 bg-[repeating-linear-gradient(90deg,rgb(247_243_234/0.35)_0_1px,transparent_1px_10px)] motion-reduce:hidden md:inset-x-8 md:bottom-7 lg:inset-x-[max(2rem,calc((100vw-90rem)/2+2rem))]"
      >
        <span data-hud-marker className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-accent" style={{ left: '0%' }} />
      </div>
    </section>
  )
}

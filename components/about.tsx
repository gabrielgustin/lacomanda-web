'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { SplitTitle } from '@/components/ui'

// Recorte con fondo transparente: la burger flota sobre la escena.
const photo = '/fotos/burger-nosotros.png'
// Proporción de la imagen y alto que ocupa la burger dentro de ella (medido sobre el PNG: 88%).
const PHOTO_ASPECT = 2560 / 1934
const BURGER_SHARE = 0.884

// Texto a la izquierda y, a la derecha, la burger con un Ken Burns guiado por el scroll:
// zoom y paneo lentos y un parallax 2.5D (la burger y el resplandor de atrás se mueven a distinta velocidad).
// La sección queda fija mientras dura el recorrido.
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      const marker = q('[data-hud-marker]')[0]
      const stage = q('[data-kb-stage]')[0]
      const front = q('[data-kb-front]')[0]

      // Zoom máximo que deja la burger entera dentro de la caja: en una caja baja (celular, tablet) la foto
      // ya llena el alto y el zoom es corto; en una alta puede acercarse más.
      const maxScale = () => {
        const pad = parseFloat(getComputedStyle(front).paddingLeft) || 0
        const photoHeight = Math.min(stage.clientHeight, (stage.clientWidth - pad * 2) / PHOTO_ASPECT)
        return Math.min(1.18, Math.max(0.95, (0.88 * stage.clientHeight) / (BURGER_SHARE * photoHeight)))
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
            onUpdate: (self) => {
              marker.style.left = `${self.progress * 100}%`
            },
          },
        })
        // Burger: se acerca, sube un poco y gira apenas, como una cámara que la rodea.
        .fromTo(
          front,
          { scale: () => maxScale() * 0.78, yPercent: 3, rotate: -2 },
          { scale: () => maxScale(), yPercent: -2, rotate: 1.5, duration: 4 },
          0,
        )
        // Resplandor y sombra: más lentos y hacia el otro lado, así la burger se despega del fondo.
        .fromTo('[data-kb-back]', { scale: 0.9, yPercent: -3 }, { scale: 1.1, yPercent: 4, duration: 4 }, 0)
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

      {/* El borde de arriba y de abajo se difumina: si algo llegara a tocar el límite, no se corta en recto. */}
      <div className="relative min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]">
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
            className="object-contain px-4 drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)] will-change-transform md:px-8"
          />
        </div>
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

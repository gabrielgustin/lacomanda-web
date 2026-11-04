'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, scrollTimelines } from '@/lib/gsap'
import { PillLink } from '@/components/ui'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

const plans = [
  {
    image: '/fotos/eventos/festejos-pizzas.webp',
    alt: 'Amigas riendo alrededor de una mesa de madera con pizzas, vino y chopp; al fondo, el neón «Lo bueno se comparte»',
    // Foto casi cuadrada: `focus` encuadra caras y mesa (en celular manda el corrimiento horizontal).
    focus: 'object-[58%_50%] md:object-[50%_30%]',
    title: 'Festejos',
    text: 'Mesa larga, torta propia si querés y la pizza que no puede faltar. Nosotros nos encargamos del resto.',
  },
  {
    image: '/fotos/eventos/after-office-brindis-hd.webp',
    alt: 'Amigos brindando con chopp, gin tonic y Aperol en una mesa de madera con papas y picada, frente a la pared de ladrillo',
    focus: 'object-[55%_50%] md:object-[50%_40%]',
    title: 'After office',
    text: 'Salís del laburo, pedís un chopp y unas papas con cheddar. El mejor plan de la semana.',
  },
  {
    image: '/fotos/eventos/grupos-oficina-hd.webp',
    alt: 'Tres compañeras charlando con una notebook, un cuaderno y un café sobre la mesa de madera, frente a la pared de ladrillo',
    focus: 'object-[45%_50%] md:object-[50%_45%]',
    title: 'Cowork',
    text: 'Armamos menú cerrado para grupos grandes, con opciones para todos y precio fijo por persona.',
  },
]

// Escena fija a pantalla completa: arranca directo en el primer plan y, al bajar,
// cada plan entra con un barrido de abajo hacia arriba (las fotos, sin zoom). Abajo, una regla
// con los tres planes se va llenando. Con movimiento reducido, los planes quedan uno debajo del otro.
export function Events() {
  const root = useRef<HTMLElement>(null)
  const scene = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Frenado en cada plan (Festejos, After office, Cowork), así un deslizón rápido no pasa de largo el barrido.
      // En pantallas táctiles lo hace el navegador (CSS scroll snap, `.touch-snap` en globals.css): corta el impulso
      // del dedo en cada plan. Con mouse o trackpad (Lenis) la escena se acomoda sola al soltar el scroll.
      const html = document.documentElement
      const touch = window.matchMedia('(pointer: coarse)').matches
      // El frenado se enciende solo mientras la escena está anclada: el resto de la página sigue con scroll libre.
      if (touch)
        ScrollTrigger.create({
          trigger: scene.current,
          start: 'top top',
          end: 'bottom bottom',
          onToggle: (self) => html.classList.toggle('touch-snap', self.isActive),
        })
      else
        ScrollTrigger.create({
          trigger: scene.current,
          start: 'top top',
          end: 'bottom bottom',
          snap: { snapTo: [0, 0.5, 1], duration: { min: 1.6, max: 2.4 }, delay: 0.08, ease: 'sine.inOut' },
        })
      const cleanup = () => html.classList.remove('touch-snap')
      // Con animaciones de CSS atadas al scroll, la escena la mueve el navegador (`.plans-scene` en globals.css).
      if (scrollTimelines()) {
        const el = scene.current!
        el.classList.add('plans-scene')
        return () => {
          el.classList.remove('plans-scene')
          cleanup()
        }
      }
      const q = gsap.utils.selector(root)
      const panels = q('[data-plan]')
      const inners = q('[data-plan-inner]')
      const copies = q('[data-plan-copy]')
      const fills = q('[data-plan-fill]')
      // Mismos tiempos que la versión en CSS (`.plans-scene` en globals.css): 6 unidades en total.
      const sweeps = [1, 3.6]
      const fillAt = [0, 1.7, 4.3, 6]

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: scene.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      })

      fills.forEach((fill, i) =>
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: fillAt[i + 1] - fillAt[i] }, fillAt[i]),
      )
      // Los planes siguientes tapan al anterior de abajo hacia arriba, con un barrido lento.
      for (let i = 1; i < panels.length; i++) {
        const at = sweeps[i - 1]
        // El panel sube tapando al anterior y su contenido baja lo mismo: la foto queda quieta y solo se corre la "ventana".
        tl.fromTo(panels[i], { y: () => window.innerHeight }, { y: 0, duration: 1.4, ease: 'sine.inOut' }, at)
          .fromTo(inners[i], { y: () => -window.innerHeight }, { y: 0, duration: 1.4, ease: 'sine.inOut' }, at)
          .to(copies[i - 1], { opacity: 0, y: -30, duration: 0.4 }, at)
          .fromTo(copies[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at + 1.2)
      }
      return cleanup
    },
    { scope: root },
  )

  return (
    // Anclada con sticky; el contenedor de 500svh da 4 pantallas de recorrido para los planes.
    <div ref={scene} className="relative z-10 motion-safe:h-[500svh]">
      {/* Puntos de frenado en celular: After office (mitad del recorrido, frena siempre) y Cowork (final, solo atrae
          si soltás cerca). 500svh − una pantalla = 400svh. Al entrar no frena, así la escena arranca fluida. */}
      <span aria-hidden="true" data-snap="always" style={{ top: '200svh' }} className="pointer-events-none absolute inset-x-0 h-px" />
      <span aria-hidden="true" data-snap style={{ top: '400svh' }} className="pointer-events-none absolute inset-x-0 h-px" />
    <section
      id="eventos"
      data-tone="dark"
      ref={root}
      aria-labelledby="eventos-title"
      className="relative overflow-hidden bg-ink text-paper motion-safe:sticky motion-safe:top-0 motion-safe:h-svh"
    >
      <h2 id="eventos-title" className="sr-only">
        Mesas largas para planes cortos
      </h2>

      {plans.map((plan, i) => (
        <article
          key={plan.title}
          data-plan
          aria-labelledby={`plan-${i}`}
          className="relative h-[85svh] overflow-hidden will-change-transform motion-safe:absolute motion-safe:inset-0 motion-safe:h-auto"
        >
          <div data-plan-inner className="absolute inset-0 will-change-transform">
            <Image src={plan.image} alt={plan.alt} fill sizes="100vw" className={cn('photo-tone object-cover', plan.focus)} />
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
                href={whatsappLink(`¡Hola La Comanda! Quiero consultar por ${plan.title}. ¿Me pasan información y disponibilidad?`)}
                target="_blank"
                rel="noreferrer"
                variant="cream"
                className="mt-6"
              >
                <MessageCircle className="size-4" aria-hidden="true" /> Consultá por WhatsApp
              </PillLink>
            </div>
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
    </div>
  )
}

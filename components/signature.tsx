'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// Platos estrella de la carta: vidriera de la casa, no un pedido. `focus` encuadra el plato dentro de la foto.
const picks = [
  { id: 'burgers-de-costillas', image: '/fotos/costilla.webp', alt: 'Burger de costilla con el hueso asomando', focus: 'object-[50%_72%]' },
  { id: 'pizzas-la-comanda', image: '/fotos/pizzas.webp', alt: 'Pizza recién salida del horno', focus: 'object-center' },
  { id: 'entradas-papas-jodidas', image: '/fotos/entradas.webp', alt: 'Papas con cheddar, panceta y huevo', focus: 'object-center' },
  { id: 'principales-bife-de-chorizo-criollo', image: '/fotos/principales.webp', alt: 'Bife de chorizo con huevo frito y papas', focus: 'object-center' },
  { id: 'mexicana-fajitas-mixtas', image: '/fotos/mexicana.webp', alt: 'Fajitas con tortillas y salsas', focus: 'object-center' },
  { id: 'sandwiches-entrana', image: '/fotos/sandwiches.webp', alt: 'Sándwich de entraña con papas fritas', focus: 'object-center' },
].filter((pick) => itemsById[pick.id])

const Buttons = ({ className }: { className?: string }) => (
  <div className={cn('flex flex-wrap items-center gap-3', className)}>
    <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer">
      Ver la carta completa <ArrowUpRight className="size-4" aria-hidden="true" />
    </PillLink>
    <PillLink href="#reservas" variant="outline">
      Reservá tu mesa
    </PillLink>
  </div>
)

// Celular: la sección se queda fija y el scroll vertical desplaza el carrusel de tarjetas hacia la izquierda
// (foto arriba; nombre, precio y descripción debajo); al llegar a la última, la página sigue hacia abajo.
// Tablet y escritorio: fotos a sangre que pasan con el scroll y, a la derecha, la pizarra fija con el plato en pantalla resaltado.
export function Signature() {
  const root = useRef<HTMLElement>(null)
  const mobile = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [slide, setSlide] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(max-width: 767px)', () => {
        // Con movimiento reducido queda el carrusel con scroll propio.
        if (prefersReducedMotion()) return
        const wrap = strip.current!
        const ul = track.current!
        gsap.set(wrap, { overflowX: 'hidden' })
        const distance = () => Math.max(0, ul.scrollWidth - wrap.clientWidth)
        gsap.to(ul, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: mobile.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setSlide(Math.round(self.progress * (picks.length - 1))),
          },
        })
      })
      mm.add('(min-width: 768px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-dish]').forEach((dish, index) => {
          ScrollTrigger.create({
            trigger: dish,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && setActive(index),
          })
        })
      })
    },
    { scope: root },
  )

  const measure = useCallback(() => {
    const el = strip.current
    if (!el) return
    const first = el.querySelector('li')
    const step = (first?.getBoundingClientRect().width ?? 1) + 16
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setSlide(atEnd ? picks.length - 1 : Math.min(picks.length - 1, Math.round(el.scrollLeft / step)))
  }, [])

  useEffect(() => {
    const el = strip.current
    if (!el) return
    el.addEventListener('scroll', measure, { passive: true })
    return () => el.removeEventListener('scroll', measure)
  }, [measure])

  return (
    <section ref={root} id="platos" aria-label="Platos de la casa" className="relative z-10 bg-background">
      {/* Celular: bloque a pantalla completa que se ancla mientras la tira avanza. */}
      <div ref={mobile} className="flex h-svh flex-col justify-center overflow-hidden pb-6 pt-20 md:hidden">
        <div className="px-5">
          <SplitTitle
            id="platos-title-movil"
            lines={['Recetas de siempre.', 'Hambre de ahora.']}
            className="text-[clamp(1.6rem,7.2vw,2.6rem)] text-primary"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
            Pizzas con masa propia, burgers de 200 gramos, bifes de 350 y salsas de todos los días.
          </p>
        </div>

        <div ref={strip} className="scrollbar-hide mt-5 snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
          <ul ref={track} className="flex w-max gap-4 px-5">
            {picks.map((pick) => {
              const item = itemsById[pick.id]
              return (
                <li key={pick.id} className="w-[72vw] max-w-[19rem] shrink-0 snap-start">
                  <figure className="relative h-[clamp(12rem,calc(100svh-29rem),24rem)] overflow-hidden bg-ink">
                    <Image src={pick.image} alt={pick.alt} fill sizes="75vw" className={cn('object-cover', pick.focus)} />
                  </figure>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display min-w-0 text-xl leading-tight text-primary">{item.name}</h3>
                      <span className="mb-1 min-w-3 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                      <p className="font-display shrink-0 text-base text-primary">{formatPrice(item.price)}</p>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Cuál de los seis estás viendo. */}
        <div className="mt-4 flex gap-1.5 px-5" aria-hidden="true">
          {picks.map((pick, i) => (
            <span key={pick.id} className={cn('h-0.5 flex-1 transition-colors duration-300', i === slide ? 'bg-primary' : 'bg-primary/20')} />
          ))}
        </div>

        <Buttons className="mt-5 px-5" />
      </div>

      {/* Tablet y escritorio */}
      <div className="hidden md:grid md:grid-cols-2">
        <div className="sticky top-0 order-2 flex h-svh flex-col justify-center self-start pb-8 pl-10 pr-8 pt-24 lg:pl-14 lg:pr-[max(2rem,calc((100vw-90rem)/2+2rem))]">
          <SplitTitle
            id="platos-title"
            lines={['Recetas de siempre.', 'Hambre de ahora.']}
            className="text-[clamp(2rem,3.4vw,3.5rem)] text-primary"
          />
          <p data-reveal className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Pizzas con masa propia, burgers de 200 gramos, bifes de 350 y salsas de todos los días.
          </p>

          {/* Pizarra: cada plato lleva a su foto. */}
          <ul className="mt-6">
            {picks.map((pick, index) => {
              const item = itemsById[pick.id]
              return (
                <li key={pick.id}>
                  <a
                    href={`#plato-${pick.id}`}
                    aria-current={index === active ? 'true' : undefined}
                    className={cn(
                      'flex items-baseline gap-3 rounded-sm py-1.5 text-primary transition-opacity duration-300',
                      index === active ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                    )}
                  >
                    <span className="font-display text-lg lg:text-2xl">{item.name}</span>
                    <span className="mb-1 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                    <span className="font-display text-base lg:text-xl">{formatPrice(item.price)}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <Buttons className="mt-6" />
        </div>

        <div className="order-1">
          {picks.map((pick) => (
            <figure key={pick.id} id={`plato-${pick.id}`} data-dish data-clip className="relative h-svh overflow-hidden bg-ink">
              <Image
                data-parallax="8"
                src={pick.image}
                alt={pick.alt}
                fill
                sizes="50vw"
                className={cn('scale-115 object-cover', pick.focus)}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, STRIP_PACE, STRIP_HOLD } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// Platos estrella de la carta: vidriera de la casa, no un pedido. `focus` encuadra el plato dentro de la foto.
const picks = [
  { id: 'burgers-de-costillas', image: '/fotos/burger-costillas-hd.webp', alt: 'Burger de costilla con cheddar, panceta y cebolla crispy, con papas fritas', focus: 'object-[50%_20%]' },
  { id: 'entradas-papas-jodidas', image: '/fotos/papas-cheddar-hd.webp', alt: 'Papas fritas con cheddar, huevo revuelto, panceta y verdeo', focus: 'object-center' },
  { id: 'principales-bife-de-chorizo-criollo', image: '/fotos/bife-papas.webp', alt: 'Bife de chorizo grillado con sal gruesa y perejil, junto a papas doradas al romero', focus: 'object-[60%_50%]' },
  { id: 'mexicana-fajitas-mixtas', image: '/fotos/fajitas-taco-hd.webp', alt: 'Tortilla con carne, morrones, cheddar y guacamole, junto a la plancha de fajitas y las salsas', focus: 'object-[50%_60%]' },
  { id: 'sandwiches-entrana', image: '/fotos/sandwich-entrana-hd.webp', alt: 'Sándwich de carne desmenuzada con huevo frito, tomate y lechuga, sostenido con las manos, con papas fritas de fondo', focus: 'object-center' },
].filter((pick) => itemsById[pick.id])

// `compact`: en celular los dos botones entran en una sola línea (texto más corto y menos relleno).
const Buttons = ({ className, compact }: { className?: string; compact?: boolean }) => (
  <div className={cn('flex flex-wrap items-center gap-3', className)}>
    <PillLink href={site.cartaUrl} data-carta target="_blank" rel="noreferrer" className={cn(compact && 'px-5')}>
      {compact ? 'Ver la carta' : 'Ver la carta completa'} <ArrowUpRight className="size-4" aria-hidden="true" />
    </PillLink>
    <PillLink href="#reservas" variant="outline" className={cn(compact && 'px-5')}>
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
  const mobileScene = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const [slide, setSlide] = useState(0)
  const slideRef = useRef(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(max-width: 767px) and (min-height: 520px)', () => {
        // Con movimiento reducido queda el carrusel con scroll propio.
        if (prefersReducedMotion()) return
        const wrap = strip.current!
        const ul = track.current!
        gsap.set(wrap, { overflowX: 'hidden' })
        const distance = () => Math.max(0, ul.scrollWidth - wrap.clientWidth)
        // El bloque se ancla con sticky (sin saltos en el celular): el contenedor mide su alto más el recorrido
        // de la tira, y se recalcula antes de cada refresh de ScrollTrigger.
        const scene = mobileScene.current!
        const setHeight = () => {
          scene.style.height = `${mobile.current!.offsetHeight + Math.round(distance() * STRIP_PACE * (1 + STRIP_HOLD))}px`
          scene.style.setProperty('--strip', `${-distance()}px`)
        }
        setHeight()
        ScrollTrigger.addEventListener('refreshInit', setHeight)
        // Solo avisa a React cuando cambia la tarjeta, no en cada cuadro del scroll.
        const onUpdate = (self: ScrollTrigger) => {
          const next = Math.round(Math.min(1, self.progress * (1 + STRIP_HOLD)) * (picks.length - 1))
          if (next !== slideRef.current) setSlide((slideRef.current = next))
        }
        // La tira la mueve el navegador con una animación de CSS atada al scroll (`.strip-scroll`): corre en el mismo
        // hilo que el scroll y en el iPhone no queda un paso atrás. Si el navegador no la soporta, la mueve GSAP.
        if (CSS.supports('animation-timeline: view()')) {
          scene.classList.add('strip-scene')
          ScrollTrigger.create({ trigger: scene, start: 'top top', end: 'bottom bottom', onUpdate })
        } else {
          // El tramo fijo es más largo que lo que recorre la tira y termina con una pausa en la última tarjeta.
          gsap
            .timeline({
              scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onUpdate },
            })
            .to(ul, { x: () => -distance(), ease: 'none', duration: 1 })
            .to({}, { duration: STRIP_HOLD })
        }
        return () => {
          ScrollTrigger.removeEventListener('refreshInit', setHeight)
          scene.classList.remove('strip-scene')
          scene.style.height = ''
        }
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
      {/* Celular: bloque a pantalla completa que se ancla mientras la tira avanza. La tira toma el alto que sobra
          (con tope) y, en cada tarjeta, la foto se queda con lo que deja el texto: así nada se corta en ninguna
          altura de pantalla. En pantallas bajas se omite el texto de introducción. */}
      <div ref={mobileScene} className="md:hidden">
      <div ref={mobile} className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pb-6 pt-20 [@media(max-height:519px)]:h-auto">
        <div className="px-5">
          <SplitTitle
            id="platos-title-movil"
            lines={['Recetas de siempre.', 'Hambre de ahora.']}
            className="text-[clamp(1.6rem,7.2vw,2.6rem)] text-primary"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty [@media(max-height:620px)]:hidden">
            Pizzas con masa propia, burgers de 200 gramos, bifes de 350 y salsas de todos los días.
          </p>
        </div>

        <div
          ref={strip}
          className="scrollbar-hide mt-5 flex max-h-[31rem] min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          <ul ref={track} className="flex w-max gap-4 px-5">
            {picks.map((pick) => {
              const item = itemsById[pick.id]
              return (
                <li key={pick.id} className="flex w-[72vw] max-w-[19rem] shrink-0 snap-start flex-col">
                  <figure className="relative min-h-[9rem] flex-1 overflow-hidden bg-ink">
                    <Image src={pick.image} alt={pick.alt} fill sizes="75vw" loading="eager" className={cn('photo-tone object-cover', pick.focus)} />
                  </figure>
                  {/* Alto fijo para el texto: todas las fotos de la tira quedan del mismo alto. */}
                  <div className="mt-3 min-h-[7.25rem]">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display min-w-0 text-xl leading-tight text-primary">{item.name}</h3>
                      <span className="mb-1 min-w-3 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                      <p className="font-display shrink-0 text-base text-primary">{formatPrice(item.price)}</p>
                    </div>
                    {item.description && <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{item.description}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Qué plato de la tira estás viendo. */}
        <div className="mt-4 flex gap-1.5 px-5" aria-hidden="true">
          {picks.map((pick, i) => (
            <span key={pick.id} className={cn('h-0.5 flex-1 transition-colors duration-300', i === slide ? 'bg-primary' : 'bg-primary/20')} />
          ))}
        </div>

        <Buttons compact className="mt-5 px-5" />
      </div>
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

        {/* Cada foto ocupa toda la columna y todo el alto de la pantalla, sin marco, sin zoom ni parallax
            (así no se recorta ni se agranda más de lo necesario). */}
        <div className="order-1">
          {picks.map((pick) => (
            <figure key={pick.id} id={`plato-${pick.id}`} data-dish data-clip className="relative h-svh overflow-hidden bg-ink">
              <Image src={pick.image} alt={pick.alt} fill sizes="50vw" className={cn('photo-tone object-cover', pick.focus)} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
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

// Celular: los platos uno debajo del otro, sin efectos.
// Tablet y escritorio: fotos a sangre que pasan con el scroll y, a la derecha, la pizarra fija con el plato en pantalla resaltado.
export function Signature() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
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

  return (
    <section ref={root} id="platos" aria-label="Platos de la casa" className="relative z-10 bg-dots">
      {/* Celular: sin efectos; título y, debajo, un plato tras otro (foto arriba; nombre, precio y descripción debajo). */}
      <div className="px-5 pb-12 pt-20 md:hidden">
        <SplitTitle
          id="platos-title-movil"
          lines={['Recetas de siempre.', 'Hambre de ahora.']}
          className="text-[clamp(1.6rem,7.2vw,2.6rem)] text-primary"
        />
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
          Pizzas con masa propia, burgers de 200 gramos, bifes de 350 y salsas de todos los días.
        </p>

        <ul className="mt-8 space-y-8">
          {picks.map((pick) => {
            const item = itemsById[pick.id]
            return (
              <li key={pick.id}>
                {/* Misma lámina que en escritorio: esquinas redondeadas, aro fino y un filete claro adentro. */}
                <figure className="photo-in relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink ring-1 ring-ink/10">
                  <Image src={pick.image} alt={pick.alt} fill sizes="100vw" className={cn('photo-tone object-cover', pick.focus)} />
                  <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-paper/30" aria-hidden="true" />
                </figure>
                <div className="mt-3 flex items-baseline gap-3">
                  <h3 className="font-display min-w-0 text-xl leading-tight text-primary">{item.name}</h3>
                  <span className="mb-1 min-w-3 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                  <p className="font-display shrink-0 text-base text-primary">{formatPrice(item.price)}</p>
                </div>
                {item.description && <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{item.description}</p>}
              </li>
            )
          })}
        </ul>

        <Buttons compact className="mt-8" />
      </div>

      {/* Tablet y escritorio */}
      <div className="hidden md:grid md:grid-cols-2">
        <div className="sticky top-0 order-2 flex h-svh bg-dots flex-col justify-center self-start pb-8 pl-10 pr-8 pt-24 lg:pl-14 lg:pr-[max(2rem,calc((100vw-90rem)/2+2rem))]">
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

        {/* Cada foto ocupa una pantalla de alto, como una lámina apoyada sobre el papel: margen alrededor, esquinas
            redondeadas y un filete claro. Sin sombra, zoom ni parallax. */}
        <div className="order-1">
          {picks.map((pick) => (
            <figure key={pick.id} id={`plato-${pick.id}`} data-dish data-clip className="relative h-svh px-8 pb-6 pt-24 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-10">
              <div className="photo-in relative size-full overflow-hidden rounded-[1.75rem] bg-ink ring-1 ring-ink/10">
                <Image src={pick.image} alt={pick.alt} fill sizes="50vw" className={cn('photo-tone object-cover', pick.focus)} />
                <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-paper/25" aria-hidden="true" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

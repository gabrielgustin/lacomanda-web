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
  { id: 'burgers-de-costillas', image: '/fotos/costilla.webp', alt: 'Burger de costilla con el hueso asomando', focus: 'object-[50%_72%]' },
  { id: 'pizzas-la-comanda', image: '/fotos/pizzas.webp', alt: 'Pizza recién salida del horno', focus: 'object-center' },
  { id: 'entradas-papas-jodidas', image: '/fotos/entradas.webp', alt: 'Papas con cheddar, panceta y huevo', focus: 'object-center' },
  { id: 'principales-bife-de-chorizo-criollo', image: '/fotos/principales.webp', alt: 'Bife de chorizo con huevo frito y papas', focus: 'object-center' },
  { id: 'mexicana-fajitas-mixtas', image: '/fotos/mexicana.webp', alt: 'Fajitas con tortillas y salsas', focus: 'object-center' },
  { id: 'sandwiches-entrana', image: '/fotos/sandwiches.webp', alt: 'Sándwich de entraña con papas fritas', focus: 'object-center' },
].filter((pick) => itemsById[pick.id])

// Misma familia que la Barra, espejada: a la izquierda las fotos a sangre pasan con el scroll;
// a la derecha la pizarra queda fija y resalta el plato que está en pantalla.
export function Signature() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-dish]').forEach((dish, index) => {
        ScrollTrigger.create({
          trigger: dish,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(index),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="platos" aria-labelledby="platos-title" className="relative z-10 bg-background">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-20 md:sticky md:top-0 md:order-2 md:h-svh md:self-start md:pb-8 md:pt-24 md:pl-10 md:pr-8 lg:pl-14 lg:pr-[max(2rem,calc((100vw-90rem)/2+2rem))]">
          <SplitTitle
            id="platos-title"
            lines={['Recetas de siempre.', 'Hambre de ahora.']}
            className="text-[clamp(2rem,3.4vw,3.5rem)] text-primary"
          />
          <p data-reveal className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-muted-foreground text-pretty">
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
                      index === active ? 'md:opacity-100' : 'md:opacity-45 md:hover:opacity-80',
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer">
              Ver la carta completa <ArrowUpRight className="size-4" aria-hidden="true" />
            </PillLink>
            <PillLink href="#reservas" variant="outline">
              Reservá tu mesa
            </PillLink>
          </div>
        </div>

        <div className="md:order-1">
          {picks.map((pick) => (
            <figure
              key={pick.id}
              id={`plato-${pick.id}`}
              data-dish
              data-clip
              className="relative h-[75svh] overflow-hidden bg-ink md:h-svh"
            >
              <Image
                data-parallax="8"
                src={pick.image}
                alt={pick.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn('scale-115 object-cover', pick.focus)}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

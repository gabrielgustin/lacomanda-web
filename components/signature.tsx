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

// Platos estrella de la carta: vidriera de la casa, no un pedido.
const picks = [
  { id: 'pizzas-la-comanda', image: '/fotos/pizzas.webp', alt: 'Pizza recién salida del horno' },
  { id: 'burgers-de-costillas', image: '/fotos/burgers.webp', alt: 'Burger con cheddar y papas fritas' },
  { id: 'entradas-papas-jodidas', image: '/fotos/entradas.webp', alt: 'Papas con cheddar, panceta y huevo' },
  { id: 'principales-bife-de-chorizo-criollo', image: '/fotos/principales.webp', alt: 'Bife de chorizo con huevo frito y papas' },
  { id: 'mexicana-fajitas', image: '/fotos/mexicana.webp', alt: 'Fajitas con tortillas y salsas' },
  { id: 'sandwiches-entrana', image: '/fotos/sandwiches.webp', alt: 'Sándwich de entraña con papas fritas' },
].filter((pick) => itemsById[pick.id])

// Foto fija a la izquierda que cambia con un barrido a medida que bajás por los platos.
// En el celular cada plato lleva su propia foto a sangre.
export function Signature() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(-1)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-dish]').forEach((dish, index) => {
        ScrollTrigger.create({
          trigger: dish,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => {
            if (!self.isActive) return
            setActive((current) => {
              if (current !== index) setPrev(current)
              return index
            })
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="platos" aria-labelledby="platos-title" className="relative z-10 bg-background">
      <div className="grid md:grid-cols-2">
        {/* Escritorio: marco fijo con las fotos apiladas; la nueva entra tapando a la anterior de abajo hacia arriba. */}
        <div className="relative hidden bg-ink md:sticky md:top-0 md:block md:h-svh md:self-start" aria-hidden="true">
          {picks.map((pick, index) => (
            <Image
              key={pick.id}
              src={pick.image}
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
              style={{
                clipPath: index === active || index === prev ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                zIndex: index === active ? 2 : index === prev ? 1 : 0,
                transition: 'clip-path 900ms cubic-bezier(0.7, 0, 0.2, 1)',
              }}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </div>

        <div className="px-5 py-20 md:py-28 md:pl-10 md:pr-8 lg:pl-14 lg:pr-[max(2rem,calc((100vw-90rem)/2+2rem))]">
          <SplitTitle
            id="platos-title"
            lines={['Recetas de siempre.', 'Hambre de ahora.']}
            className="text-[clamp(2.3rem,4.6vw,5rem)] text-primary"
          />
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Pizzas con masa propia, burgers de 200 gramos, bifes de 400 y salsas de todos los días. Lo que ya es un
            clásico de la casa y lo que vas a querer repetir.
          </p>

          <ul className="mt-12 md:mt-16">
            {picks.map((pick, index) => {
              const item = itemsById[pick.id]
              return (
                <li key={pick.id} data-dish className="md:flex md:min-h-[58svh] md:items-center">
                  {/* Celular: foto a sangre propia (se saca del padding de la columna). */}
                  <div data-clip className="relative -mx-5 mb-5 aspect-[4/3] overflow-hidden bg-ink md:hidden">
                    <Image
                      data-parallax="8"
                      src={pick.image}
                      alt={pick.alt}
                      fill
                      sizes="100vw"
                      className="scale-110 object-cover"
                    />
                  </div>
                  <div
                    className={cn(
                      'w-full pb-12 transition-opacity duration-500 md:pb-0',
                      index === active ? 'md:opacity-100' : 'md:opacity-35',
                    )}
                  >
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-[clamp(1.6rem,3vw,3rem)] text-primary">{item.name.es}</h3>
                      <span className="mb-2 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                      <p className="font-display text-lg text-primary md:text-xl lg:text-2xl">{formatPrice(item.price)}</p>
                    </div>
                    <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">{item.description.es}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div data-reveal className="mt-4 flex flex-wrap items-center gap-3 border-t border-primary/30 pt-8">
            <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer">
              Ver la carta completa <ArrowUpRight className="size-4" aria-hidden="true" />
            </PillLink>
            <PillLink href="#reservas" variant="outline">
              Reservá tu mesa
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  )
}

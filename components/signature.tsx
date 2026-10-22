'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow, PillLink, SplitTitle } from '@/components/ui'
import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// Platos estrella de la carta; al pasar por cada uno cambia la foto de la derecha.
const picks = [
  { id: 'pizzas-la-comanda', image: '/fotos/pizzas.webp', alt: 'Pizza recién salida del horno' },
  { id: 'burgers-de-costillas', image: '/fotos/burgers.webp', alt: 'Burger con cheddar y papas fritas' },
  { id: 'entradas-papas-jodidas', image: '/fotos/entradas.webp', alt: 'Papas con cheddar, panceta y huevo' },
  { id: 'principales-bife-de-chorizo-criollo', image: '/fotos/principales.webp', alt: 'Bife de chorizo con huevo frito y papas' },
  { id: 'mexicana-fajitas', image: '/fotos/mexicana.webp', alt: 'Fajitas con tortillas y salsas' },
  { id: 'sandwiches-entrana', image: '/fotos/sandwiches.webp', alt: 'Sándwich de entraña con papas fritas' },
].filter((pick) => itemsById[pick.id])

export function Signature() {
  const [active, setActive] = useState(0)

  return (
    <section id="platos" aria-labelledby="platos-title" className="relative z-10 bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-[90rem] gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Tarjeta con la lista de platos */}
        <div className="order-2 rounded-3xl bg-primary p-6 text-primary-foreground md:p-8 lg:order-1">
          <div className="mb-6 flex items-center justify-between border-b border-primary-foreground/20 pb-5">
            <h3 className="font-display text-2xl md:text-3xl">Los que no fallan</h3>
            <span className="eyebrow text-accent">Favoritos</span>
          </div>
          <ul>
            {picks.map((pick, index) => {
              const item = itemsById[pick.id]
              return (
                <li key={pick.id} data-reveal>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    aria-pressed={active === index}
                    className={cn(
                      'group flex w-full items-start gap-4 rounded-2xl border-b border-primary-foreground/15 px-3 py-4 text-left transition-colors duration-200',
                      active === index ? 'bg-primary-foreground/10' : 'hover:bg-primary-foreground/5',
                    )}
                  >
                    <span className="flex-1">
                      <span className="font-display block text-base">{item.name.es}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-primary-foreground/70">
                        {item.description.es}
                      </span>
                    </span>
                    <span className="font-display shrink-0 text-sm text-accent">{formatPrice(item.price)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer" variant="cream" className="mt-6 w-full">
            Ver la carta completa <ArrowUpRight className="size-4" aria-hidden="true" />
          </PillLink>
        </div>

        {/* Texto + foto grande */}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <div className="rounded-3xl bg-muted p-6 md:p-10">
            <Eyebrow className="mb-4">Platos de la casa</Eyebrow>
            <SplitTitle
              id="platos-title"
              lines={['Recetas de siempre.', 'Hambre de ahora.']}
              className="text-[clamp(2rem,4.5vw,3.5rem)] text-primary"
            />
            <p data-reveal className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              Pizzas con nuestra propia masa, burgers de 200 gramos, bifes de 400 y salsas que hacemos todos los
              días. Lo que ya es un clásico de la casa y lo que vas a querer repetir.
            </p>
            <div data-reveal className="mt-6">
              <PillLink href="#reservas">Reservá tu mesa</PillLink>
            </div>
          </div>
          <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-3xl bg-ink md:min-h-[460px]">
            {picks.map((pick, index) => (
              <Image
                key={pick.id}
                src={pick.image}
                alt={pick.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={cn(
                  'object-cover transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
                  active === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
                )}
                aria-hidden={active !== index}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6">
              <p className="font-display text-xl text-primary-foreground md:text-2xl" aria-live="polite">
                {itemsById[picks[active].id].name.es}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

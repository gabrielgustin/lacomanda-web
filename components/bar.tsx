import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { PillLink, SplitTitle } from '@/components/ui'
import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'
import { site } from '@/lib/site'

const drinkIds = [
  'bebidas-gin-tonic',
  'bebidas-fernet-branca-con-coca',
  'bebidas-negroni',
  'bebidas-mojito',
  'cervezas-chopp-pinta',
  'cervezas-imperial-ipa-1-lt',
].filter((id) => itemsById[id])

const photos = [
  { src: '/fotos/cervezas.webp', alt: 'Chopp de cerveza rubia junto a una botella' },
  { src: '/fotos/bebidas.webp', alt: 'Mojito y gin tonic con frutos rojos' },
  { src: '/fotos/infantil.webp', alt: 'Mesa junto a la ventana con burger y papas' },
]

// Columna izquierda fija con la lista; a la derecha las fotos pasan mientras scrolleás.
export function Bar() {
  return (
    <section id="barra" aria-labelledby="barra-title" className="relative z-10 bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="px-5 py-20 md:px-8 md:py-28 lg:sticky lg:top-16 lg:self-start lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-12">
          <SplitTitle
            id="barra-title"
            lines={['Bien fría,', 'como tiene', 'que ser']}
            className="text-[clamp(2.8rem,6.4vw,5.5rem)] text-primary"
          />
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Chopp tirado, litros para la mesa y tragos de siempre bien hechos. Para brindar por algo o por nada.
          </p>
          {/* Pizarra: nombre, puntos guía y precio, como en la barra. */}
          <ul className="mt-10">
            {drinkIds.map((id) => {
              const item = itemsById[id]
              return (
                <li key={id} data-reveal className="py-3">
                  <div className="flex items-baseline gap-3">
                    <p className="font-display text-xl text-primary">{item.name.es}</p>
                    <span className="mb-1 flex-1 border-b-2 border-dotted border-primary/35" aria-hidden="true" />
                    <p className="font-display text-lg text-primary">{formatPrice(item.price)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description.es}</p>
                </li>
              )
            })}
          </ul>
          <PillLink data-reveal href={site.cartaUrl} target="_blank" rel="noreferrer" className="mt-8">
            Ver todas las bebidas <ArrowUpRight className="size-4" aria-hidden="true" />
          </PillLink>
        </div>

        <div>
          {photos.map((photo) => (
            <div key={photo.src} data-clip className="relative h-[75svh] overflow-hidden bg-ink lg:h-svh">
              <Image
                data-parallax="10"
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="scale-115 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

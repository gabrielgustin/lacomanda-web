import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow, PillLink, SplitTitle } from '@/components/ui'
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
    <section id="barra" aria-labelledby="barra-title" className="relative z-10 bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow className="mb-4">La barra</Eyebrow>
          <SplitTitle
            id="barra-title"
            lines={['Bien fría,', 'como tiene', 'que ser']}
            className="text-[clamp(2.4rem,5.5vw,4.5rem)] text-primary"
          />
          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Chopp tirado, litros para la mesa y tragos de siempre bien hechos. Para brindar por algo o por nada.
          </p>
          <div data-reveal className="mt-6">
            <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer">
              Ver bebidas <ArrowUpRight className="size-4" aria-hidden="true" />
            </PillLink>
          </div>
          <ul className="mt-10 border-t border-border">
            {drinkIds.map((id) => {
              const item = itemsById[id]
              return (
                <li key={id} data-reveal className="flex items-baseline gap-4 border-b border-border py-4">
                  <div className="flex-1">
                    <p className="font-display text-base text-foreground">{item.name.es}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{item.description.es}</p>
                  </div>
                  <p className="font-display text-sm text-primary">{formatPrice(item.price)}</p>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="grid gap-5">
          {photos.map((photo) => (
            <div key={photo.src} data-clip className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink lg:aspect-[5/6]">
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

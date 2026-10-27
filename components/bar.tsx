import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { PillLink, SplitTitle } from '@/components/ui'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// `focus` encuadra la foto cuando el recorte es más ancho que alto.
const photos = [
  { src: '/fotos/cervezas.webp', alt: 'Chopp de cerveza rubia junto a una botella', focus: 'object-center' },
  { src: '/fotos/bebidas.webp', alt: 'Mojito y gin tonic con frutos rojos', focus: 'object-center' },
  // Foto de Gian Tripodoro en Pexels (licencia libre de Pexels). El vaso está en la parte alta de la foto.
  { src: '/fotos/barra-fernet.webp', alt: 'Vaso de fernet con coca y hielo sobre la barra', focus: 'object-[50%_30%]' },
]

// Columna izquierda fija con el título; a la derecha las fotos pasan mientras scrolleás.
export function Bar() {
  return (
    <section id="barra" aria-labelledby="barra-title" className="relative z-10 bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="px-5 py-20 md:px-8 md:py-28 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:self-start lg:py-0 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-12">
          <SplitTitle
            id="barra-title"
            lines={['Bien fría,', 'como tiene', 'que ser']}
            className="text-[clamp(2.8rem,6.4vw,5.5rem)] text-primary"
          />
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Chopp tirado, litros para la mesa y tragos de siempre bien hechos. Para brindar por algo o por nada.
          </p>
          <PillLink data-reveal href={site.cartaUrl} target="_blank" rel="noreferrer" className="mt-8 w-fit">
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
                className={cn('scale-115 object-cover', photo.focus)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { Star } from 'lucide-react'
import { SplitTitle } from '@/components/ui'

// `rating`: nota de Google si hay API key; si no, la que figura en la ficha.
export function Story({ rating = 4.5 }: { rating?: number }) {
  return (
    <section id="historia" data-tone="dark" aria-labelledby="historia-title" className="relative z-10 overflow-hidden bg-ink text-primary-foreground">
      <div className="relative md:min-h-svh">
        {/* Escritorio: foto apaisada con el cartel a la derecha. */}
        <Image
          src="/fotos/cartel-invitarte-hd.webp"
          alt="Salón de La Comanda con las mesas vacías y, en la pared de ladrillo, el cartel luminoso «La mejor idea fue invitarte»"
          fill
          sizes="100vw"
          className="object-cover object-[100%_28%] max-md:hidden"
        />
        {/* Celular: foto cuadrada con el cartel en el centro, a 1,67 veces el ancho de pantalla (el cartel ocupa ~85 %);
            abajo se funde con el fondo y las cifras van justo debajo del cartel (la sección mide lo que la foto, no toda la pantalla). */}
        <div className="absolute left-1/2 top-6 aspect-square w-[167%] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] md:hidden">
          <Image
            src="/fotos/cartel-invitarte-movil.webp"
            alt="Pared de ladrillo con el cartel luminoso «La mejor idea fue invitarte» sobre mesas vacías y plantas"
            fill
            sizes="170vw"
            className="object-cover"
          />
        </div>
        {/* El cartel de la foto está a la derecha: en escritorio todo el texto va a la izquierda, sobre una sombra que
            se abre hacia él, y el cartel queda sin nada encima. En celular no hay párrafo y la foto
            es otra (cartel centrado); el título va abajo, sobre las cifras. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40 md:from-ink/60 md:via-transparent md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/85 via-ink/30 to-transparent md:block" />

        <div className="relative mx-auto flex max-w-[90rem] flex-col justify-end gap-10 px-5 py-20 max-md:pt-[calc(1.5rem+130vw)] max-md:pb-12 md:min-h-svh md:justify-between md:px-8 md:py-28">
          <SplitTitle
            id="historia-title"
            lines={['Una mesa', 'que nunca', 'se levanta']}
            className="max-md:sr-only text-[clamp(2.6rem,7.5vw,6.5rem)] text-[color-mix(in_srgb,var(--primary-foreground)_72%,var(--accent))]"
          />
          <div className="grid max-w-md gap-6">
            <p className="hidden max-w-md text-base leading-relaxed text-primary-foreground/95 text-pretty md:block [text-shadow:0_1px_14px_rgb(0_0_0/0.85)]">
              La Comanda nació con una idea simple: un lugar donde la comida se pida al centro, las charlas se
              estiren y nadie mire el reloj. Del desayuno a la última ronda: cocina casera, ingredientes que
              conocemos y una barra que siempre tiene algo frío para vos.
            </p>
            {/* Cifras de la carta digital y de la ficha de Google (horarios). */}
            <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 max-md:text-center">
              <div>
                <dt className="text-sm text-primary-foreground/70">Abrimos</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">7 días</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Platos</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">+90</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Reseñas</dt>
                <dd className="font-display mt-2 flex items-center gap-1.5 max-md:justify-center text-lg sm:text-2xl md:text-3xl">
                  {rating.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  <Star className="size-[0.8em] fill-accent text-accent drop-shadow-[0_0_8px_rgb(201_145_95/0.55)]" aria-hidden="true" />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

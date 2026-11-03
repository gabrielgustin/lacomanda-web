import Image from 'next/image'
import { SplitTitle } from '@/components/ui'

export function Story() {
  return (
    <section id="historia" data-tone="dark" aria-labelledby="historia-title" className="relative z-10 overflow-hidden bg-ink text-primary-foreground">
      <div className="relative min-h-svh">
        <Image
          data-parallax="10"
          src="/fotos/salon.webp"
          alt="Salón de La Comanda: mesas largas junto a la pared de ladrillo y el cartel de neón «Lo bueno se comparte»"
          fill
          sizes="100vw"
          className="origin-left scale-120 object-cover object-[0%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />

        <div className="relative mx-auto flex min-h-svh max-w-[90rem] flex-col justify-between gap-10 px-5 py-20 md:px-8 md:py-28">
          {/* En escritorio el título va a la derecha, sobre la pared de ladrillo, y deja ver el neón de la izquierda. */}
          <div className="lg:self-end lg:text-right">
            <SplitTitle
              id="historia-title"
              lines={['Una mesa', 'que nunca', 'se levanta']}
              className="text-[clamp(3rem,9vw,8rem)]"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-primary-foreground/85 text-pretty">
              La Comanda nació con una idea simple: un lugar donde la comida se pida al centro, las charlas se
              estiren y nadie mire el reloj. Del desayuno a la última ronda: cocina casera, ingredientes que
              conocemos y una barra que siempre tiene algo frío para vos.
            </p>
            {/* Cifras de la carta digital y de la ficha de Google (horarios). */}
            <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 md:justify-self-end">
              <div>
                <dt className="text-sm text-primary-foreground/70">Abrimos</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">7 días</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Platos</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">+90</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Pizzas</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">24</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

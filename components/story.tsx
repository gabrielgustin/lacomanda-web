import Image from 'next/image'
import { SplitTitle } from '@/components/ui'

export function Story() {
  return (
    <section id="historia" data-tone="dark" aria-labelledby="historia-title" className="relative z-10 overflow-hidden bg-ink text-primary-foreground">
      <div className="relative min-h-svh">
        <Image
          src="/fotos/cartel-invitarte-hd.webp"
          alt="Salón de La Comanda con las mesas vacías y, en la pared de ladrillo, el cartel luminoso «La mejor idea fue invitarte»"
          fill
          sizes="100vw"
          className="object-cover object-[100%_28%] max-md:translate-x-[-20%] max-md:translate-y-[4%] max-md:[mask-image:linear-gradient(to_right,#000_86%,transparent_100%)]"
        />
        {/* El cartel de la foto está a la derecha: en escritorio todo el texto va a la izquierda, sobre una sombra que
            se abre hacia él, y el cartel queda sin nada encima. En celular la foto baja un poco (sin agrandarla) para que
            el cartel quede entre el título y el texto, con poca sombra en el medio. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40 md:from-ink/60 md:via-transparent md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/85 via-ink/30 to-transparent md:block" />

        <div className="relative mx-auto flex min-h-svh max-w-[90rem] flex-col justify-between gap-10 px-5 py-20 md:px-8 md:py-28">
          <SplitTitle
            id="historia-title"
            lines={['Una mesa', 'que nunca', 'se levanta']}
            className="text-[clamp(3rem,9vw,8rem)]"
          />
          <div className="grid max-w-md gap-6">
            <p className="max-w-md text-base leading-relaxed text-primary-foreground/95 text-pretty [text-shadow:0_1px_14px_rgb(0_0_0/0.85)]">
              La Comanda nació con una idea simple: un lugar donde la comida se pida al centro, las charlas se
              estiren y nadie mire el reloj. Del desayuno a la última ronda: cocina casera, ingredientes que
              conocemos y una barra que siempre tiene algo frío para vos.
            </p>
            {/* Cifras de la carta digital y de la ficha de Google (horarios). */}
            <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6">
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

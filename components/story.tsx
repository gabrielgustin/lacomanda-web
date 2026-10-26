import Image from 'next/image'
import { SplitTitle } from '@/components/ui'
import { site } from '@/lib/site'

export function Story() {
  return (
    <section id="historia" aria-labelledby="historia-title" className="relative z-10 overflow-hidden bg-ink text-primary-foreground">
      <div className="relative min-h-svh">
        <Image
          data-parallax="10"
          src="/fotos/sandwiches.webp"
          alt="Sándwich de entraña en una mesa del salón, con paredes de ladrillo"
          fill
          sizes="100vw"
          className="scale-120 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />

        <div className="relative mx-auto flex min-h-svh max-w-[90rem] flex-col justify-between gap-10 px-5 py-20 md:px-8 md:py-28">
          <div>
            <SplitTitle
              id="historia-title"
              lines={['Una mesa', 'que nunca', 'se levanta']}
              className="text-[clamp(3rem,9vw,8rem)]"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-primary-foreground/85 text-pretty">
              La Comanda nació en {site.since} con una idea simple: un lugar donde la comida se pida al centro, las
              charlas se estiren y nadie mire el reloj. Desde entonces seguimos igual: cocina casera, ingredientes
              que conocemos y una barra que siempre tiene algo frío para vos.
            </p>
            <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 md:justify-self-end">
              <div>
                <dt className="text-sm text-primary-foreground/70">Desde</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">{site.since}</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Platos</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">+50</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-foreground/70">Salsas</dt>
                <dd className="font-display mt-2 text-lg sm:text-2xl md:text-3xl">Caseras</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

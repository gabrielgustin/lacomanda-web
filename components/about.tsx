import Image from 'next/image'
import { SplitTitle } from '@/components/ui'

// Primer panel que se apila sobre el hero.
export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative z-10 bg-background">
      <div className="mx-auto grid max-w-[90rem] items-stretch lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div data-clip className="relative min-h-[420px] overflow-hidden bg-ink lg:min-h-[640px]">
          <Image
            data-parallax="8"
            src="/fotos/burgers.webp"
            alt="Burger con papas fritas sobre una mesa de madera de La Comanda"
            fill
            sizes="(min-width: 1440px) 720px, (min-width: 1024px) 55vw, 100vw"
            className="scale-110 object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-8 px-5 py-16 md:px-12 lg:py-24">
          <SplitTitle
            id="nosotros-title"
            lines={['Acá no hay', 'protocolo,', 'hay sobremesa']}
            className="text-[clamp(2.2rem,5.2vw,4.75rem)] text-primary"
          />
          <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Cocinamos lo que nos gusta comer: porciones generosas, salsas caseras, carnes a la plancha y masa que
            leva sin apuro. La comida llega al centro y cada uno se sirve lo que quiere.
          </p>
          <a
            href="#historia"
            className="w-fit rounded-full font-semibold text-primary underline decoration-accent decoration-2 underline-offset-8 hover:decoration-primary"
          >
            Conocé nuestra historia
          </a>
        </div>
      </div>
    </section>
  )
}

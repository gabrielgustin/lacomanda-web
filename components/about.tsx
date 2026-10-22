import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PillLink, SplitTitle } from '@/components/ui'

// Primer panel que se apila sobre el hero.
export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative z-10 -mt-6 rounded-t-3xl bg-background pt-5 md:pt-8">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div data-clip className="relative h-[78svh] min-h-[520px] overflow-hidden rounded-3xl bg-ink text-primary-foreground">
          <Image
            data-parallax="8"
            src="/fotos/burgers.webp"
            alt="Burger con papas fritas sobre una mesa de madera de La Comanda"
            fill
            sizes="(min-width: 1440px) 1376px, 100vw"
            className="scale-110 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-6 md:p-12">
            <div className="max-w-xl">
              <p className="eyebrow mb-4 text-accent">Nosotros</p>
              <SplitTitle
                id="nosotros-title"
                lines={['Hecho para', 'compartir']}
                className="text-[clamp(2.4rem,6vw,4.75rem)]"
              />
              <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/85 md:text-base">
                Cocinamos lo que nos gusta comer: porciones generosas, salsas caseras, carnes a la plancha y
                masa que leva sin apuro. Acá no hay protocolo, hay sobremesa.
              </p>
            </div>
            <div data-reveal>
              <PillLink href="#historia" variant="cream">
                Conocé nuestra historia <ArrowRight className="size-4" aria-hidden="true" />
              </PillLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

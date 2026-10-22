import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { PillLink, SplitTitle } from '@/components/ui'
import { whatsappLink } from '@/lib/site'

const cards = [
  {
    image: '/fotos/pizzas.webp',
    alt: 'Pizza al centro de la mesa',
    title: 'Cumples y festejos',
    text: 'Mesa larga, torta propia si querés y la pizza que no puede faltar. Nosotros nos encargamos del resto.',
  },
  {
    image: '/fotos/cervezas.webp',
    alt: 'Chopp de cerveza y botella sobre la barra',
    title: 'After office',
    text: 'Salís del laburo, pedís un chopp y una de papas jodidas. El mejor plan de la semana.',
  },
  {
    image: '/fotos/entradas.webp',
    alt: 'Papas con cheddar y panceta para compartir',
    title: 'Grupos y empresas',
    text: 'Armamos menú cerrado para grupos grandes, con opciones para todos y precio fijo por persona.',
  },
]

export function Events() {
  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative z-10 bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <p className="eyebrow hidden w-32 text-right text-primary md:block">Mesas largas</p>
          <SplitTitle
            id="eventos-title"
            lines={['Eventos', 'y grupos']}
            className="text-center text-[clamp(2.5rem,7vw,5.5rem)] text-primary"
          />
          <p className="eyebrow hidden w-32 text-primary md:block">Planes cortos</p>
        </div>
        <p data-reveal className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
          Cumpleaños, despedidas, after office o la juntada que venís postergando hace meses. Contanos cuántos son
          y te armamos la mesa.
        </p>
        <div data-reveal className="mt-8 flex justify-center">
          <PillLink
            href={whatsappLink('¡Hola La Comanda! Quiero consultar por un evento para grupo.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> Consultá por WhatsApp
          </PillLink>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <li key={card.title} className={index === 1 ? 'md:mt-16' : undefined}>
              <div data-clip className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink">
                <Image
                  data-parallax="10"
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="scale-115 object-cover"
                />
              </div>
              <div data-reveal className="px-1 pt-5 text-center">
                <h3 className="font-display text-xl text-primary">{card.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

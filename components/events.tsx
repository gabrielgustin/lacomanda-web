import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { PillLink, SplitTitle } from '@/components/ui'
import { whatsappLink } from '@/lib/site'

const cards = [
  {
    image: '/fotos/eventos/cumples.webp',
    alt: 'Amigos festejando un cumpleaños en la mesa, con un globo de Happy Birthday',
    title: 'Cumples y festejos',
    text: 'Mesa larga, torta propia si querés y la pizza que no puede faltar. Nosotros nos encargamos del resto.',
  },
  {
    image: '/fotos/eventos/after-office.webp',
    alt: 'Grupo de amigos brindando con jarras de cerveza en la barra',
    title: 'After office',
    text: 'Salís del laburo, pedís un chopp y una de papas jodidas. El mejor plan de la semana.',
  },
  {
    image: '/fotos/eventos/grupos.webp',
    alt: 'Grupo grande compartiendo una mesa larga en un restaurante',
    title: 'Grupos y empresas',
    text: 'Armamos menú cerrado para grupos grandes, con opciones para todos y precio fijo por persona.',
  },
]

export function Events() {
  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative z-10 bg-primary py-20 text-primary-foreground md:py-28">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <SplitTitle
            id="eventos-title"
            lines={['Mesas largas', 'para planes cortos']}
            className="text-[clamp(2.8rem,7.5vw,6.5rem)]"
          />
          <p data-reveal className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 text-pretty">
            Cumpleaños, despedidas, after office o la juntada que venís postergando hace meses. Contanos cuántos son
            y te armamos la mesa.
          </p>
          <div data-reveal className="mt-8">
            <PillLink
              href={whatsappLink('¡Hola La Comanda! Quiero consultar por un evento para grupo.')}
              target="_blank"
              rel="noreferrer"
              variant="cream"
            >
              <MessageCircle className="size-4" aria-hidden="true" /> Consultá por WhatsApp
            </PillLink>
          </div>
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
                <h3 className="font-display text-2xl">{card.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-primary-foreground/75">{card.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

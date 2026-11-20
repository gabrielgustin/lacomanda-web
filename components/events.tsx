'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { PillLink } from '@/components/ui'
import { whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

const plans = [
  {
    image: '/fotos/eventos/festejos-pizzas.webp',
    alt: 'Amigas riendo alrededor de una mesa de madera con pizzas, vino y chopp; al fondo, el neón «Lo bueno se comparte»',
    // Foto casi cuadrada: `focus` encuadra caras y mesa (en celular manda el corrimiento horizontal).
    focus: 'object-[58%_50%] md:object-[50%_30%]',
    title: 'Festejos',
    text: 'Mesa larga, torta propia si querés y la pizza que no puede faltar. Nosotros nos encargamos del resto.',
  },
  {
    image: '/fotos/eventos/after-office-brindis-hd.webp',
    alt: 'Amigos brindando con chopp, gin tonic y Aperol en una mesa de madera con papas y picada, frente a la pared de ladrillo',
    focus: 'object-[55%_50%] md:object-[50%_40%]',
    title: 'After office',
    text: 'Salís del laburo, pedís un chopp y unas papas con cheddar. El mejor plan de la semana.',
  },
  {
    image: '/fotos/eventos/grupos-oficina-hd.webp',
    alt: 'Tres compañeras charlando con una notebook, un cuaderno y un café sobre la mesa de madera, frente a la pared de ladrillo',
    focus: 'object-[45%_50%] md:object-[50%_45%]',
    title: 'Salón privado',
    text: 'Armamos menú cerrado para grupos grandes, con opciones para todos y precio fijo por persona.',
  },
]

// Los tres planes en un selector: tres botones arriba y una tarjeta grande que cambia con un fundido. Sin escena fija
// ni efectos de scroll, igual en celular, tablet y escritorio.
export function Events() {
  const [current, setCurrent] = useState(0)

  return (
    <section id="eventos" data-tone="dark" aria-label="Eventos y planes" className="relative z-10 bg-ink px-5 py-16 text-paper md:px-8 md:py-24 lg:py-28">
      <div className="mx-auto max-w-3xl lg:max-w-5xl">
        <h2 className="sr-only">Mesas largas para planes cortos</h2>

        <div role="tablist" aria-label="Planes" className="grid grid-cols-3 gap-2">
          {plans.map((plan, i) => (
            <button
              key={plan.title}
              type="button"
              role="tab"
              id={`plan-tab-${i}`}
              aria-selected={i === current}
              aria-controls={`plan-panel-${i}`}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full border px-2 py-3 text-sm font-semibold leading-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent md:text-base',
                i === current ? 'border-paper bg-paper text-ink' : 'border-paper/30 text-paper/80 hover:border-paper/60',
              )}
            >
              {plan.title}
            </button>
          ))}
        </div>

        {/* Los tres planes comparten la misma celda: se cruzan con un fundido y el alto no salta al cambiar. */}
        <div className="mt-6 grid">
          {plans.map((plan, i) => (
            <div
              key={plan.title}
              role="tabpanel"
              id={`plan-panel-${i}`}
              aria-labelledby={`plan-tab-${i}`}
              inert={i !== current}
              className={cn(
                'col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 lg:gap-14',
                i === current ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-black ring-1 ring-paper/10">
                <Image src={plan.image} alt={plan.alt} fill sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" className={cn('photo-tone object-cover', plan.focus)} />
                <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-paper/30" aria-hidden="true" />
              </div>
              <div className="mt-5 md:mt-0">
                <h3 className="font-display text-[clamp(2.2rem,8vw,3.2rem)] leading-[0.95] lg:text-[3.6rem]">{plan.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-paper/85">{plan.text}</p>
                <PillLink
                  href={whatsappLink(`¡Hola La Comanda! Quiero consultar por ${plan.title}. ¿Me pasan información y disponibilidad?`)}
                  target="_blank"
                  rel="noreferrer"
                  variant="cream"
                  className="mt-6"
                >
                  <MessageCircle className="size-4" aria-hidden="true" /> Consultá por WhatsApp
                </PillLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

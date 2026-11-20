import { PillLink, SplitTitle } from '@/components/ui'
import { cn } from '@/lib/utils'

// Promos vigentes de La Comanda. `highlight` es lo que se lee de un vistazo en el ticket.
const promos = [
  { day: 'Martes', highlight: '2º al 50%', text: 'Consumiendo dos sándwiches, el segundo sale al 50%.' },
  {
    day: 'Miércoles',
    highlight: '15% off',
    text: '15% de descuento para mesas de mujeres. Superando los $40.000, 15% en efectivo.',
  },
  { day: 'Jueves', highlight: '2x1', text: '2x1 en hamburguesas.' },
  { day: 'Domingos', highlight: '2ª al 50%', text: 'Consumiendo dos pizzas, la más económica al 50%.' },
]

// Papel de cada ticket y su giro al quedar apoyado en la pila.
const looks = [
  { tone: 'bg-paper text-ink', rotate: -2 },
  { tone: 'bg-[#ecd9bd] text-ink', rotate: 1.5 },
  { tone: 'bg-primary text-primary-foreground', rotate: -1 },
  { tone: 'bg-paper text-ink', rotate: 2 },
]

// Cada promo es un ticket apoyado sobre el papel, uno debajo del otro (sin superponerse). Al llegar a la pantalla,
// cada ticket cae y se acomoda (`.promo-in` en globals.css); el giro leve es decoración.
export function Promos() {
  return (
    <section id="promos" aria-labelledby="promos-title" className="relative z-10 bg-dots px-5 py-16 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10 md:px-8 md:py-28 lg:px-[max(2rem,calc((100vw-90rem)/2+2rem))]">
      <div className="md:sticky md:top-28 md:self-start">
        <SplitTitle
          id="promos-title"
          lines={['Todos los días', 'hay algo']}
          className="text-[clamp(2.4rem,5.4vw,5rem)] text-primary"
        />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty md:mt-6 md:text-base">
          Las promos de la semana en La Comanda. Elegí el día y venite con hambre.
        </p>
        <div className="mt-6 md:mt-8">
          <PillLink href="#reservas">Reservá tu mesa</PillLink>
        </div>
      </div>

      <ul className="mx-auto mt-10 w-full max-w-[26rem] space-y-6 md:mt-0 md:max-w-md">
        {promos.map((promo, i) => (
          <li key={promo.day + promo.highlight} className="promo-in" style={{ rotate: `${looks[i].rotate}deg` }}>
            <div className="ticket-shadow">
              <div className={cn('ticket flex flex-col gap-3 px-5 pb-6 pt-4 md:px-6', looks[i].tone)}>
                <p className="font-display text-xl leading-none md:text-2xl">{promo.day}</p>
                <p className="font-display text-4xl leading-none md:text-5xl">{promo.highlight}</p>
                <p className="text-sm leading-snug opacity-85">{promo.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

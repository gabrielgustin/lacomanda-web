'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Clock, Send } from 'lucide-react'
import { SplitTitle } from '@/components/ui'
import { DateField, ListField, type FieldOption } from '@/components/fields'
import { OpenStatus } from '@/components/open-status'
import { site, whatsappLink } from '@/lib/site'
import { cordobaNow, hourRows } from '@/lib/hours'
import { cn } from '@/lib/utils'

const labelClass = 'block text-xs font-bold'
const nameClass =
  'mt-1 h-11 w-full border-0 border-b-2 border-dashed border-ink/50 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/45 hover:bg-ink/5 focus:bg-ink/5 focus-visible:rounded-none'

// Turnos cada media hora: mediodía (domingos) y noche. Se confirma por WhatsApp.
const slots = (from: number, to: number, group: string): FieldOption[] =>
  Array.from({ length: Math.floor((to - from) * 2) + 1 }, (_, i) => {
    const t = (from + i / 2) % 24
    const label = `${pad(Math.floor(t))}:${t % 1 ? '30' : '00'}`
    return { value: label, label, group }
  })
const pad = (n: number) => String(n).padStart(2, '0')
const timeOptions = [...slots(12, 15.5, 'Mediodía'), ...slots(19.5, 25.5, 'Noche')]
const peopleOptions: FieldOption[] = [...Array.from({ length: 10 }, (_, i) => String(i + 1)), 'Más de 10'].map((n) => ({
  value: n,
  label: n,
}))

// La reserva se arma como mensaje de WhatsApp: sin backend y el local confirma por chat.
export function Reservations() {
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [people, setPeople] = useState('2')
  // El día de hoy (en Córdoba) se resalta en los horarios; solo en el navegador.
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => setToday(cordobaNow().day), [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('nombre') || '').trim()
    if (!name || !date || !time) {
      setError('Completá tu nombre, la fecha y la hora.')
      return
    }
    setError('')
    const [y, m, d] = date.split('-')
    const text = `¡Hola La Comanda! Quiero reservar una mesa.\n\nNombre: ${name}\nDía: ${d}/${m}/${y}\nHora: ${time}\nPersonas: ${people}`
    window.open(whatsappLink(text), '_blank', 'noopener')
  }

  return (
    <section id="reservas" aria-labelledby="reservas-title" className="relative z-10 bg-muted py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <SplitTitle
            id="reservas-title"
            lines={['Guardamos', 'tu mesa']}
            className="text-[clamp(2.8rem,6.4vw,5rem)] text-primary"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Completá la comanda y te abrimos WhatsApp con el mensaje listo. Te confirmamos la mesa en el chat.
          </p>

          <div className="mt-10 flex gap-4 text-sm">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <OpenStatus className="mb-3 font-semibold text-primary" />
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {hourRows.map((row) => (
                  <div key={row.label} className={cn('contents', today !== null && row.days.includes(today) && '[&>*]:text-primary [&>dt]:font-bold')}>
                    <dt className="font-semibold">{row.label}</dt>
                    <dd className="tabular-nums text-muted-foreground">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="ticket-shadow lg:rotate-[1.5deg]">
          <form
            onSubmit={onSubmit}
            noValidate
            className="ticket px-6 pt-7 md:px-9"
            aria-describedby={error ? 'reserva-error' : undefined}
          >
            <p className="font-display text-center text-2xl sm:text-3xl">Comanda de reserva</p>
            <p className="mt-1 text-center text-xs">Mesa a confirmar por WhatsApp</p>
            <div className="ticket-rule my-5" />
            <div className="space-y-5">
              <label className="block">
                <span className={labelClass}>Nombre</span>
                <input name="nombre" autoComplete="name" required placeholder="¿A nombre de quién?" className={nameClass} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField label="Día" value={date} onChange={setDate} />
                <ListField label="Hora" value={time} onChange={setTime} options={timeOptions} placeholder="Elegí una hora" icon="clock" />
              </div>
              <ListField label="Personas" value={people} onChange={setPeople} options={peopleOptions} placeholder="¿Cuántos son?" />
            </div>
            <div className="ticket-rule my-5" />
            {error && (
              <p id="reserva-error" role="alert" className="mb-4 text-sm font-bold text-stamp">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="pill-sheen inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink"
            >
              <Send className="size-4" aria-hidden="true" /> Reservar por WhatsApp
            </button>
          </form>
        </div>
      </div>

      {/* Dónde estamos: el mapa real del local (la ficha de Google trae su propio "Cómo llegar"). */}
      <div className="mx-auto mt-20 max-w-6xl px-5 md:mt-28">
        <div className="relative overflow-hidden bg-ink shadow-[0_24px_48px_-24px_rgb(36_21_14/0.55)]">
          <iframe
            title={`Mapa de La Comanda en ${site.address}, ${site.addressDetail}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`La Comanda Tejeda, ${site.address}, Córdoba`)}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[20rem] w-full border-0 [filter:sepia(0.3)_saturate(0.85)_contrast(1.05)] md:h-[28rem]"
          />
        </div>
      </div>
    </section>
  )
}

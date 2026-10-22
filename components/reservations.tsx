'use client'

import { useState, type FormEvent } from 'react'
import { CalendarDays, Clock, MapPin, Send, Users } from 'lucide-react'
import { Eyebrow, SplitTitle } from '@/components/ui'
import { site, whatsappLink } from '@/lib/site'

const fieldClass =
  'h-12 w-full rounded-full border border-border bg-card px-5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20'

// La reserva se arma como mensaje de WhatsApp: sin backend y el local confirma por chat.
export function Reservations() {
  const [error, setError] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('nombre') || '').trim()
    const date = String(data.get('fecha') || '')
    const time = String(data.get('hora') || '')
    const people = String(data.get('personas') || '')
    if (!name || !date || !time) {
      setError('Completá tu nombre, la fecha y la hora.')
      return
    }
    setError('')
    const [y, m, d] = date.split('-')
    const text = `¡Hola La Comanda! Quiero reservar una mesa.\n\nNombre: ${name}\nDía: ${d}/${m}/${y}\nHora: ${time}\nPersonas: ${people}`
    window.open(whatsappLink(text), '_blank', 'noopener')
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section id="reservas" aria-labelledby="reservas-title" className="relative z-10 bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-4">Reservas</Eyebrow>
          <SplitTitle id="reservas-title" lines={['Guardamos', 'tu mesa']} className="text-[clamp(2.2rem,5vw,3.75rem)] text-primary" />
          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Completá los datos y te abrimos WhatsApp con el mensaje listo. Te confirmamos la mesa en el chat.
          </p>

          <ul data-reveal className="mt-10 space-y-5 text-sm">
            <li className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold">{site.address}</p>
                <p className="text-muted-foreground">{site.addressDetail}</p>
                <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block rounded-full font-semibold text-primary underline underline-offset-4">
                  Cómo llegar
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {site.hours.map((row) => (
                  <div key={row.days} className="contents">
                    <dt className="font-semibold">{row.days}</dt>
                    <dd className="text-muted-foreground">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>
        </div>

        <form
          data-reveal
          onSubmit={onSubmit}
          noValidate
          className="dot-pattern self-start rounded-3xl border border-border bg-card p-6 md:p-8"
          aria-describedby={error ? 'reserva-error' : undefined}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="eyebrow mb-2 block text-primary">Tu nombre</span>
              <input name="nombre" autoComplete="name" required placeholder="¿A nombre de quién?" className={fieldClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow mb-2 flex items-center gap-1.5 text-primary">
                  <CalendarDays className="size-3.5" aria-hidden="true" /> Día
                </span>
                <input name="fecha" type="date" min={today} required className={fieldClass} />
              </label>
              <label className="block">
                <span className="eyebrow mb-2 flex items-center gap-1.5 text-primary">
                  <Clock className="size-3.5" aria-hidden="true" /> Hora
                </span>
                <input name="hora" type="time" required className={fieldClass} />
              </label>
            </div>
            <label className="block">
              <span className="eyebrow mb-2 flex items-center gap-1.5 text-primary">
                <Users className="size-3.5" aria-hidden="true" /> Personas
              </span>
              <select name="personas" defaultValue="2" className={fieldClass}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Más de 10'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error && (
            <p id="reserva-error" role="alert" className="mt-4 text-sm font-medium text-ring">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="pill-sheen mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink"
          >
            <Send className="size-4" aria-hidden="true" /> Reservar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  )
}

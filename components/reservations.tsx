'use client'

import { useState, type FormEvent } from 'react'
import { Clock, MapPin, Send } from 'lucide-react'
import { SplitTitle } from '@/components/ui'
import { site, whatsappLink } from '@/lib/site'

const labelClass = 'block text-xs font-bold'
const fieldClass =
  'mt-1 h-11 w-full border-0 border-b-2 border-dashed border-ink/50 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/45 focus:border-solid focus:border-primary focus-visible:ring-0'

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
    <section id="reservas" aria-labelledby="reservas-title" className="relative z-10 bg-muted py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <SplitTitle
            id="reservas-title"
            lines={['Guardamos', 'tu mesa']}
            className="text-[clamp(2.8rem,6.4vw,5.5rem)] text-primary"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            Completá la comanda y te abrimos WhatsApp con el mensaje listo. Te confirmamos la mesa en el chat.
          </p>

          <ul className="mt-10 space-y-6 text-sm">
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
                <input name="nombre" autoComplete="name" required placeholder="¿A nombre de quién?" className={fieldClass} />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Día</span>
                  <input name="fecha" type="date" min={today} required className={fieldClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Hora</span>
                  <input name="hora" type="time" required className={fieldClass} />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Personas</span>
                <select name="personas" defaultValue="2" className={fieldClass}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Más de 10'].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
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
    </section>
  )
}

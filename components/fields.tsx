'use client'

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

// Controles del formulario con el UI de la web (papel de ticket, Courier, cacao) en lugar de los nativos del navegador.
// Los desplegables se montan en <body> con posición fija: el ticket recorta con una máscara todo lo que se sale de su caja.

const labelClass = 'block text-xs font-bold'
const triggerClass =
  'mt-1 flex h-11 w-full items-center justify-between gap-3 border-0 border-b-2 border-dashed border-ink/50 bg-transparent px-0 text-left text-base text-ink outline-none transition-colors hover:bg-ink/5 focus-visible:rounded-none focus-visible:bg-ink/5 data-[open=true]:bg-ink/5'

function Popover({
  open,
  anchor,
  onClose,
  minWidth = 0,
  label,
  role,
  children,
}: {
  open: boolean
  anchor: RefObject<HTMLElement | null>
  onClose: () => void
  minWidth?: number
  label: string
  role: 'dialog' | 'presentation'
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number } | null>(null)

  const place = useCallback(() => {
    const a = anchor.current
    if (!a) return
    const r = a.getBoundingClientRect()
    const width = Math.max(r.width, minWidth)
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8)
    const height = ref.current?.offsetHeight ?? 0
    const below = window.innerHeight - r.bottom - 12
    // Si abajo no entra y arriba hay más lugar, se abre hacia arriba.
    const up = height > below && r.top > below
    setPos(up ? { left, width, bottom: window.innerHeight - r.top + 6 } : { left, width, top: r.bottom + 6 })
  }, [anchor, minWidth])

  useLayoutEffect(() => {
    if (open) place()
    else setPos(null)
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!ref.current?.contains(target) && !anchor.current?.contains(target)) onClose()
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onClose()
      anchor.current?.focus()
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, anchor, onClose, place])

  if (!open) return null
  return createPortal(
    <div
      ref={ref}
      role={role === 'dialog' ? 'dialog' : undefined}
      aria-label={label}
      style={pos ?? { visibility: 'hidden', top: 0, left: 0, width: minWidth || undefined }}
      className="font-ticket fixed z-[70] border border-dashed border-ink/40 bg-paper text-ink shadow-[0_22px_40px_-14px_rgb(20_10_5/0.45)]"
    >
      {children}
    </div>,
    document.body,
  )
}

/* ---------- Calendario ---------- */

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
const parseIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return { y, m: m - 1, d }
}
// Fecha local (no UTC): de noche en Argentina el día UTC ya es el siguiente.
const todayIso = () => {
  const now = new Date()
  return toIso(now.getFullYear(), now.getMonth(), now.getDate())
}

const monthFmt = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' })
const shortFmt = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
const fullFmt = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const stepByKey: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }

const navButton =
  'inline-flex size-8 items-center justify-center rounded-full outline-none transition-colors hover:bg-ink/10 focus-visible:bg-ink/10 disabled:pointer-events-none disabled:opacity-30'

function CalendarPanel({
  value,
  min,
  onPick,
  onClear,
}: {
  value: string
  min: string
  onPick: (iso: string) => void
  onClear: () => void
}) {
  const start = parseIso(value || min)
  const [view, setView] = useState({ y: start.y, m: start.m })
  const grid = useRef<HTMLDivElement>(null)
  const today = todayIso()
  const minDate = parseIso(min)

  const canGoBack = view.y > minDate.y || (view.y === minDate.y && view.m > minDate.m)
  const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // la semana arranca en lunes
  const days = new Date(view.y, view.m + 1, 0).getDate()

  useEffect(() => {
    const first =
      grid.current?.querySelector<HTMLElement>('[aria-pressed="true"]') ??
      grid.current?.querySelector<HTMLElement>('button:not(:disabled)')
    first?.focus()
  }, [])

  const shift = (delta: number) =>
    setView((v) => {
      const next = new Date(v.y, v.m + delta, 1)
      return { y: next.getFullYear(), m: next.getMonth() }
    })

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = stepByKey[event.key]
    if (!step) return
    event.preventDefault()
    const buttons = Array.from(grid.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    buttons[Math.min(buttons.length - 1, Math.max(0, index + step))]?.focus()
  }

  return (
    <div className="p-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <p aria-live="polite" className="font-bold first-letter:uppercase">
          {monthFmt.format(new Date(view.y, view.m, 1))}
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => shift(-1)} disabled={!canGoBack} aria-label="Mes anterior" className={navButton}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => shift(1)} aria-label="Mes siguiente" className={navButton}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-ink/50" aria-hidden="true">
        {weekdays.map((day, i) => (
          <span key={i} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div ref={grid} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const iso = toIso(view.y, view.m, i + 1)
          const selected = iso === value
          return (
            <button
              key={iso}
              type="button"
              disabled={iso < min}
              aria-pressed={selected}
              aria-label={fullFmt.format(new Date(view.y, view.m, i + 1))}
              onClick={() => onPick(iso)}
              className={cn(
                'mx-auto inline-flex size-9 items-center justify-center rounded-full outline-none transition-colors',
                selected ? 'bg-primary text-primary-foreground' : 'hover:bg-ink/10 focus-visible:bg-ink/10',
                iso === today && !selected && 'underline decoration-accent decoration-2 underline-offset-4',
                'disabled:pointer-events-none disabled:text-ink/25',
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex justify-between border-t border-dashed border-ink/30 pt-2 text-xs">
        <button type="button" onClick={onClear} className="rounded-sm underline outline-none underline-offset-4 hover:text-primary focus-visible:bg-ink/10">
          Borrar
        </button>
        <button
          type="button"
          onClick={() => onPick(today)}
          disabled={today < min}
          className="rounded-sm underline outline-none underline-offset-4 hover:text-primary focus-visible:bg-ink/10 disabled:opacity-30"
        >
          Hoy
        </button>
      </div>
    </div>
  )
}

export function DateField({
  label,
  value,
  onChange,
  placeholder = 'Elegí un día',
  min,
}: {
  label: string
  value: string
  onChange: (iso: string) => void
  placeholder?: string
  min?: string
}) {
  const labelId = useId()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const picked = value ? parseIso(value) : null

  return (
    <div>
      <span id={labelId} className={labelClass}>
        {label}
      </span>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={labelId}
        data-open={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClass}
      >
        <span className={cn('first-letter:uppercase', !picked && 'text-ink/45')}>
          {picked ? shortFmt.format(new Date(picked.y, picked.m, picked.d)) : placeholder}
        </span>
        <CalendarDays className="size-4 shrink-0 text-ink/60" aria-hidden="true" />
      </button>
      <Popover open={open} anchor={trigger} onClose={close} minWidth={304} label={label} role="dialog">
        <CalendarPanel
          value={value}
          min={min ?? todayIso()}
          onPick={(iso) => {
            onChange(iso)
            setOpen(false)
            trigger.current?.focus()
          }}
          onClear={() => {
            onChange('')
            setOpen(false)
            trigger.current?.focus()
          }}
        />
      </Popover>
    </div>
  )
}

/* ---------- Lista desplegable (hora, personas) ---------- */

export type FieldOption = { value: string; label: string; group?: string }

function ListPanel({
  labelId,
  options,
  value,
  onPick,
}: {
  labelId: string
  options: FieldOption[]
  value: string
  onPick: (value: string) => void
}) {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>('[role="option"]')
    const target = Array.from(items ?? []).find((el) => el.dataset.value === value) ?? items?.[0]
    target?.focus()
    target?.scrollIntoView({ block: 'nearest' })
  }, [value])

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const move = (to: number) => {
      event.preventDefault()
      items[Math.min(items.length - 1, Math.max(0, to))]?.focus()
    }
    if (event.key === 'ArrowDown') move(index + 1)
    else if (event.key === 'ArrowUp') move(index - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(items.length - 1)
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (index >= 0) onPick(items[index].dataset.value ?? '')
    }
  }

  let lastGroup: string | undefined
  return (
    // data-lenis-prevent: la rueda del mouse desplaza la lista y no la página.
    <ul
      ref={list}
      role="listbox"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
      data-lenis-prevent
      className="max-h-64 overflow-y-auto overscroll-contain py-1 text-sm"
    >
      {options.map((option) => {
        const header = option.group && option.group !== lastGroup ? option.group : null
        lastGroup = option.group
        const selected = option.value === value
        return (
          <li key={option.value} role="presentation">
            {header && <p className="px-3 pb-1 pt-2 text-[11px] text-ink/50">{header}</p>}
            <div
              role="option"
              tabIndex={-1}
              aria-selected={selected}
              data-value={option.value}
              onClick={() => onPick(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 px-3 py-2 outline-none transition-colors hover:bg-ink/8 focus-visible:bg-ink/10',
                selected && 'font-bold',
              )}
            >
              {option.label}
              {selected && <Check className="size-4 text-primary" aria-hidden="true" />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function ListField({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon = 'chevron',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: FieldOption[]
  placeholder: string
  icon?: 'chevron' | 'clock'
}) {
  const labelId = useId()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const selected = options.find((option) => option.value === value)
  const Icon = icon === 'clock' ? Clock : ChevronDown

  return (
    <div>
      <span id={labelId} className={labelClass}>
        {label}
      </span>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        data-open={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={triggerClass}
      >
        <span className={cn(!selected && 'text-ink/45')}>{selected ? selected.label : placeholder}</span>
        <Icon className={cn('size-4 shrink-0 text-ink/60 transition-transform', open && icon === 'chevron' && 'rotate-180')} aria-hidden="true" />
      </button>
      <Popover open={open} anchor={trigger} onClose={close} label={label} role="presentation">
        <ListPanel
          labelId={labelId}
          options={options}
          value={value}
          onPick={(next) => {
            onChange(next)
            setOpen(false)
            trigger.current?.focus()
          }}
        />
      </Popover>
    </div>
  )
}

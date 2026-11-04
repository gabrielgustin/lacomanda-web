'use client'

import { useEffect, useRef, useState } from 'react'
import { BatteryFull, ExternalLink, Signal, Wifi, X } from 'lucide-react'
import { site } from '@/lib/site'
import { lockPageScroll } from '@/lib/gsap'

// Pantalla del iPhone 17 Pro Max: 440 × 956 pt. `BEZEL` es el marco metálico alrededor.
const SCREEN = { w: 440, h: 956 }
const BEZEL = 10
const STATUS_BAR = 46
const HOME_BAR = 22
const MARGIN = 12
const MIN_WIDTH = 320

// Elige el tamaño del celular para ocupar lo máximo posible de la ventana: en pantallas grandes se agranda,
// y si no entra se angosta (la carta se ve con su tamaño de letra real). Si ni así llega a 320 de ancho
// (celulares chicos) deja de respetar la proporción y llena la ventana.
function fit() {
  const availW = window.innerWidth - MARGIN * 2 - BEZEL * 2
  // En celular los botones de arriba tienen su propia franja.
  const availH = window.innerHeight - MARGIN * 2 - BEZEL * 2 - (window.innerWidth < 640 ? 48 : 0)
  const ratio = SCREEN.h / SCREEN.w
  const scale = Math.min(availW / SCREEN.w, availH / SCREEN.h)
  if (scale >= 1) return { w: SCREEN.w, h: SCREEN.h, scale: Math.min(scale, 1.5) }
  const w = Math.min(SCREEN.w, availW, availH / ratio)
  if (w >= MIN_WIDTH) return { w, h: w * ratio, scale: 1 }
  return { w: Math.min(SCREEN.w, availW), h: availH, scale: 1 }
}

// La carta digital dentro de un iPhone flotante. Los links marcados con `data-carta` lo abren (clic simple);
// con Ctrl/Cmd/Shift o clic del medio siguen abriendo la carta en una pestaña nueva.
export function CartaPhone() {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<ReturnType<typeof fit> | null>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[data-carta]')
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      setSize(fit())
      setOpen(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Abierto: Esc cierra, el foco queda adentro, la página de atrás no se mueve y el foco vuelve al link al cerrar.
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null
    closeButton.current?.focus()
    lockPageScroll(true)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const onFocus = (event: FocusEvent) => !overlay.current?.contains(event.target as Node) && closeButton.current?.focus()
    const onResize = () => setSize(fit())
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('orientationchange', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
      window.removeEventListener('resize', onResize)
      lockPageScroll(false)
      trigger?.focus()
    }
  }, [open])

  if (!open || !size) return null

  const radius = Math.min(size.w, size.h) * 0.14
  return (
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Carta digital"
      data-lenis-prevent
      onClick={(event) => event.target === event.currentTarget && setOpen(false)}
      className="carta-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 max-sm:pt-12 backdrop-blur-sm"
    >
      <div className="fixed right-3 top-3 z-10 flex gap-2 md:right-5 md:top-5">
        <a
          href={site.cartaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-foreground/10 px-4 text-xs font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/20"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="max-sm:sr-only">Abrir en otra pestaña</span>
        </a>
        <button
          ref={closeButton}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar la carta"
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary-foreground text-primary"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* El tamaño real del celular (en px) se escala entero con transform, así el contenido no se reacomoda. */}
      <div
        style={{ width: size.w + BEZEL * 2, height: size.h + BEZEL * 2, transform: `scale(${size.scale})` }}
        className="relative shrink-0"
      >
        {/* Botones laterales: acción y volumen a la izquierda, encendido a la derecha. */}
        {[
          ['left', '15%', '3%'],
          ['left', '22%', '6%'],
          ['left', '30%', '6%'],
          ['right', '27%', '10%'],
        ].map(([side, top, height]) => (
          <span
            key={`${side}${top}`}
            aria-hidden="true"
            style={{ top, height, [side]: -3 }}
            className="absolute w-[3px] rounded-sm bg-[#4a4a4d]"
          />
        ))}

        <div
          style={{ borderRadius: radius + BEZEL }}
          className="carta-phone absolute inset-0 bg-gradient-to-br from-[#5a5a5e] via-[#232326] to-[#4a4a4e] p-[10px] shadow-[0_30px_80px_-10px_rgb(0_0_0/0.65),inset_0_0_0_1.5px_rgb(255_255_255/0.18)]"
        >
          <div style={{ borderRadius: radius }} className="relative flex h-full w-full flex-col overflow-hidden bg-background">
            {/* Barra de estado con la isla dinámica. */}
            <div style={{ height: STATUS_BAR }} className="relative flex shrink-0 items-center justify-between px-7 text-foreground" aria-hidden="true">
              <span className="text-[15px] font-semibold tabular-nums">9:41</span>
              <span className="absolute left-1/2 top-[11px] h-[30px] w-[28%] -translate-x-1/2 rounded-full bg-black" />
              <span className="flex items-center gap-1.5">
                <Signal className="size-4" />
                <Wifi className="size-4" />
                <BatteryFull className="size-5" />
              </span>
            </div>

            <div className="relative min-h-0 flex-1">
              <iframe
                title="Carta digital de La Comanda"
                src={site.cartaUrl}
                className="absolute inset-0 size-full border-0 bg-background"
              />
            </div>

            {/* Barra de inicio. */}
            <div style={{ height: HOME_BAR }} className="relative shrink-0" aria-hidden="true">
              <span className="absolute bottom-2 left-1/2 h-[5px] w-[34%] -translate-x-1/2 rounded-full bg-foreground/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

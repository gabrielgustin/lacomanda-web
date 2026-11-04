'use client'

import { useEffect, useRef, useState } from 'react'
import { BatteryFull, ExternalLink, Signal, Wifi, X } from 'lucide-react'
import { site } from '@/lib/site'
import { lockPageScroll } from '@/lib/gsap'

// Pantalla del iPhone 17 Pro Max: 440 × 956 pt. Todo el aparato se dibuja en proporción al ancho de la pantalla:
// el cuerpo real mide 78 × 163,4 mm, así que el borde (marco metálico + vidrio negro) es ~3,2 % por lado.
const SCREEN = { w: 440, h: 956 }
const BEZEL = 14 / 440
const MARGIN = 12

// La pantalla siempre mide 440 × 956 (la carta se ve como en el iPhone real) y el aparato entero se escala
// para ocupar lo máximo posible de la ventana, sin deformarse.
function fit() {
  const availW = window.innerWidth - MARGIN * 2
  // En celular los botones de arriba tienen su propia franja.
  const availH = window.innerHeight - MARGIN * 2 - (window.innerWidth < 640 ? 48 : 0)
  const scale = Math.min(availW / (SCREEN.w * (1 + 2 * BEZEL)), availH / (SCREEN.h + 2 * BEZEL * SCREEN.w), 1.5)
  return { w: SCREEN.w, h: SCREEN.h, scale }
}

// Botones laterales del 17 Pro Max, en % del alto del cuerpo: acción y volumen a la izquierda;
// lateral y Control de Cámara a la derecha.
const buttons = [
  { side: 'left', top: 17.5, height: 4.5 },
  { side: 'left', top: 25.5, height: 7.5 },
  { side: 'left', top: 35, height: 7.5 },
  { side: 'right', top: 27, height: 11.5 },
  { side: 'right', top: 58, height: 6 },
] as const

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

  // `u`: 1 pt de la pantalla real. Marco metálico de 4 pt y vidrio negro de 10 pt alrededor de la pantalla.
  const u = size.w / SCREEN.w
  const metal = 4 * u
  const glass = 10 * u
  const radius = 55 * u
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
        style={{ width: size.w + 2 * (metal + glass), height: size.h + 2 * (metal + glass), transform: `scale(${size.scale})` }}
        className="relative shrink-0"
      >
        {buttons.map(({ side, top, height }) => (
          <span
            key={`${side}${top}`}
            aria-hidden="true"
            style={{ top: `${top}%`, height: `${height}%`, width: 3.5 * u, [side]: -2.5 * u, borderRadius: 2 * u }}
            className="absolute bg-gradient-to-b from-[#8d8d92] via-[#55555a] to-[#8d8d92]"
          />
        ))}

        {/* Cuerpo: marco de aluminio con brillo en los cantos, después el borde negro del vidrio y la pantalla. */}
        <div
          style={{ borderRadius: radius + glass + metal, padding: metal }}
          className="carta-phone absolute inset-0 bg-[linear-gradient(135deg,#9a9aa0_0%,#4a4a4f_18%,#2c2c30_50%,#4a4a4f_82%,#9a9aa0_100%)] shadow-[0_40px_90px_-20px_rgb(0_0_0/0.75),0_0_0_1px_rgb(0_0_0/0.5)]"
        >
          <div
            style={{ borderRadius: radius + glass, padding: glass }}
            className="size-full bg-[#050505] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]"
          >
            <div style={{ borderRadius: radius }} className="relative flex size-full flex-col overflow-hidden bg-background">
              {/* Barra de estado: hora e íconos a los costados de la isla dinámica (126 × 37 pt, a 11 pt del borde). */}
              <div
                style={{ height: 54 * u, fontSize: 17 * u }}
                className="relative grid shrink-0 grid-cols-[1fr_auto_1fr] items-center font-semibold text-foreground"
                aria-hidden="true"
              >
                <span className="text-center tabular-nums tracking-tight">9:41</span>
                <span style={{ width: 126 * u, height: 37 * u, marginTop: -6 * u }} className="rounded-full bg-black" />
                <span style={{ gap: 6 * u }} className="flex items-center justify-center">
                  <Signal style={{ width: 17 * u, height: 17 * u }} strokeWidth={2.5} />
                  <Wifi style={{ width: 17 * u, height: 17 * u }} strokeWidth={2.5} />
                  <BatteryFull style={{ width: 26 * u, height: 26 * u }} strokeWidth={2} />
                </span>
              </div>

              <div className="relative min-h-0 flex-1">
                <iframe
                  title="Carta digital de La Comanda"
                  src={site.cartaUrl}
                  className="absolute inset-0 size-full border-0 bg-background"
                />
              </div>

              {/* Indicador de inicio: 140 × 5 pt, a 8 pt del borde. */}
              <div style={{ height: 24 * u }} className="relative shrink-0" aria-hidden="true">
                <span
                  style={{ width: 140 * u, height: 5 * u, bottom: 8 * u }}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

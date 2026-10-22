'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

// Píldora flotante en el celular para reservar, visible después del hero (como la barra de pedido de la carta).
export function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const reservas = document.getElementById('reservas')
      const pastHero = window.scrollY > window.innerHeight * 0.9
      const atReservas = reservas ? reservas.getBoundingClientRect().top < window.innerHeight : false
      setVisible(pastHero && !atReservas)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-4 z-40 flex justify-center px-5 transition-[opacity,translate] duration-300 md:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
    >
      <a
        href="#reservas"
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className="pill-sheen flex h-14 w-full max-w-md items-center justify-between rounded-full bg-primary pl-6 pr-2 text-primary-foreground shadow-[0_10px_30px_-8px_rgb(36_21_14/0.55)]"
      >
        <span className="flex items-center gap-3 text-sm font-semibold">
          <CalendarDays className="size-5" aria-hidden="true" /> Reservá tu mesa
        </span>
        <span className="font-display rounded-full bg-primary-foreground px-4 py-2.5 text-xs text-primary">Hoy</span>
      </a>
    </div>
  )
}

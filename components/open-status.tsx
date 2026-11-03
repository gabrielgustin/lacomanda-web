'use client'

import { useEffect, useState } from 'react'
import { openStatus } from '@/lib/hours'
import { cn } from '@/lib/utils'

// "Abierto ahora · hasta la 1:00". Se calcula en el navegador (el HTML estático no sabe la hora) y se
// refresca cada minuto; hasta entonces ocupa su lugar sin mostrarse, para que nada salte.
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null)

  useEffect(() => {
    const update = () => setStatus(openStatus())
    update()
    const timer = setInterval(update, 60_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className={cn('flex items-center gap-2', !status && 'invisible', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'size-2 shrink-0 rounded-full',
          status?.open ? 'bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.22)] motion-safe:animate-pulse' : 'bg-accent',
        )}
      />
      {status?.text ?? 'Horario'}
    </p>
  )
}

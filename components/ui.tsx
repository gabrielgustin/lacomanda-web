import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'cream' | 'outline' | 'outline-light'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-ink',
  cream: 'bg-primary-foreground text-primary hover:bg-card',
  outline: 'border border-primary/30 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground',
  'outline-light':
    'border border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary',
}

// Botón píldora como link (todo lo interactivo de la marca es píldora).
export function PillLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ComponentProps<'a'> & { variant?: Variant }) {
  return (
    <a
      className={cn(
        'pill-sheen inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

// Título que entra línea por línea (cada línea sube desde abajo de una máscara).
export function SplitTitle({
  lines,
  as: Tag = 'h2',
  className,
  id,
}: {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  return (
    <Tag id={id} className={cn('font-display', className)} data-split aria-label={lines.join(' ')}>
      {lines.map((line) => (
        // El relleno inferior deja pasar las colas de g, p, y de la minúscula.
        <span key={line} className="-mb-[0.1em] -mt-[0.18em] block overflow-hidden pb-[0.2em] pt-[0.18em]" aria-hidden="true">
          <span className="block" data-split-line>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}

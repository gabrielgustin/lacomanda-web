'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { BookOpen, Menu, ShoppingBag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks, site, whatsappLink } from '@/lib/site'

const orderText = '¡Hola La Comanda! Quiero hacer un pedido para delivery 🍕'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menú móvil: Esc cierra, el foco queda atrapado adentro y vuelve al botón al cerrar.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus()
    document.documentElement.classList.add('lenis-stopped')
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('lenis-stopped')
      toggleRef.current?.focus()
    }
  }, [open])

  const light = !scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-300',
        light ? 'border-b border-transparent text-primary-foreground' : 'border-b border-border bg-background text-foreground',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-5 md:h-20 md:px-8">
        <a href="#inicio" className="flex shrink-0 items-center gap-3 rounded-full" aria-label="La Comanda, ir al inicio">
          <Image src="/logo-la-comanda.svg" alt="" width={44} height={44} className="size-10 md:size-11" priority />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[13px] font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full opacity-80 transition-opacity duration-200 hover:opacity-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Selector central Salón / Delivery */}
        <div
          className={cn(
            'mx-auto hidden items-center rounded-full p-1 text-xs font-semibold md:flex',
            light ? 'bg-primary-foreground/15 backdrop-blur-sm' : 'bg-muted',
          )}
        >
          <a
            href="#reservas"
            className={cn(
              'rounded-full px-5 py-2 transition-colors',
              light ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground',
            )}
          >
            Salón
          </a>
          <a
            href={whatsappLink(orderText)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-5 py-2 opacity-80 transition-opacity hover:opacity-100"
          >
            Delivery
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={site.cartaUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'hidden h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors sm:inline-flex',
              light
                ? 'border-primary-foreground/40 hover:bg-primary-foreground hover:text-primary'
                : 'border-border hover:border-primary hover:text-primary',
            )}
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Carta
          </a>
          <a
            href={whatsappLink(orderText)}
            target="_blank"
            rel="noreferrer"
            className="pill-sheen inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary-foreground"
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            Pedí ahora
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-full border lg:hidden',
              light ? 'border-primary-foreground/40' : 'border-border',
            )}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="menu-movil"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="menu-movil"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-50 flex flex-col bg-primary text-primary-foreground lg:hidden"
          data-lenis-prevent
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Image src="/logo-la-comanda.svg" alt="" width={40} height={40} className="size-10" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/40"
              aria-label="Cerrar menú"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menú móvil" className="flex flex-1 flex-col justify-center px-5">
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="font-display block rounded-full text-4xl">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-3 px-5 pb-8">
            <a
              href={site.cartaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-primary-foreground/40 text-sm font-semibold"
            >
              <BookOpen className="size-4" aria-hidden="true" /> Ver la carta
            </a>
            <a
              href="#reservas"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary-foreground text-sm font-semibold text-primary"
            >
              Reservá
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

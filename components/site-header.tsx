'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks, site } from '@/lib/site'
import { gsap, lockPageScroll, prefersReducedMotion } from '@/lib/gsap'

export function SiteHeader() {
  const [tone, setTone] = useState<'clear' | 'dark' | 'light'>('clear')
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  // `mounted` sigue en true mientras el menú se repliega, para poder animar el cierre antes de quitarlo.
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const timeline = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  const openMenu = () => {
    setOpen(true)
    if (timeline.current) timeline.current.timeScale(1).play()
    else setMounted(true)
  }
  const closeMenu = () => {
    setOpen(false)
    if (timeline.current) timeline.current.timeScale(1.8).reverse()
    else setMounted(false)
  }

  // Apertura: un círculo crece desde el botón de hamburguesa hasta llenar la pantalla y los links suben escalonados.
  // Se arma antes de pintar (layout effect) para que el menú no se vea completo ni un instante.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const toggle = toggleRef.current
    if (!mounted || !panel || !toggle || prefersReducedMotion()) return
    const box = toggle.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2
    const radius = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy))
    const q = gsap.utils.selector(panel)
    gsap.set(q('[data-menu-bg]'), { width: radius * 2, height: radius * 2, left: cx - radius, top: cy - radius, borderRadius: '50%', scale: 0 })
    const tl = gsap
      .timeline({ onReverseComplete: () => setMounted(false) })
      .to(q('[data-menu-bg]'), { scale: 1, duration: 0.7, ease: 'power3.inOut' })
      .fromTo(q('[data-menu-top]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3)
      .fromTo(q('[data-menu-item]'), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, 0.3)
      .fromTo(q('[data-menu-foot]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.6)
    timeline.current = tl
    return () => {
      tl.kill()
      timeline.current = null
    }
  }, [mounted])

  // Arriba de todo, transparente sobre la foto. Después toma el tono de lo que pasa por debajo:
  // oscuro sobre las secciones marcadas con data-tone="dark", crema sobre las claras.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      if (window.scrollY < window.innerHeight * 0.6) return setTone('clear')
      const edge = (headerRef.current?.offsetHeight ?? 64) - 1
      // Comparar rectángulos es mucho más barato que `elementsFromPoint` en cada scroll. Manda el último bloque que
      // pasa por debajo: los de más abajo en la página tapan al hero, que en escritorio queda fijo (sticky) atrás.
      const below = blocks.findLast((el) => {
        const { top, bottom } = el.getBoundingClientRect()
        return top <= edge && bottom > edge
      })
      setTone(below?.matches('[data-tone="dark"], :has(> [data-tone="dark"])') ? 'dark' : 'light')
    }
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('main > *, footer'))
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Menú móvil: Esc cierra, el foco queda atrapado adentro y vuelve al botón al cerrar.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus()
    lockPageScroll(true)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
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
      lockPageScroll(false)
      toggleRef.current?.focus()
    }
  }, [open])

  // `light`: texto y logo claros (sobre la foto o sobre secciones oscuras).
  const light = tone !== 'light'

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-300',
        tone === 'clear' && 'border-transparent text-primary-foreground',
        tone === 'dark' && 'border-primary-foreground/10 bg-ink/95 text-primary-foreground',
        tone === 'light' && 'border-border bg-background text-foreground',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-5 md:h-20 md:px-8">
        {/* Sobre fondo oscuro va el sello blanco; con el header crema, solo las letras, sin fondo. */}
        <a href="#inicio" className="relative block size-10 shrink-0 rounded-full md:size-11" aria-label="La Comanda, ir al inicio">
          <Image
            src="/logo-la-comanda.svg"
            alt=""
            width={44}
            height={44}
            className={cn('absolute inset-0 size-full transition-opacity duration-300', !light && 'opacity-0')}
            priority
          />
          <Image
            src="/logo-la-comanda-sin-fondo.svg"
            alt=""
            width={44}
            height={44}
            className={cn('absolute inset-0 size-full transition-opacity duration-300', light && 'opacity-0')}
          />
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

        <div className="ml-auto flex items-center gap-2">
          <a
            href={site.cartaUrl}
            data-carta
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
          <button
            ref={toggleRef}
            type="button"
            onClick={openMenu}
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

      {mounted && (
        <div
          id="menu-movil"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-50 overflow-hidden text-primary-foreground lg:hidden"
          data-lenis-prevent
        >
          {/* Fondo: con animación es un círculo que crece desde el botón; sin animación queda a pantalla completa. */}
          <div data-menu-bg aria-hidden="true" className="absolute inset-0 bg-primary will-change-transform" />
          <div className="relative flex h-full flex-col">
            <div data-menu-top className="flex h-16 items-center justify-between px-5">
              <Image src="/logo-la-comanda.svg" alt="" width={40} height={40} className="size-10" />
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/40"
                aria-label="Cerrar menú"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Menú móvil" className="flex flex-1 flex-col justify-center px-5">
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href} data-menu-item>
                    <a href={link.href} onClick={closeMenu} className="font-display block rounded-full text-4xl">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-menu-foot className="flex gap-3 px-5 pb-8">
              <a
                href={site.cartaUrl}
                data-carta
                onClick={closeMenu}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-primary-foreground/40 text-sm font-semibold"
              >
                <BookOpen className="size-4" aria-hidden="true" /> Ver la carta
              </a>
              <a
                href="#reservas"
                onClick={closeMenu}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary-foreground text-sm font-semibold text-primary"
              >
                Reservá
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

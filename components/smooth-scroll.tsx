'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// Scroll suave con Lenis, sincronizado con ScrollTrigger. Con movimiento reducido no se activa.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Los links internos (#seccion) también se desplazan con Lenis.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const target = document.querySelector(link.getAttribute('href')!)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: 0 })
      history.replaceState(null, '', link.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}

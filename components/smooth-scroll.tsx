'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// Scroll suave con Lenis, sincronizado con ScrollTrigger. Con movimiento reducido no se activa.
export function SmoothScroll() {
  // La web siempre abre arriba, en «Lo bueno se comparte»: el navegador no restaura la posición al entrar o refrescar
  // (con las secciones fijas la restauración caía en un lugar cualquiera). Un link con #seccion sí se respeta.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const toTop = () => !location.hash && window.scrollTo(0, 0)
    toTop()
    const onShow = (event: PageTransitionEvent) => event.persisted && toTop()
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // En celulares y tablets va el scroll nativo, que es el más fluido (normalizeScroll lo emulaba en el hilo
    // principal y se sentía trabado). Los links internos (#seccion) se desplazan con el scroll suave del navegador.
    if (window.matchMedia('(pointer: coarse)').matches) {
      const onTouchLink = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
        const target = link && document.querySelector(link.getAttribute('href')!)
        if (!link || !target) return
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(null, '', link.getAttribute('href'))
      }
      document.addEventListener('click', onTouchLink)
      return () => document.removeEventListener('click', onTouchLink)
    }

    // Valores por defecto de Lenis (lerp 0.1): sigue a la rueda sin la cola larga que se sentía como retraso.
    const lenis = new Lenis()
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

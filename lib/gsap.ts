'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// En el celular la barra del navegador se esconde y se muestra al scrollear y cambia el alto de la ventana;
// sin esto cada cambio recalcula los tramos fijos y la escena puede saltar.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }

// Tiras horizontales movidas por el scroll (celular): px de scroll que cuesta cada px que avanza la tira, y la pausa
// final (como fracción del tramo) con la última tarjeta ya a la vista. Un tramo corto se pasa de largo con un deslizón.
export const STRIP_PACE = 2.2
export const STRIP_HOLD = 0.12

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// En pantallas táctiles el scroll nativo corre en otro hilo que las animaciones y las secciones fijas saltan al
// engancharse y soltarse. normalizeScroll mueve la página en el mismo hilo que GSAP (y no esconde la barra del navegador).
export const touchScroll = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches && !prefersReducedMotion()

// Menú y carta abiertos: la página de atrás queda quieta (con Lenis y con el scroll normalizado del celular).
export function lockPageScroll(locked: boolean) {
  document.documentElement.classList.toggle('lenis-stopped', locked)
  if (touchScroll()) ScrollTrigger.normalizeScroll(!locked)
}

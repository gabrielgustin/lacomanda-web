'use client'

import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

// Efectos globales: títulos que suben línea por línea y bloques [data-reveal] que aparecen al entrar.
export function ScrollEffects() {
  useGSAP(() => {
    if (prefersReducedMotion()) return

    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((title) => {
      gsap.from(title.querySelectorAll('[data-split-line]'), {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: { trigger: title, start: 'top 88%', once: true },
      })
    })

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true },
        ),
    })

    // Marcos que se abren: solo en tablet y escritorio. En celular las fotos grandes no están (o están
    // dentro de tiras fijas) y animar elementos ocultos en cada scroll sólo suma trabajo.
    const wide = gsap.matchMedia()
    wide.add('(min-width: 768px)', () => {
    // Marcos de foto que se abren de abajo hacia arriba.
    gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((frame) => {
      gsap.fromTo(
        frame,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.3,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
        },
      )
    })
    })
  })

  return null
}

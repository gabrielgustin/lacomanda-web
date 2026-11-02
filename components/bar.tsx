'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, prefersReducedMotion, STRIP_PACE, STRIP_HOLD } from '@/lib/gsap'
import { PillLink, SplitTitle } from '@/components/ui'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

// `focus` encuadra la foto cuando el recorte es más ancho que alto.
const photos = [
  { src: '/fotos/cervezas.webp', alt: 'Chopp de cerveza rubia junto a una botella', focus: 'object-center' },
  { src: '/fotos/bebidas.webp', alt: 'Mojito y gin tonic con frutos rojos', focus: 'object-center' },
  // Foto de Gian Tripodoro en Pexels (licencia libre de Pexels). El vaso está en la parte alta de la foto.
  { src: '/fotos/barra-fernet.webp', alt: 'Vaso de fernet con coca y hielo sobre la barra', focus: 'object-[50%_30%]' },
]

const Title = ({ id, className }: { id: string; className: string }) => (
  <SplitTitle id={id} lines={['Bien fría,', 'como tiene', 'que ser']} className={className} />
)

const copy = 'Chopp tirado, litros para la mesa y tragos de siempre bien hechos. Para brindar por algo o por nada.'

// Celular: la sección se queda fija y el scroll vertical desplaza las fotos en sentido contrario al de Platos
// (la tira arranca al final y entra desde la izquierda); al terminar, la página sigue hacia abajo.
// Tablet y escritorio: columna de texto fija y fotos a sangre que pasan mientras scrolleás.
export function Bar() {
  const root = useRef<HTMLElement>(null)
  const mobile = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(max-width: 767px) and (min-height: 520px)', () => {
        const wrap = strip.current!
        const ul = track.current!
        // Con movimiento reducido queda la tira con scroll propio, ya posicionada al final.
        if (prefersReducedMotion()) {
          wrap.scrollLeft = wrap.scrollWidth
          return
        }
        gsap.set(wrap, { overflowX: 'hidden' })
        const distance = () => Math.max(0, ul.scrollWidth - wrap.clientWidth)
        gsap
          .timeline({
            scrollTrigger: {
              trigger: mobile.current,
              start: 'top top',
              end: () => `+=${Math.round(distance() * STRIP_PACE * (1 + STRIP_HOLD))}`,
              pin: true,
              anticipatePin: 1,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(ul, { x: () => -distance() }, { x: 0, ease: 'none', duration: 1 })
          .to({}, { duration: STRIP_HOLD })
      })
    },
    { scope: root },
  )

  // En celular el orden es el inverso: lo primero que se ve es lo último de la tira (las cervezas).
  const reversed = [...photos].reverse()

  return (
    <section ref={root} id="barra" aria-label="La barra" className="relative z-10 bg-background">
      {/* Celular: bloque a pantalla completa que se ancla mientras la tira avanza. En pantallas muy bajas (apaisado) no se ancla
          y las fotos quedan con scroll propio. */}
      <div ref={mobile} className="flex h-svh flex-col overflow-hidden pb-6 pt-20 md:hidden [@media(max-height:519px)]:h-auto">
        <div className="px-5">
          <SplitTitle
            id="barra-title-movil"
            lines={['Bien fría,', 'como tiene que ser']}
            className="text-[clamp(1.8rem,8vw,2.6rem)] text-primary"
          />
          {/* Con poco alto se oculta el texto para que las fotos conserven su tamaño. */}
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty [@media(max-height:679px)]:hidden">
            {copy}
          </p>
        </div>

        <div ref={strip} className="scrollbar-hide mt-5 min-h-[15rem] flex-1 overflow-x-auto overscroll-x-contain">
          <ul ref={track} className="flex h-full w-max gap-3 px-5">
            {reversed.map((photo) => (
              <li key={photo.src} className="relative h-full min-h-[15rem] w-[72vw] max-w-[19rem] shrink-0 overflow-hidden bg-ink">
                <Image src={photo.src} alt={photo.alt} fill sizes="75vw" className={cn('object-cover', photo.focus)} />
              </li>
            ))}
          </ul>
        </div>

        <PillLink href={site.cartaUrl} target="_blank" rel="noreferrer" className="mx-5 mt-5 w-fit">
          Ver todas las bebidas <ArrowUpRight className="size-4" aria-hidden="true" />
        </PillLink>
      </div>

      {/* Tablet y escritorio */}
      <div className="hidden md:grid lg:grid-cols-2">
        <div className="px-8 py-28 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:self-start lg:py-0 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-12">
          <Title id="barra-title" className="text-[clamp(2.8rem,6.4vw,5.5rem)] text-primary" />
          <p data-reveal className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            {copy}
          </p>
          <PillLink data-reveal href={site.cartaUrl} target="_blank" rel="noreferrer" className="mt-8 w-fit">
            Ver todas las bebidas <ArrowUpRight className="size-4" aria-hidden="true" />
          </PillLink>
        </div>

        <div>
          {photos.map((photo) => (
            <div key={photo.src} data-clip className="relative h-[75svh] overflow-hidden bg-ink lg:h-svh">
              <Image
                data-parallax="10"
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className={cn('scale-115 object-cover', photo.focus)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

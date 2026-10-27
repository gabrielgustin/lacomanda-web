import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Signature } from '@/components/signature'
import { Events } from '@/components/events'
import { Bar } from '@/components/bar'
import { Promos } from '@/components/promos'
import { Reviews } from '@/components/reviews'
import { getGooglePlace } from '@/lib/google-reviews'
import { Story } from '@/components/story'
import { Reservations } from '@/components/reservations'
import { SiteFooter } from '@/components/site-footer'
import { MobileCta } from '@/components/mobile-cta'
import { ScrollEffects } from '@/components/scroll-effects'

export default async function Home() {
  const place = await getGooglePlace()

  return (
    <>
      <a
        href="#nosotros"
        className="sr-only z-[60] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Signature />
        <Events />
        <Bar />
        <Promos />
        <Reviews place={place} />
        <Story />
        <Reservations />
      </main>
      <SiteFooter />
      <MobileCta />
      <ScrollEffects />
    </>
  )
}

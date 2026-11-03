import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Signature } from '@/components/signature'
import { Events } from '@/components/events'
import { Promos } from '@/components/promos'
import { Reviews } from '@/components/reviews'
import { getGooglePlace } from '@/lib/google-reviews'
import { Story } from '@/components/story'
import { Reservations } from '@/components/reservations'
import { SiteFooter } from '@/components/site-footer'
import { MobileCta } from '@/components/mobile-cta'
import { CartaPhone } from '@/components/carta-phone'
import { ScrollEffects } from '@/components/scroll-effects'
import { site } from '@/lib/site'
import { weeklyHours } from '@/lib/hours'

const schemaDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Ficha del local para buscadores (schema.org): dirección, mapa, horarios, carta y reservas.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'La Comanda Tejeda',
  url: site.url,
  image: `${site.url}/og-fachada.jpg`,
  telephone: site.phone,
  priceRange: '$$',
  servesCuisine: ['Argentina', 'Hamburguesas', 'Pizzas'],
  menu: site.cartaUrl,
  acceptsReservations: true,
  hasMap: site.mapsUrl,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    addressLocality: 'Córdoba',
    addressRegion: 'Córdoba',
    addressCountry: 'AR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: weeklyHours.map(([opens, closes], day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: schemaDays[day],
    opens,
    closes,
  })),
}

export default async function Home() {
  const place = await getGooglePlace()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <Promos />
        <Reviews place={place} />
        <Story />
        <Reservations />
      </main>
      <SiteFooter />
      <MobileCta />
      <CartaPhone />
      <ScrollEffects />
    </>
  )
}

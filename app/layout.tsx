import { Bevan, Courier_Prime, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { SmoothScroll } from '@/components/smooth-scroll'
import './globals.css'

const bevan = Bevan({ subsets: ['latin'], weight: '400', variable: '--font-bevan' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const courier = Courier_Prime({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-courier' })

const title = 'La Comanda | Bodegón, burgers, pizzas y cerveza bien fría'
const description =
  'La Comanda: cocina para compartir, cerveza bien fría y mesas largas. Reservá tu mesa, pedí por WhatsApp o mirá la carta.'

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: [{ url: '/logo-la-comanda.svg', type: 'image/svg+xml' }],
    apple: '/logo-la-comanda.svg',
  },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'es_AR',
    siteName: 'La Comanda',
    images: [{ url: '/fotos/pizzas.webp', width: 1024, height: 1024, alt: 'Pizza en una mesa de La Comanda' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#43281c',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${bevan.variable} ${dmSans.variable} ${courier.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que hay JS antes de pintar, así los elementos animados arrancan ocultos sin parpadeo. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}

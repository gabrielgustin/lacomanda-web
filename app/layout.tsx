import { Bevan, Courier_Prime, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { SmoothScroll } from '@/components/smooth-scroll'
import { site } from '@/lib/site'
import './globals.css'

const bevan = Bevan({ subsets: ['latin'], weight: '400', variable: '--font-bevan' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const courier = Courier_Prime({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-courier' })

const title = 'La Comanda | Bodegón en el Cerro de las Rosas, Córdoba'
const description =
  'Burgers, pizzas, milanesas y chopp bien frío en Luis José de Tejeda 4320. Abierto todos los días: reservá tu mesa por WhatsApp.'
// Vista previa al compartir el link (WhatsApp, Instagram, Facebook): el cartel de neón del salón con el logo.
const image = { url: '/og.jpg', width: 1200, height: 630, alt: 'Cartel de neón de La Comanda: «Lo bueno se comparte»' }

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  icons: {
    icon: [{ url: '/logo-la-comanda.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'es_AR',
    siteName: 'La Comanda',
    images: [image],
  },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
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

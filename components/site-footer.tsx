import Image from 'next/image'
import { AtSign, Mail, MessageCircle } from 'lucide-react'
import { navLinks, site, whatsappLink } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer id="contacto" className="relative z-10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[90rem] px-5 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-10 border-b border-primary-foreground/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="eyebrow mb-4 text-accent">Dónde estamos</h2>
            <p className="text-sm">{site.address}</p>
            <p className="text-sm text-primary-foreground/70">{site.addressDetail}</p>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full text-sm font-semibold underline underline-offset-4">
              Ver en Google Maps
            </a>
          </div>
          <div>
            <h2 className="eyebrow mb-4 text-accent">Horarios</h2>
            <dl className="space-y-1 text-sm">
              {site.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4">
                  <dt>{row.days}</dt>
                  <dd className="text-primary-foreground/70">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="eyebrow mb-4 text-accent">Contacto</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={whatsappLink('¡Hola La Comanda!')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full hover:text-accent">
                  <MessageCircle className="size-4" aria-hidden="true" /> {site.phoneLabel}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full hover:text-accent">
                  <AtSign className="size-4" aria-hidden="true" /> {site.instagramHandle}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full hover:text-accent">
                  <Mail className="size-4" aria-hidden="true" /> {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-4 text-accent">Navegá</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="rounded-full text-primary-foreground/80 hover:text-primary-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.cartaUrl} target="_blank" rel="noreferrer" className="rounded-full text-primary-foreground/80 hover:text-primary-foreground">
                  Carta digital
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 py-12">
          <Image src="/logo-la-comanda.svg" alt="La Comanda" width={96} height={96} className="size-20 md:size-24" />
          <p aria-hidden="true" className="font-display w-full select-none text-center text-[clamp(3rem,15vw,13rem)] leading-none text-primary-foreground/10">
            La Comanda
          </p>
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} {site.name}. Lo bueno se comparte.
          </p>
        </div>
      </div>
    </footer>
  )
}

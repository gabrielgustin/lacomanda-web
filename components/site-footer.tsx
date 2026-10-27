import Image from 'next/image'
import { navLinks, site, whatsappLink } from '@/lib/site'

const heading = 'mb-5 text-xs font-normal tracking-[0.04em] text-accent'
const link = 'rounded-sm text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground'

// Pie liviano: una línea de marca arriba, cuatro columnas de datos con filetes finos y una línea de cierre.
export function SiteFooter() {
  return (
    <footer id="contacto" className="relative z-10 bg-ink text-primary-foreground">
      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="flex items-center justify-between gap-6 border-b border-primary-foreground/10 py-10 md:py-12">
          <Image src="/logo-la-comanda.svg" alt="La Comanda" width={64} height={64} className="size-14 md:size-16" />
          <p className="font-display text-xl text-primary-foreground/90 md:text-2xl">Lo bueno se comparte</p>
        </div>

        <div className="grid gap-12 py-12 text-[13px] leading-relaxed sm:grid-cols-2 md:py-14 lg:grid-cols-[1fr_1.4fr_1fr_1fr] lg:gap-10">
          <div>
            <h2 className={heading}>Dónde estamos</h2>
            <p>{site.address}</p>
            <p className="text-primary-foreground/60">{site.addressDetail}</p>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" className={`${link} mt-4 inline-block underline decoration-primary-foreground/30 underline-offset-4`}>
              Ver en Google Maps
            </a>
          </div>

          <div>
            <h2 className={heading}>Horarios</h2>
            <dl>
              {site.hours.map((row) => (
                <div key={row.days} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-primary-foreground/10 py-2.5 first:pt-0 last:border-b-0">
                  <dt className="text-primary-foreground/60">{row.days}</dt>
                  <dd className="text-right tabular-nums">
                    {row.time.split(' · ').map((slot) => (
                      <span key={slot} className="block">
                        {slot}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className={heading}>Contacto</h2>
            <ul className="space-y-2.5">
              <li>
                <a href={whatsappLink('¡Hola La Comanda!')} target="_blank" rel="noreferrer" className={link}>
                  {site.phoneLabel}
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noreferrer" className={link}>
                  {site.instagramHandle}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={heading}>Navegá</h2>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.cartaUrl} target="_blank" rel="noreferrer" className={link}>
                  Carta digital
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-primary-foreground/10 py-6 text-xs text-primary-foreground/45">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}

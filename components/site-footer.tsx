import Image from 'next/image'
import { site, whatsappLink } from '@/lib/site'
import { hourRows } from '@/lib/hours'

const heading = 'mb-5 text-xs font-normal tracking-[0.04em] text-accent'
const link = 'rounded-sm text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground'

// Cierre: el cartel de neón del salón dice la frase de la marca; debajo, tres columnas de datos con filetes finos.
export function SiteFooter() {
  return (
    <footer id="contacto" data-tone="dark" className="relative z-10 bg-ink text-primary-foreground">
      {/* La foto es apaisada y el cartel ocupa casi todo su ancho: en celular la foto se muestra entera, con su
          proporción, arriba de la banda (abajo queda el logo); desde md cubre la banda, quieta y sin zoom. */}
      <div className="relative h-[min(105vw,80svh)] overflow-hidden md:h-[85svh]">
        <div className="absolute inset-x-0 top-0 aspect-[1532/1027] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_78%,transparent)] md:inset-y-0 md:aspect-auto md:[mask-image:none]">
          <Image
            src="/fotos/cartel-neon-madera.webp"
            alt="Cartel de neón «Lo bueno se comparte» sobre la pared de madera de La Comanda, con las canillas de chopp arriba"
            fill
            sizes="100vw"
            className="object-cover object-[50%_55%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <Image
          src="/logo-la-comanda.svg"
          alt="La Comanda"
          width={96}
          height={96}
          className="absolute bottom-10 left-1/2 size-20 -translate-x-1/2 md:bottom-14 md:size-24"
        />
      </div>

      <div className="mx-auto max-w-[90rem] px-5 md:px-8">
        <div className="grid gap-12 border-t border-primary-foreground/10 py-12 text-[13px] leading-relaxed sm:grid-cols-2 md:py-14 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-10">
          <div>
            <h2 className={heading}>Dónde estamos</h2>
            <p>{site.address}</p>
            <p className="text-primary-foreground/60">{site.addressDetail}</p>
            <a href={site.directionsUrl} target="_blank" rel="noreferrer" className={`${link} mt-4 inline-block underline decoration-primary-foreground/30 underline-offset-4`}>
              Cómo llegar
            </a>
          </div>

          <div>
            <h2 className={heading}>Horarios</h2>
            <dl>
              {hourRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-primary-foreground/10 py-2.5 first:pt-0 last:border-b-0">
                  <dt className="text-primary-foreground/60">{row.label}</dt>
                  <dd className="text-right tabular-nums">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className={heading}>Contacto</h2>
            <ul className="space-y-2.5">
              <li>
                <span className="text-primary-foreground/60">WhatsApp </span>
                <a href={whatsappLink('¡Hola La Comanda!')} target="_blank" rel="noreferrer" className={link}>
                  {site.whatsappLabel}
                </a>
              </li>
              <li>
                <span className="text-primary-foreground/60">Teléfono </span>
                <a href={`tel:${site.phone}`} className={link}>
                  {site.phoneLabel}
                </a>
              </li>
              <li>
                <a href={site.cartaUrl} target="_blank" rel="noreferrer" className={link}>
                  Carta digital
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-primary-foreground/10 py-6 text-xs text-primary-foreground/45">
          © {new Date().getFullYear()} {site.name} · {site.addressDetail}
        </p>
      </div>
    </footer>
  )
}

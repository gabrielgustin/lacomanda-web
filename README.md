# La Comanda · Sitio web

Sitio web de La Comanda, con la misma identidad visual que la carta digital ([Lacomanda-cartadigital](https://github.com/gabrielgustin/Lacomanda-cartadigital)).

**Stack:** Next.js 16 (App Router), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis y lucide-react.

## Correrlo en tu compu

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

## Dónde se cambia cada cosa

- **Colores y tipografías:** `app/globals.css`, en las variables de `:root`.
- **Datos del negocio** (dirección, horarios, WhatsApp, redes, nota de Google): `lib/site.ts`. Todo lo que dice `TODO` es provisorio.
- **Platos y precios:** `lib/menu-data.ts`, copiado de la carta digital.
- **Reseñas:** `components/reviews.tsx`. Hoy tiene textos de ejemplo que hay que reemplazar por reseñas reales.
- **Fotos:** `public/fotos/`.

## Secciones

Hero → Nosotros → Platos de la casa → Eventos y grupos → La barra → Gift card → Reseñas → Historia → Reservas (por WhatsApp) → Footer.

Si el usuario tiene activado "reducir movimiento", las animaciones de scroll se desactivan.

// Datos del negocio. Todo lo marcado con TODO es provisorio: reemplazar por los datos reales.
export const site = {
  name: 'La Comanda',
  city: 'Argentina', // TODO: ciudad real
  since: '2018', // TODO: año de apertura
  cartaUrl: 'https://lacomanda-xi.vercel.app',
  whatsapp: '5493512681910', // formato internacional sin "+" (54 9 + código de área + número)
  phoneLabel: 'Número a confirmar', // TODO
  instagram: 'https://instagram.com/lacomanda', // TODO
  instagramHandle: '@lacomanda', // TODO
  email: 'hola@lacomanda.com.ar', // TODO
  address: 'Luis José de Tejeda 4320', // según la ficha de Google Maps
  addressDetail: 'Cerro de las Rosas, Córdoba',
  // Ficha de "La Comanda Tejeda" en Google Maps (abre el local con su mapa y sus opiniones).
  mapsUrl: 'https://www.google.com/maps?cid=13604217121055167239',
  // TODO: nota y cantidad de reseñas reales de Google, p. ej. { score: '4.8', reviews: '1.200' }.
  // Mientras sea null, la tarjeta de Google del hero no se muestra.
  rating: null as { score: string; reviews: string } | null,
  // Misma ficha: desde ahí se ven todas las reseñas y se escribe una ("Escribir una opinión").
  reviewUrl: 'https://www.google.com/maps?cid=13604217121055167239',
  hours: [
    // TODO: horarios reales
    { days: 'Lunes', time: 'Cerrado' },
    { days: 'Martes a jueves', time: '19:30 – 00:30' },
    { days: 'Viernes y sábado', time: '19:30 – 02:00' },
    { days: 'Domingo', time: '12:00 – 16:00 · 19:30 – 00:30' },
  ],
}

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`

export const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#platos', label: 'Platos' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#contacto', label: 'Contacto' },
]

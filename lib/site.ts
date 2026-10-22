// Datos del negocio. Todo lo marcado con TODO es provisorio: reemplazar por los datos reales.
export const site = {
  name: 'La Comanda',
  city: 'Argentina', // TODO: ciudad real
  since: '2018', // TODO: año de apertura
  cartaUrl: 'https://lacomanda-xi.vercel.app',
  whatsapp: '5490000000000', // TODO: número real, formato internacional sin "+"
  phoneLabel: 'Número a confirmar', // TODO
  instagram: 'https://instagram.com/lacomanda', // TODO
  instagramHandle: '@lacomanda', // TODO
  email: 'hola@lacomanda.com.ar', // TODO
  address: 'Dirección a confirmar', // TODO
  addressDetail: 'Ciudad, provincia', // TODO
  mapsUrl: 'https://maps.google.com/?q=La+Comanda', // TODO: link real de Google Maps
  // TODO: nota y cantidad de reseñas reales de Google, p. ej. { score: '4.8', reviews: '1.200' }.
  // Mientras sea null, la tarjeta de Google del hero no se muestra.
  rating: null as { score: string; reviews: string } | null,
  reviewUrl: 'https://search.google.com/local/writereview', // TODO: link real para dejar reseña
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
  { href: '#barra', label: 'Barra' },
  { href: '#contacto', label: 'Contacto' },
]

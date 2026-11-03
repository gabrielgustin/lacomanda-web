// Datos del negocio. Dirección, teléfono y horarios salen de la ficha de Google Maps; el WhatsApp lo pasó el cliente.
// Los horarios viven en lib/hours.ts.
export const site = {
  name: 'La Comanda',
  url: 'https://web-lacomanda.vercel.app',
  cartaUrl: 'https://lacomanda-xi.vercel.app',
  whatsapp: '5493512681910', // formato internacional sin "+" (54 9 + código de área + número)
  whatsappLabel: '351 268-1910',
  phone: '+5493512540808', // el "15" de la ficha es celular: +54 9 351 254-0808
  phoneLabel: '0351 15-254-0808',
  address: 'Luis José de Tejeda 4320',
  addressDetail: 'Cerro de las Rosas, Córdoba',
  geo: { lat: -31.3691723, lng: -64.2348894 },
  // Ficha de "La Comanda Tejeda" en Google Maps (abre el local con su mapa y sus opiniones).
  mapsUrl: 'https://www.google.com/maps?cid=13604217121055167239',
  // Misma ficha: desde ahí se ven todas las reseñas y se escribe una ("Escribir una opinión").
  reviewUrl: 'https://www.google.com/maps?cid=13604217121055167239',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=La+Comanda+Tejeda%2C+Luis+Jos%C3%A9+de+Tejeda+4320%2C+C%C3%B3rdoba',
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

// Horarios de la ficha de Google Maps de La Comanda Tejeda (noviembre 2026).
// Índice 0 = domingo, como Date#getDay. Un cierre menor que la apertura cae pasada la medianoche.
export const weeklyHours: [open: string, close: string][] = [
  ['09:00', '01:00'], // domingo
  ['08:00', '16:00'], // lunes
  ['08:00', '01:00'], // martes
  ['08:00', '01:00'], // miércoles
  ['08:00', '01:00'], // jueves
  ['08:00', '01:30'], // viernes
  ['08:00', '01:30'], // sábado
]

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
// '08:00' → '8:00', para leer como se dice.
export const shortTime = (time: string) => time.replace(/^0/, '')
// "a la 1:00", "a las 16:00".
const article = (time: string) => (time.startsWith('01:') ? 'la' : 'las')

// Filas para mostrar, de lunes a domingo, juntando días seguidos con el mismo horario
// ("Martes a jueves", "Viernes y sábado").
export const hourRows = [1, 2, 3, 4, 5, 6, 0].reduce<{ days: number[]; label: string; time: string }[]>((rows, day) => {
  const time = weeklyHours[day].map(shortTime).join(' – ')
  const last = rows.at(-1)
  if (last && last.time === time) last.days.push(day)
  else rows.push({ days: [day], label: '', time })
  return rows
}, [])
for (const row of hourRows) {
  const [first, ...rest] = row.days.map((day) => dayNames[day])
  const last = rest.at(-1)?.toLowerCase()
  row.label = !last ? first : rest.length === 1 ? `${first} y ${last}` : `${first} a ${last}`
}

// Día y minuto actuales en Córdoba, sin importar la zona horaria del visitante.
export function cordobaNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Cordoba',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  )
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)
  return { day, minutes: Number(parts.hour) * 60 + Number(parts.minute) }
}

// Estado del local en este momento, listo para mostrar.
export function openStatus(date = new Date()) {
  const { day, minutes } = cordobaNow(date)
  // El turno de ayer puede seguir abierto pasada la medianoche.
  const [prevOpen, prevClose] = weeklyHours[(day + 6) % 7]
  if (toMinutes(prevClose) < toMinutes(prevOpen) && minutes < toMinutes(prevClose)) {
    return { open: true, text: `Abierto ahora · hasta ${article(prevClose)} ${shortTime(prevClose)}` }
  }
  const [open, close] = weeklyHours[day]
  const overnight = toMinutes(close) < toMinutes(open)
  if (minutes >= toMinutes(open) && (overnight || minutes < toMinutes(close))) {
    return { open: true, text: `Abierto ahora · hasta ${article(close)} ${shortTime(close)}` }
  }
  const later = minutes < toMinutes(open)
  const opensAt = later ? open : weeklyHours[(day + 1) % 7][0]
  return { open: false, text: `Cerrado · abrimos ${later ? 'hoy' : 'mañana'} a ${article(opensAt)} ${shortTime(opensAt)}` }
}

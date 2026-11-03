import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'

// Pedido de ejemplo que se imprime en el ticket (precios de la carta).
const order = [
  { id: 'entradas-papas-jodidas', qty: 1 },
  { id: 'pizzas-la-comanda', qty: 1 },
  { id: 'burgers-de-costillas', qty: 2 },
  { id: 'cervezas-chopp-stella', qty: 4 },
]
  .filter((line) => itemsById[line.id])
  .map((line) => ({ ...line, item: itemsById[line.id] }))
const orderTotal = order.reduce((sum, line) => sum + line.item.price * line.qty, 0)

// El ticket es decorativo. `data-ticket` y `data-stamp` son los ganchos de la animación que lo imprime y lo sella.
export function OrderTicket() {
  return (
    <div aria-hidden="true" className="ticket-shadow w-full max-w-[20rem]">
      <div data-ticket className="ticket px-5 pt-6 text-[13px] leading-snug">
        <p className="font-display text-center text-2xl">La Comanda</p>
        <p className="mt-1 flex justify-between font-bold">
          <span>Mesa 12</span>
          <span>6 personas</span>
        </p>
        <div className="ticket-rule my-3" />
        <ul className="space-y-1.5">
          {order.map((line) => (
            <li key={line.id} className="flex gap-2">
              <span className="w-4 shrink-0">{line.qty}</span>
              <span className="flex-1 uppercase">{line.item.name}</span>
              <span className="tabular-nums">{formatPrice(line.item.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="ticket-rule my-3" />
        <p className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(orderTotal)}</span>
        </p>
        <p className="mt-3 text-center text-xs">Para compartir entre todos</p>
        <div className="mt-3 flex justify-center">
          <span data-stamp className="stamp inline-block -rotate-6 text-lg">
            Se comparte
          </span>
        </div>
      </div>
    </div>
  )
}

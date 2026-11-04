import { itemsById } from '@/lib/menu-data'
import { formatPrice } from '@/lib/format'

// Pedido de ejemplo que se imprime en el ticket (precios de la carta). `name` pisa el de la web: en la comanda va el nombre de la carta.
const order = [
  { id: 'entradas-papas-jodidas', qty: 1, name: 'Papas jodidas' },
  { id: 'burgers-de-costillas', qty: 2, name: undefined },
  { id: 'cervezas-chopp-stella', qty: 2, name: undefined },
]
  .filter((line) => itemsById[line.id])
  .map((line) => ({ ...line, item: itemsById[line.id] }))
const orderTotal = order.reduce((sum, line) => sum + line.item.price * line.qty, 0)

// El ticket es decorativo. Ganchos de la animación que lo imprime: `data-feed` (el papel que sale), `data-line`
// (cada renglón), `data-total` (el total, que se va sumando) y `data-stamp` (el sello).
export function OrderTicket() {
  return (
    <div aria-hidden="true" data-feed className="ticket-shadow w-full max-w-[20rem]">
      <div data-ticket className="ticket px-5 pt-6 text-[13px] leading-snug">
        <p className="font-display text-center text-2xl">La Comanda</p>
        <p data-line className="mt-1 flex justify-between font-bold">
          <span>Mesa 12</span>
          <span>6 personas</span>
        </p>
        <div className="ticket-rule my-3" />
        <ul className="space-y-1.5">
          {order.map((line) => (
            <li key={line.id} data-line className="flex gap-2">
              <span className="w-4 shrink-0">{line.qty}</span>
              <span className="flex-1 uppercase">{line.name ?? line.item.name}</span>
              <span className="tabular-nums">{formatPrice(line.item.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="ticket-rule my-3" />
        <p data-line className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span data-total={orderTotal} className="tabular-nums">
            {formatPrice(orderTotal)}
          </span>
        </p>
        <p data-line className="mt-3 text-center text-xs">
          Para compartir entre todos
        </p>
        <div className="mt-3 flex justify-center">
          <span data-stamp className="stamp inline-block -rotate-6 text-lg">
            Se comparte
          </span>
        </div>
      </div>
    </div>
  )
}

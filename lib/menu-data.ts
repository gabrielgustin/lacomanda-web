// Productos de la carta que muestra la web, con nombre, descripción y precio tal como figuran en la
// carta digital (https://lacomanda-xi.vercel.app). Si cambian en la carta, actualizarlos acá.
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
}

const items: MenuItem[] = [
  {
    id: 'burgers-de-costillas',
    name: 'De Costillas',
    description: 'Medallón de costilla 200 gr., cheddar x2, panceta, cebolla crispy, pepinillos y papas fritas',
    price: 19300,
  },
  {
    id: 'pizzas-la-comanda',
    name: 'La Comanda',
    description: 'Salsa de tomate, mozzarella, verdeo, panceta, pollo y champiñones',
    price: 30000,
  },
  {
    id: 'entradas-papas-jodidas',
    name: 'Papas jodidas',
    description: 'Papas fritas, cheddar, huevo, panceta, verdeo y chile opcional',
    price: 12900,
  },
  {
    id: 'principales-bife-de-chorizo-criollo',
    name: 'Bife de chorizo criollo',
    description: 'Bife de chorizo de 350 gr., salsa criolla, huevo frito y papas rústicas',
    price: 38900,
  },
  {
    id: 'mexicana-fajitas-mixtas',
    name: 'Fajitas mixtas',
    description: 'Carne a elección: ternera, pollo o cerdo, cebolla, pimientos, seis tortillas y seis salsas',
    price: 42900,
  },
  {
    id: 'sandwiches-entrana',
    name: 'Entraña',
    description: 'Mayonesa casera, entraña braseada, rúcula, champiñones, tomate confitado y papas fritas',
    price: 27000,
  },
  { id: 'cervezas-chopp-stella', name: 'Chopp Stella Artois', description: '500 cc', price: 7500 },
]

export const itemsById: Record<string, MenuItem> = Object.fromEntries(items.map((item) => [item.id, item]))

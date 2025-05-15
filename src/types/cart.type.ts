import { Product } from './product.type'

export type CartStatus = 0 | 1 | 2
export type CartListStatus = CartStatus | 0
export interface Cart {
  _id: string
  customer_id: string
  product_id: Product
  quantity: number
  size: CartStatus
  color: string
  created_at: string
  updated_at: string
}

export interface CartList {
  carts: Cart[]
  total_cart: number
}

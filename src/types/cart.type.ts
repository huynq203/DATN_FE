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
  cost_price: number
  image: string
  created_at: string
  updated_at: string
}

export interface CartList {
  carts: Cart[]
  total_cart: number
}

export interface ExtendedCarts extends Cart {
  disabled: boolean
  checked: boolean
}

export interface AddtoCart {
  product_id: string
  size: number
  color: string
  cost_price: number
  quantity: number
  image: string
}

export interface CartUpdate {
  product_id: string
  size: number
  color: string
  quantity: number
  cost_price: number
}

export interface CartDelete {
  product_id: string
  size: number
  color: string
}

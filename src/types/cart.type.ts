import { Product } from './product.type'

export interface Cart {
  _id: string
  customer_id: string
  product_id: Product
  quantity: number
  size: number
  created_at: string
  updated_at: string
}

export interface CartList {
  carts: Cart[]
  total_cart: number
}

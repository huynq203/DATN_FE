interface Addresses {
  _id: string
  address: string
  customer_id: string
  created_at: string
  updated_at: string
}

export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  date_of_birth: null
  cart: string[]
  wishlist: string[]
  addresses: Addresses[]
  verify: number
  created_at: string
  updated_at: string
}

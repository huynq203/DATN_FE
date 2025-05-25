export interface Addresses {
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
  date_of_birth: string
  addresses: Addresses[]
  verify: number
  status: number
  created_at: string
  updated_at: string
}

export interface UpdateCustomer {
  name: string
  phone: string
  date_of_birth: string
}

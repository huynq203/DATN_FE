import { isDefault } from 'src/constants/enum'

export interface Addresses {
  _id: string
  customer_id: string
  name: string
  phone: string
  address: string
  isDefault: isDefault
  created_at: string
  updated_at: string
}

export interface UpdateAddressReq {
  address_id: string
  name: string
  phone: string
  address: string
}

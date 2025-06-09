import { Addresses } from './address.type'

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

export interface ChangePasswordBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface CustomerFilter {
  key_search?: string
  status?: string
  dateStart?: string
  dateEnd?: string
}

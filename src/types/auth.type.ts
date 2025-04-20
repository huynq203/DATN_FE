import { Customer } from './customer.type'
import { ResponseApi } from './utils.type'

export type AuthRespone = ResponseApi<{
  access_token: string
  refresh_token: string
  expires: string
  customer: Customer
}>

import { Customer } from './customer.type'
import { SuccessResponseApi } from './utils.type'

export type AuthRespone = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  expires: string
  customer: Customer
}>

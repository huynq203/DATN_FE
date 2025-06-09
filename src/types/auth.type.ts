import { Customer } from './customer.type'
import { User } from './user.type'
import { SuccessResponseApi } from './utils.type'

export type AuthRespone = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  customer: Customer
  role: string
}>

export type AuthUserRespone = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  user: Customer
  role: string
}>

export type UserRespone = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  user: User
  role: string
}>

export interface AuthRegisterBody {
  name: string
  phone: string
  email: string
  password: string
}

export interface AuthLoginBody {
  email: string
  password: string
}

export interface AuthResetPasswordBody {
  new_password: string
  confirm_new_password: string
  forgot_password_token: string
}

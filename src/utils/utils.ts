import axios, { AxiosError } from 'axios'
// import {HttpStatusCode} from 'axios
import { HttpStatusCode } from 'src/constants/httpStatusCode'
//Gọi là cú pháp type predicate
// để xác định kiểu dữ liệu của biến error
// trong hàm isAxiosErrorFunc
export function isAxiosErrorFunc<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosErrorFunc(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}

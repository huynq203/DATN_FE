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

export function isAxiosForbiddenError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosErrorFunc(error) && error.response?.status === HttpStatusCode.Forbidden
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
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return name + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}

export const rateSale = (price: number, promotion_price: number) =>
  Math.round(((price - promotion_price) / price) * 100) + '%'

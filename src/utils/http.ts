import axios, { AxiosError, type AxiosInstance } from 'axios'
import { Constants } from 'src/constants'
import { HttpStatusCode } from 'src/constants/httpStatusCode'
import { isAxiosUnprocessableEntityError } from './utils'
import { toast } from 'react-toastify'

export enum ContentType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data'
}

class APIAccessor {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: Constants.Api.BASE_URL,
      timeout: Constants.Api.TIMEOUT,
      headers: {
        'Content-type': ContentType.JSON
      }
    })
    // Add a response interceptor
    this.instance.interceptors.response.use(
      function (response) {
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }

        return Promise.reject(error)
      }
    )
  }

  // 👇 Khai báo phương thức post
  // post<T>(url: string, data?: unknown) {
  //   return this.instance.post<T>(url, data)
  // }
}

const apiAccessor = new APIAccessor().instance
export default apiAccessor

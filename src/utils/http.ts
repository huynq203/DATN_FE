import axios, { AxiosError, type AxiosInstance } from 'axios'
import { Constants } from 'src/constants'
import { HttpStatusCode } from 'src/constants/httpStatusCode'
import { toast } from 'react-toastify'
import { SuccessResponseApi } from 'src/types/utils.type'
import { AuthRespone } from 'src/types/auth.type'
import { clearAccessToken, saveAccessToken } from './auth'

export enum ContentType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data'
}

class Http {
  instance: AxiosInstance
  private accessToken!: string

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
      (response) => {
        console.log(response)

        const { url } = response.config
        if (url === Constants.ApiPath.CUSTOMER_LOGIN || url === Constants.ApiPath.CUSTOMER_REGISTER) {
          this.accessToken = (response.data as AuthRespone).result?.access_token
          console.log(this.accessToken)

          saveAccessToken(this.accessToken)
        } else if (url === Constants.ApiPath.CUSTOMER_LOGOUT) {
          this.accessToken = ''
          clearAccessToken()
        }
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
  post<T>(url: string, data?: unknown) {
    return this.instance.post<T>(url, data)
  }
}

const http = new Http().instance
export default http

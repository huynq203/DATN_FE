import axios, { AxiosError, type AxiosInstance } from 'axios'
import { Constants } from 'src/constants'
import { HttpStatusCode } from 'src/constants/httpStatusCode'
import { toast } from 'react-toastify'
import { AuthRespone } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  saveAccessToken,
  saveProfile,
  saveRefreshToken
} from './auth'

export enum ContentType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data'
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private profile: Object
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.profile = getProfileFromLS()
    this.instance = axios.create({
      baseURL: Constants.Api.BASE_URL,
      timeout: Constants.Api.TIMEOUT,
      headers: {
        'Content-type': ContentType.JSON
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = 'Bearer ' + this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        console.log(response)
        const { url } = response.config
        if (url === Constants.ApiPath.CUSTOMER_LOGIN || url === Constants.ApiPath.CUSTOMER_REGISTER) {
          this.accessToken = (response.data as AuthRespone).result?.access_token
          this.refreshToken = (response.data as AuthRespone).result?.refresh_token
          this.profile = (response.data as AuthRespone).result?.customer
          saveAccessToken(this.accessToken)
          saveRefreshToken(this.refreshToken)
          saveProfile(this.profile)
        } else if (url === Constants.ApiPath.CUSTOMER_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = {}
          clearLS()
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

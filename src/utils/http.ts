import axios, { AxiosError, type AxiosInstance } from 'axios'
import { paths } from 'src/constants'
import { HttpStatusCode } from 'src/constants/httpStatusCode'
import { toast } from 'react-toastify'
import { AuthRespone, UserRespone } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  getRoleFromLS,
  saveAccessToken,
  saveProfileToLS,
  saveRefreshToken,
  saveRole
} from './auth'
import { Customer } from 'src/types/customer.type'
import { MESSAGE } from 'src/constants/messages'

export enum ContentType {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
  FORM_DATA = 'multipart/form-data'
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private profile: Customer | null
  private role: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.profile = getProfileFromLS()
    this.role = getRoleFromLS()
    this.instance = axios.create({
      baseURL: paths.Api.BASE_URL,
      timeout: paths.Api.TIMEOUT,
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
        const { url } = response.config
        if (
          url === paths.ApiPath.CUSTOMER_LOGIN ||
          url === paths.ApiPath.CUSTOMER_REGISTER ||
          url === paths.ApiPath.LOGIN_USER
        ) {
          this.accessToken = (response.data as AuthRespone).result?.access_token
          this.refreshToken = (response.data as AuthRespone).result?.refresh_token
          this.profile = (response.data as AuthRespone).result?.customer || (response.data as UserRespone).result?.user
          this.role = (response.data as AuthRespone).result?.role || (response.data as UserRespone).result?.role
          saveAccessToken(this.accessToken)
          saveRefreshToken(this.refreshToken)
          saveProfileToLS(this.profile)
          saveRole(this.role)
        } else if (url === paths.ApiPath.CUSTOMER_LOGOUT || url === paths.ApiPath.LOGOUT_USER) {
          this.accessToken = ''
          this.refreshToken = ''
          this.profile = null
          this.role = ''
          clearLS()
        }
        return response
      },

      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          //toast.error(message, { autoClose: 1000 })
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          toast.error(MESSAGE.TOKEN_IS_EXPIRED, { autoClose: 1000 })
          clearLS()
          // window.location.href = paths.Screens.AUTH_LOGIN
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

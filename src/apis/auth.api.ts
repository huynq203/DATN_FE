import http from 'src/utils/http'
import { AuthRespone } from 'src/types/auth.type'
import { Constants } from 'src/constants'

class AuthApi {
  registerCustomer(body: { name: string; phone: string; email: string; password: string }) {
    return http.post<AuthRespone>(Constants.ApiPath.CUSTOMER_REGISTER, body)
  }
  loginCustomer(body: { email: string; password: string }) {
    return http.post<AuthRespone>(Constants.ApiPath.CUSTOMER_LOGIN, body)
  }
  logoutCustomer(body: { refresh_token: string }) {
    return http.post(Constants.ApiPath.CUSTOMER_LOGOUT, body)
  }
}

const authApi = new AuthApi()
export default authApi

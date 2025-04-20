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
}

const authApi = new AuthApi()
export default authApi

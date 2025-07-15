import http from 'src/utils/http'
import { AuthLoginBody, AuthRegisterBody, AuthResetPasswordBody, AuthRespone } from 'src/types/auth.type'
import { paths } from 'src/constants'
class AuthApi {
  registerCustomer(body: AuthRegisterBody) {
    return http.post<AuthRespone>(paths.ApiPath.CUSTOMER_REGISTER, body)
  }

  loginCustomer(body: AuthLoginBody) {
    return http.post<AuthRespone>(paths.ApiPath.CUSTOMER_LOGIN, body)
  }
  logoutCustomer(body: { refresh_token: string }) {
    return http.post(paths.ApiPath.CUSTOMER_LOGOUT, body)
  }
  loginGoogle(body: { code: string }) {
    return http.post<AuthRespone>(paths.ApiPath.CUSTOMER_LOGIN, body)
  }
  forgotPasswordCustomer(body: { email: string }) {
    return http.post(paths.ApiPath.CUSTOMER_FORGOT_PASSWORD, body)
  }
  verifyForgotPasswordCustomer(body: { forgot_password_token: string }) {
    return http.post(paths.ApiPath.CUSTOMER_VERIFY_FORGOT_PASSWORD, body)
  }
  resetPasswordCustomer(body: AuthResetPasswordBody) {
    return http.post(paths.ApiPath.CUSTOMER_RESET_PASSWORD, body)
  }
}

const authApi = new AuthApi()
export default authApi

import { paths } from 'src/constants'
import { AuthUserRespone } from 'src/types/auth.type'
import http from 'src/utils/http'

class UserApi {
  loginUser(body: { email: string; password: string }) {
    return http.post<AuthUserRespone>(paths.ApiPath.LOGIN_USER, body)
  }
  logoutUser(body: { refresh_token: string }) {
    return http.post(paths.ApiPath.LOGOUT_USER, body)
  }
}
const userApi = new UserApi()
export default userApi

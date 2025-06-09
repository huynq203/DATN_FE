import { paths } from 'src/constants'
import { AuthLoginBody, AuthUserRespone } from 'src/types/auth.type'
import { ChangePasswordBody, User, UserFilter, UserRequest, UserUpdateRequest } from 'src/types/user.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class UserApi {
  loginUser(body: AuthLoginBody) {
    return http.post<AuthUserRespone>(paths.ApiPath.LOGIN_USER, body)
  }
  logoutUser(body: { refresh_token: string }) {
    return http.post(paths.ApiPath.LOGOUT_USER, body)
  }
  getAllUsers(params: UserFilter) {
    return http.get<SuccessResponseApi<User[]>>(paths.ApiPath.GET_USERS, { params })
  }
  changeStatusUser(body: { user_id_change: string; status: number }) {
    return http.patch<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.CHANGE_STATUS_USER}`, body)
  }
  createUser(body: UserRequest) {
    return http.post<SuccessResponseApi<User>>(paths.ApiPath.CREATE_USER, body)
  }
  getUserById(user_id_change: string) {
    return http.get<SuccessResponseApi<User>>(`${paths.ApiPath.GET_USERS}/${user_id_change}`)
  }
  updateUser(body: UserUpdateRequest) {
    return http.put<SuccessResponseApi<User>>(`${paths.ApiPath.UPDATE_USER}`, body)
  }
  deleteUser(body: { user_id: string }) {
    return http.delete<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.DELETE_USER}`, { data: body })
  }
  exportFileUser(user_ids: string[]) {
    return http.post(
      `${paths.ApiPath.EXPORT_FILE_USER}`,
      { user_ids },
      {
        responseType: 'blob'
      }
    )
  }
  changePasswordUser(body: ChangePasswordBody) {
    return http.put<SuccessResponseApi<{ message: string }>>(paths.ApiPath.CHANGE_PASSWORD_USER, body)
  }
}
const userApi = new UserApi()
export default userApi

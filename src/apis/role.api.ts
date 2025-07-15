import { paths } from 'src/constants'
import { Role, RoleReq, RoleUpdateReq } from 'src/types/role.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class RoleApi {
  getAllRoleUser() {
    return http.get<SuccessResponseApi<Role[]>>(paths.ApiPath.GET_ROLE_USER)
  }
  getRoleDetail(params: { role_id: string }) {
    return http.get<SuccessResponseApi<Role>>(`${paths.ApiPath.GET_ROLE_BY_ID}`, { params })
  }
  createRole(body: RoleReq) {
    return http.post<SuccessResponseApi<Role>>(paths.ApiPath.CREATE_ROLE_USER, body)
  }
  updateRole(body: RoleUpdateReq) {
    return http.put<SuccessResponseApi<Role>>(`${paths.ApiPath.UPDATE_ROLE_USER}`, body)
  }
  deleteRole(body: { role_id: string }) {
    return http.delete<SuccessResponseApi<Role>>(`${paths.ApiPath.DELETE_ROLE_USER}`, { data: body })
  }
}

const roleApi = new RoleApi()
export default roleApi

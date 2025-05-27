import { paths } from 'src/constants'
import { Role } from 'src/types/role.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class RoleApi {
  getAllRoleUser() {
    return http.get<SuccessResponseApi<Role[]>>(paths.ApiPath.GET_ROLE_USER)
  }
}

const roleApi = new RoleApi()
export default roleApi

import { paths } from 'src/constants'
import { StatusType } from 'src/constants/enum'
import { Customer, UpdateCustomer } from 'src/types/customer.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class CustomerApi {
  getProfile() {
    return http.get<SuccessResponseApi<Customer>>(paths.ApiPath.GET_PROFILE)
  }
  updateProfile(data: UpdateCustomer) {
    return http.patch<SuccessResponseApi<Customer>>(paths.ApiPath.UPDATE_PROFILE, data)
  }

  getAllCustomers() {
    return http.get<SuccessResponseApi<Customer[]>>(paths.ApiPath.GET_ALL_CUSTOMERS)
  }
  getCustomerDetail(customer_id: string) {
    return http.get<SuccessResponseApi<Customer>>(`${paths.ApiPath.GET_ALL_CUSTOMERS}/${customer_id}`)
  }
  deleteCustomer(body: { customer_id: string }) {
    return http.delete<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.DELETE_CUSTOMER}`, { data: body })
  }
  changeStatusCustomer(body: { customer_id: string; status: StatusType }) {
    return http.patch<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.CHANGE_STATUS_CUSTOMER}`, body)
  }
  exportFileCustomer() {
    return http.get(paths.ApiPath.EXPORT_FILE_CUSTOMER, {
      responseType: 'blob'
    })
  }
}

const customerApi = new CustomerApi()
export default customerApi

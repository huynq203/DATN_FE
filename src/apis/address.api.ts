import { paths } from 'src/constants'
import { Addresses, UpdateAddressReq } from 'src/types/address.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class AddressApi {
  getAddressAll() {
    return http.get<SuccessResponseApi<Addresses[]>>(paths.ApiPath.GET_ADDRESS)
  }
  getAddressbyCustomer() {
    return http.get<SuccessResponseApi<Addresses[]>>(paths.ApiPath.GET_ADDRESS_BY_CUSTOMER)
  }
  getAddressManagerByCustomer(customer_id: string) {
    return http.get<SuccessResponseApi<Addresses[]>>(`${paths.ApiPath.GET_ADDRESS}/${customer_id}`)
  }

  createAddress(data: Addresses) {
    return http.post<SuccessResponseApi<Addresses>>(paths.ApiPath.CREATE_ADDRESS, data)
  }
  updateAddress(body: UpdateAddressReq) {
    return http.put<SuccessResponseApi<Addresses>>(paths.ApiPath.UPDATE_ADDRESS, body)
  }
  deleteAddress(body: { address_id: string }) {
    return http.delete<SuccessResponseApi<Addresses>>(paths.ApiPath.DELETE_ADDRESS, { data: body })
  }
  setDefaultAddress(body: { address_id: string }) {
    return http.put<SuccessResponseApi<Addresses>>(paths.ApiPath.SET_DEFAULT_ADDRESS, body)
  }
}

const addressApi = new AddressApi()
export default addressApi

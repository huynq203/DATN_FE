import { paths } from 'src/constants'
import { Addresses } from 'src/types/address.type'

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
}

const addressApi = new AddressApi()
export default addressApi

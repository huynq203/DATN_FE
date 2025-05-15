import { paths } from 'src/constants'
import { Order, OrderResponse } from 'src/types/order.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class OrderApi {
  createCodOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_COD, body)
  }
  createMomoOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_MOMO, body)
  }
  createVnpayOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_VNPAY, body)
  }
  checkVnpayOrder = (params: Record<string, any>) => {
    return http.get<SuccessResponseApi<OrderResponse>>(paths.ApiPath.RETURN_VNPAY, { params })
  }
}

const orderApi = new OrderApi()
export default orderApi

import { paths } from 'src/constants'
import { Order, OrderFilter, OrderManagerResponse, VnpayStatusType } from 'src/types/order.type'
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
    return http.get<SuccessResponseApi<VnpayStatusType>>(paths.ApiPath.RETURN_VNPAY, { params })
  }
  getOrderByUser = (body: { order_status: number }) => {
    return http.post<SuccessResponseApi<Order[]>>(paths.ApiPath.GET_ORDER_BY_CUSTOMER, body)
  }
  getOrderManager = (params: OrderFilter) => {
    return http.get<SuccessResponseApi<OrderManagerResponse[]>>(paths.ApiPath.GET_ORDER_MANAGER, { params })
  }
}

const orderApi = new OrderApi()
export default orderApi

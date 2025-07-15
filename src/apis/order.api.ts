import { paths } from 'src/constants'
import {
  ChangeOrderStatus,
  MomoStatusType,
  Order,
  OrderDetailResponse,
  OrderDetailResponseItem,
  OrderFilter,
  OrderFilterByCustomer,
  OrderResponse,
  TotalDashBoard,
  TotalProfitToMonth,
  TotalStatusOrder,
  VnpayStatusType
} from 'src/types/order.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class OrderApi {
  createCodOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_COD, body)
  }
  createMomoOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_MOMO, body)
  }
  checkMomoOrder = (params: Record<string, any>) => {
    return http.get<SuccessResponseApi<MomoStatusType>>(paths.ApiPath.RETURN_MOMO, { params })
  }
  createVnpayOrder = (body: Order) => {
    return http.post(paths.ApiPath.CREATE_ORDER_VNPAY, body)
  }
  checkVnpayOrder = (params: Record<string, any>) => {
    return http.get<SuccessResponseApi<VnpayStatusType>>(paths.ApiPath.RETURN_VNPAY, { params })
  }
  getOrderManager = (params: OrderFilter) => {
    return http.get<SuccessResponseApi<OrderResponse[]>>(paths.ApiPath.GET_ORDER_MANAGER, { params })
  }
  getOrderDetail = (params: { order_id: string }) => {
    return http.get<SuccessResponseApi<OrderDetailResponseItem[]>>(paths.ApiPath.GET_ORDER_DETAIL, { params })
  }
  changeOrderStatus = (body: ChangeOrderStatus) => {
    return http.put<SuccessResponseApi<OrderDetailResponse>>(paths.ApiPath.CHANGE_ORDER_STATUS, body)
  }
  exportFileOrder = (order_ids: string[]) => {
    return http.post(
      paths.ApiPath.EXPORT_FILE_ORDER,
      { order_ids },
      {
        responseType: 'blob'
      }
    )
  }
  getOrderbyCustomerId = (params: OrderFilterByCustomer) => {
    return http.get<SuccessResponseApi<OrderResponse[]>>(paths.ApiPath.GET_ORDER_BY_CUSTOMER, { params })
  }
  cancelOrder = (body: { order_id: string }) => {
    return http.put<SuccessResponseApi<OrderDetailResponse>>(paths.ApiPath.CANCEL_ORDER, body)
  }
  getOrderStatusCount = () => {
    return http.get<SuccessResponseApi<TotalStatusOrder>>(paths.ApiPath.GET_ORDER_STATUS_COUNT)
  }
  getTotalProfitToMonth = () => {
    return http.get<SuccessResponseApi<TotalProfitToMonth[]>>(paths.ApiPath.GET_TOTAL_PROFIT_TO_MONTH)
  }
  getTotalDashBoard = () => {
    return http.get<SuccessResponseApi<TotalDashBoard>>(paths.ApiPath.GET_TOTAL_PROFIT_TO_DAY_NOW)
  }
}

const orderApi = new OrderApi()
export default orderApi

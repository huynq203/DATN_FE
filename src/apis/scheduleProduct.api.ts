import { paths } from 'src/constants'
import {
  CreateScheduleProductReq,
  ScheduleProduct,
  ScheduleProductDetail,
  ScheduleProductRes,
  ScheduleProductUpdateReq
} from 'src/types/scheduleProduct.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class ScheduleProductApi {
  createScheduleProduct(body: CreateScheduleProductReq) {
    return http.post<SuccessResponseApi<ScheduleProduct>>(paths.ApiPath.CREATE_SCHEDULE_PRODUCT, body)
  }
  getAllScheduleProduct() {
    return http.get<SuccessResponseApi<ScheduleProductRes[]>>(paths.ApiPath.GET_ALL_SCHEDULE_PRODUCT)
  }
  getScheduleProductById(params: { scheduleProductId: string }) {
    return http.get<SuccessResponseApi<ScheduleProductDetail>>(paths.ApiPath.GET_SCHEDULE_PRODUCT_BY_ID, { params })
  }
  updateScheduleProduct(params: ScheduleProductUpdateReq) {
    return http.put<SuccessResponseApi<ScheduleProduct>>(paths.ApiPath.UPDATE_SCHEDULE_PRODUCT, params)
  }
}

const scheduleProductApi = new ScheduleProductApi()
export default scheduleProductApi

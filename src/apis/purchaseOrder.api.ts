import { paths } from 'src/constants'
import { PurchaseOrderReq } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class PurchaseOrderApi {
  createPurchaseOrder(body: PurchaseOrderReq[]) {
    return http.post<SuccessResponseApi<{ message: string }>>(paths.ApiPath.CREATE_PURCHASE_ORDER, body)
  }
  delePurchaseOrder(body: { purchase_order_id: string }) {
    return http.delete<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.DELETE_PURCHASE_ORDER}`, {
      data: body
    })
  }
  setIsPushInventory(body: { inventory_id: string }) {
    return http.put<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.SET_IS_PUSH_INVENTORY}`, body)
  }
}
const purchaseOrderApi = new PurchaseOrderApi()
export default purchaseOrderApi

import { paths } from 'src/constants'
import { SuccessResponseApi } from 'src/types/utils.type'
import { CreateVoucherReq, UpdateVoucherReq, Voucher } from 'src/types/voucher.type'
import http from 'src/utils/http'

class VoucherApi {
  getAllVoucher() {
    return http.get<SuccessResponseApi<Voucher[]>>(paths.ApiPath.GET_VOUCHERS)
  }
  createVoucher(body: CreateVoucherReq) {
    return http.post<SuccessResponseApi<Voucher>>(paths.ApiPath.CREATE_VOUCHER, body)
  }
  updateVoucher(body: UpdateVoucherReq) {
    return http.put<SuccessResponseApi<Voucher>>(paths.ApiPath.UPDATE_VOUCHER, body)
  }
  deleteVoucher(body: { voucher_id: string }) {
    return http.delete<SuccessResponseApi<Voucher>>(paths.ApiPath.DELETE_VOUCHER, { data: body })
  }
  saveVoucher(body: { code: string }) {
    return http.post<SuccessResponseApi<Voucher>>(paths.ApiPath.SAVE_VOUCHER, body)
  }
}
const voucherApi = new VoucherApi()
export default voucherApi

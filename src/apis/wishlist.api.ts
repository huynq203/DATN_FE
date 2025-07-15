import { paths } from 'src/constants'
import { SuccessResponseApi } from 'src/types/utils.type'
import { GetWishListByCustomerRes, WishListRes } from 'src/types/wishlist.type'
import http from 'src/utils/http'

class WishListApi {
  // createRating(body: RateReq) {
  //   return http.post(paths.ApiPath.CREATE_RATING, body)
  // }
  // getRatingByProduct(body: { product_id: string }) {
  //   return http.get<SuccessResponseApi<GetRatingByProductRes>>(paths.ApiPath.GET_RATING_BY_PRODUCT, { params: body })
  // }

  changeWishListByProduct(body: { product_id: string }) {
    return http.post<SuccessResponseApi<WishListRes>>(paths.ApiPath.CHANE_WISH_LIST_FAVORITE, body)
  }
  getWishListByProduct(body: { product_id: string }) {
    return http.get<SuccessResponseApi<WishListRes>>(paths.ApiPath.GET_WISH_LIST_BY_PRODUCT, { params: body })
  }
  getWishListByCustomer() {
    return http.get<SuccessResponseApi<GetWishListByCustomerRes[]>>(paths.ApiPath.GET_WISH_LIST_BY_CUSTOMER)
  }
  deleteWishList(body: { wish_list_id: string }) {
    return http.delete<SuccessResponseApi<{ message: string }>>(paths.ApiPath.DELETE_WISH_LIST_BY_CUSTOMER, {
      data: body
    })
  }
}
const wishListApi = new WishListApi()
export default wishListApi

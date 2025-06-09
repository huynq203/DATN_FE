import { paths } from 'src/constants'
import { AddtoCart, Cart, CartDelete, CartList, CartListStatus, CartUpdate } from 'src/types/cart.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class CartApi {
  addToCart(body: AddtoCart) {
    return http.post<SuccessResponseApi<Cart>>(paths.ApiPath.CART_ADD_TO_CART, body)
  }
  getCart(params: { status: CartListStatus }) {
    return http.get<SuccessResponseApi<CartList>>(paths.ApiPath.CART_URL, { params })
  }
  updateCart(body: CartUpdate) {
    return http.put<SuccessResponseApi<Cart[]>>(paths.ApiPath.CART_UPDATE_PRODUCT, body)
  }
  deleteCart(body: CartDelete[]) {
    // product_id: {product_id:string, size: number}
    return http.delete<SuccessResponseApi<{ deletedCount: number }>>(paths.ApiPath.CART_URL, { data: body })
  }
  // buyProducts(body: { product_id: Object; size: number; color: string; quantity: number }[]) {
  //   return http.post<SuccessResponseApi<Cart[]>>(paths.ApiPath.CART_BUY_PRODUCT, body)
  // }
}
const cartApi = new CartApi()
export default cartApi

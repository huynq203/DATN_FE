import { paths } from 'src/constants'
import { Cart, CartList, CartListStatus } from 'src/types/cart.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class CartApi {
  addToCart(body: { product_id: string; size: number; quantity: number }) {
    return http.post<SuccessResponseApi<Cart>>(paths.ApiPath.CART_ADD_TO_CART, body)
  }
  getCart(params: { status: CartListStatus }) {
    return http.get<SuccessResponseApi<CartList>>(paths.ApiPath.CART_URL, { params })
  }
  updateCart(body: { product_id: string; size: number; quantity: number }) {
    return http.put<SuccessResponseApi<Cart[]>>(paths.ApiPath.CART_UPDATE_PRODUCT, body)
  }
  deleteCart(body: { product_id: string; size: number }[]) {
    // product_id: {product_id:string, size: number}
    return http.delete<SuccessResponseApi<{ deletedCount: number }>>(paths.ApiPath.CART_URL, { data: body })
  }
  buyProducts(body: { product_id: Object; size: number; quantity: number }[]) {
    return http.post<SuccessResponseApi<Cart[]>>(paths.ApiPath.CART_BUY_PRODUCT, body)
  }
}
const cartApi = new CartApi()
export default cartApi

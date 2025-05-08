import { paths } from 'src/constants'
import { Cart, CartList } from 'src/types/cart.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class CartApi {
  addToCart(body: { product_id: string; size: number; quantity: number }) {
    return http.post<SuccessResponseApi<Cart>>(paths.ApiPath.CART_ADD_TO_CART, body)
  }
  getCart() {
    return http.get<SuccessResponseApi<CartList>>(paths.ApiPath.CART_URL)
  }
}
const cartApi = new CartApi()
export default cartApi

import { paths } from 'src/constants'
import { AuthRespone } from 'src/types/auth.type'
import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class ProductApi {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>(paths.ApiPath.PRODUCT_URL, { params })
  }
  getProductDetail(product_id: string) {
    return http.get<SuccessResponseApi<Product>>(`${paths.ApiPath.PRODUCT_URL}/${product_id}`)
  }
}

const productApi = new ProductApi()
export default productApi

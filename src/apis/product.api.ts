import { paths } from 'src/constants'
import {
  Media,
  OptionProduct,
  OptionProductReq,
  OptionProductUpdateReq,
  Product,
  ProductCreateReq,
  ProductList,
  ProductListConfig,
  ProductUpdateReq
} from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class ProductApi {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>(paths.ApiPath.PRODUCT_URL, { params })
  }
  getProductManager() {
    return http.get<SuccessResponseApi<ProductList>>(paths.ApiPath.GET_PRODUCT_MANAGER)
  }
  getProductDetail(product_id: string) {
    return http.get<SuccessResponseApi<Product>>(`${paths.ApiPath.PRODUCT_URL}/${product_id}`)
  }

  createProduct(body: ProductCreateReq) {
    return http.post<SuccessResponseApi<Product>>(paths.ApiPath.CREATE_PRODUCT, body)
  }
  uploadImage(body: FormData) {
    return http.post<SuccessResponseApi<Media[]>>(paths.ApiPath.UPLOAD_IMAGE, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  updateProduct(body: ProductUpdateReq) {
    return http.put<SuccessResponseApi<Product>>(`${paths.ApiPath.UPDATE_PRODUCT}`, body)
  }
  deleteProduct(body: { product_id: string }) {
    return http.delete<SuccessResponseApi<Product>>(`${paths.ApiPath.DELETE_PRODUCT}`, { data: body })
  }
  getOptionProduct(product_id: string) {
    return http.get<SuccessResponseApi<OptionProduct[]>>(`${paths.ApiPath.GET_OPTION_PRODUCT}/${product_id}`)
  }

  createOptionProduct(body: OptionProductReq) {
    return http.post<SuccessResponseApi<OptionProduct>>(paths.ApiPath.CREATE_OPTION_PRODUCT, body)
  }
  updateOptionProduct(body: OptionProductUpdateReq) {
    return http.put<SuccessResponseApi<OptionProduct>>(paths.ApiPath.UPDATE_OPTION_PRODUCT, body)
  }
  deleteOptionProduct(body: { optionProduct_id: string }) {
    return http.delete<SuccessResponseApi<OptionProduct>>(paths.ApiPath.DELETE_OPTION_PRODUCT, { data: body })
  }
  exportFileProduct() {
    return http.get(paths.ApiPath.EXPORT_FILE_PRODUCT, {
      responseType: 'blob'
    })
  }
}

const productApi = new ProductApi()
export default productApi

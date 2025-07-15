import { paths } from 'src/constants'
import {
  CheckStockOptionProductList,
  Media,
  OptionProduct,
  OptionProductList,
  OptionProductReq,
  OptionProductUpdateReq,
  Product,
  ProductCreateReq,
  ProductDetail,
  ProductFilter,
  ProductList,
  ProductListConfig,
  ProductManagerList,
  ProductUpdateReq
} from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class ProductApi {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>(paths.ApiPath.PRODUCT_URL, { params })
  }
  getProductManager(params: ProductFilter) {
    return http.get<SuccessResponseApi<ProductManagerList[]>>(paths.ApiPath.GET_PRODUCT_MANAGER, { params })
  }
  getProductDetail(product_id: string) {
    return http.get<SuccessResponseApi<ProductDetail>>(`${paths.ApiPath.PRODUCT_URL}/${product_id}`)
  }
  getStockOptionProductById(option_product_id: string) {
    return http.get<SuccessResponseApi<CheckStockOptionProductList>>(
      `${paths.ApiPath.CHECK_STOCK_OPTION_PRODUCT}/${option_product_id}`
    )
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
  uploadImageVariantColor(body: FormData) {
    return http.post<SuccessResponseApi<Media[]>>(paths.ApiPath.UPLOAD_IMAGE_VARIANT_COLOR, body, {
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
    return http.get<SuccessResponseApi<OptionProductList[]>>(`${paths.ApiPath.GET_OPTION_PRODUCT}/${product_id}`)
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
  exportFileProduct(product_ids: string[]) {
    return http.post(
      paths.ApiPath.EXPORT_FILE_PRODUCT,
      { product_ids },
      {
        responseType: 'blob'
      }
    )
  }
  changeStatusProduct(body: { product_id: string; status: number }) {
    return http.patch<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.CHANGE_STATUS_PRODUCT}`, body)
  }
  changeStatusOptionProduct(body: { option_product_id: string; status: number }) {
    return http.patch<SuccessResponseApi<{ message: string }>>(`${paths.ApiPath.CHANGE_STATUS_OPTION_PRODUCT}`, body)
  }
  getProductByDiscount() {
    return http.get<SuccessResponseApi<Product[]>>(paths.ApiPath.GET_PRODUCT_BY_DISCOUNT)
  }
  getProductByMen() {
    return http.get<SuccessResponseApi<Product[]>>(paths.ApiPath.GET_PRODUCT_BY_MEN)
  }
  getProductByKid() {
    return http.get<SuccessResponseApi<Product[]>>(paths.ApiPath.GET_PRODUCT_BY_KID)
  }
}

const productApi = new ProductApi()
export default productApi

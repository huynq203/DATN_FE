import http from 'src/utils/http'
import { paths } from 'src/constants'
import { Category, CategoryList, CategoryListConfig } from 'src/types/category.type'
import { SuccessResponseApi } from 'src/types/utils.type'

class CategoryApi {
  getCategory() {
    return http.get<SuccessResponseApi<CategoryList>>(paths.ApiPath.CATEGORY_URL)
  }
  getProductDetail(category_id: string) {
    return http.get<SuccessResponseApi<Category>>(`${paths.ApiPath.CATEGORY_URL}/${category_id}`)
  }
}

const categoryApi = new CategoryApi()
export default categoryApi

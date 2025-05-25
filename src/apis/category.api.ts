import http from 'src/utils/http'
import { paths } from 'src/constants'
import { Category, CategoryList, CategoryReqBody, CategoryUpdateReqBody } from 'src/types/category.type'
import { SuccessResponseApi } from 'src/types/utils.type'

class CategoryApi {
  getCategory() {
    return http.get<SuccessResponseApi<CategoryList>>(paths.ApiPath.CATEGORY_URL)
  }
  getProductDetail(category_id: string) {
    return http.get<SuccessResponseApi<Category>>(`${paths.ApiPath.CATEGORY_URL}/${category_id}`)
  }
  createCategory(body: CategoryReqBody) {
    return http.post<SuccessResponseApi<Category>>(paths.ApiPath.CREATE_CATEGORY, body)
  }
  updateCategory(body: CategoryUpdateReqBody) {
    return http.put<SuccessResponseApi<Category>>(`${paths.ApiPath.UPDATE_CATEGORY}`, body)
  }
  deleteCategory(body: { category_id: string }) {
    return http.delete<SuccessResponseApi<Category>>(`${paths.ApiPath.DELETE_CATEGORY}`, { data: body })
  }
}

const categoryApi = new CategoryApi()
export default categoryApi

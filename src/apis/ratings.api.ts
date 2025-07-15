import { paths } from 'src/constants'
import { GetRatingByProductRes, RateReq } from 'src/types/ratings.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class RateApi {
  createRating(body: RateReq) {
    return http.post(paths.ApiPath.CREATE_RATING, body)
  }
  getRatingByProduct(body: { product_id: string }) {
    return http.get<SuccessResponseApi<GetRatingByProductRes>>(paths.ApiPath.GET_RATING_BY_PRODUCT, { params: body })
  }
}
const rateApi = new RateApi()
export default rateApi

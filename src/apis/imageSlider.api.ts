import { paths } from 'src/constants'
import { ImageSlider, ImageSliderReq } from 'src/types/imageSlider.type'
import { Media } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.type'
import http from 'src/utils/http'

class ImageSliderApi {
  async uploadImageSlider(body: FormData) {
    return http.post<SuccessResponseApi<Media[]>>(paths.ApiPath.UPLOAD_IMAGE_SLIDER, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  async createImageSlider(body: ImageSliderReq) {
    return http.post<SuccessResponseApi<ImageSlider>>(paths.ApiPath.CREATE_IMAGE_SLIDER, body)
  }
  async getAllImageSlider() {
    return http.get<SuccessResponseApi<ImageSlider[]>>(paths.ApiPath.GET_ALL_IMAGE_SLIDER)
  }
  async deleteImageSlider(body: { image_slider_id: string }) {
    return http.delete<SuccessResponseApi<{ message: string }>>(paths.ApiPath.DELETE_IMAGE_SLIDER, {
      data: body
    })
  }
}
const imageSliderApi = new ImageSliderApi()
export default imageSliderApi

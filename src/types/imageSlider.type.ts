import { Media } from './product.type'

export interface ImageSliderReq {
  link: string
  urlImage: Media[]
}

export interface ImageSlider {
  _id: string
  link: string
  urlImage: Media[]
  created_at: string
  updated_at: string
}

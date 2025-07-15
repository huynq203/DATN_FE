import { PromotionPriceType, StatusScheduleProduct } from 'src/constants/enum'

export interface ScheduleProduct {
  price_value: number
  promotion_type: PromotionPriceType
  product_ids: string[]
  name: string
  status: StatusScheduleProduct
  time_start: string
  time_end: string
  created_by?: {
    _id: string
    name: string
  }
  created_at?: string
  updated_at?: string
}

export interface ScheduleProductRes {
  _id: string
  promotion_type: PromotionPriceType
  name: string
  price_value: number
  status: StatusScheduleProduct
  time_start: string
  time_end: string
  created_by: {
    _id: string
    name: string
  }
  created_at: string
  updated_at: string
}

export interface CreateScheduleProductReq {
  price_value: number
  promotion_type: PromotionPriceType
  product_ids: string[]
  name: string
  time_start: string
  time_end: string
}

export interface ScheduleProductDetail {
  key: string
  promotion_type: PromotionPriceType
  name: string
  price_value: number
  status: StatusScheduleProduct
  time_start: string
  time_end: string
  updated_at: string
  products_mapped: {
    _id: string
    code_product: string
    name: string
    price_discount: number
    url_image: {
      url: string
      type: number
    }
  }[]
}

export interface ScheduleProductUpdateReq {
  schedule_product_id: string
  promotion_type: PromotionPriceType
  price_value: number
  name: string
  time_start: Date
  time_end: Date
}

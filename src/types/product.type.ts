import { MediaType } from 'src/constants/enum'

export interface Product {
  _id: string
  category_id: {
    _id: string
    name: string
  }
  name: string
  description: string
  slug: string
  url_images: Media[]
  price: number
  promotion_price: number
  option_products: OptionProduct[]
  status: number
  view: number
  sold: number
  created_by: {
    _id: string
    name: string
  }
  created_at: string
  updated_at: string
}

export interface ProductList {
  products: Product[]
  paginate: {
    page: number
    limit: number
    total_page: number
  }
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'created_at' | 'view' | 'price' | 'sold' | 'promotion_price'
  order?: '1' | '-1' // 1: tăng dần, -1: giảm dần
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category_id?: string
}

export interface ProductCreateReq {
  category_id: string
  name: string
  stock: string
  price: string
  size: string
  color: string
  description: string
  url_images: Media[]
}

export interface ProductUpdateReq {
  product_id: string
  name: string
  price: string
  description: string
  url_images: Media[]
}

export interface Media {
  url: string
  type: MediaType
}

export interface OptionProduct {
  _id: string
  product_id: string
  size: number
  color: string
  stock: number
  created_by: {
    [key: number]: {
      _id: string
      name: string
    }
  }
  created_at: string
  updated_at: string
}

export interface OptionProductReq {
  product_id: string
  size: number
  color: string
  stock: number
}

export interface OptionProductUpdateReq {
  option_product_id: string
  product_id: string
  size: number
  color: string
  stock: number
}

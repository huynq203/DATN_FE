import { IsChoose, MediaType, StatusType } from 'src/constants/enum'

export interface Product {
  _id: string
  category_id: {
    _id: string
    name: string
  }
  code_product: string
  name: string
  description: string
  slug: string
  url_images: Media[]
  price: number
  promotion_price: number
  option_products: OptionProduct[]
  status: number
  gender: number // 0: unisex, 1: nam, 2: nữ
  target_person: number // 0: trẻ em, 1: người lớn
  total_stock: number
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

export interface ProductManagerList extends Product {
  total_stock: number
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'created_at' | 'view' | 'price' | 'sold' | 'promotion_price'
  order?: '1' | '-1' // 1: tăng dần, -1: giảm dần
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  key_search?: string
  category_id?: string
  gender?: number // 0: nữ, 1: nam, 2: unisex
  target_person?: number // 0: trẻ em, 1: người lớn
  status?: StatusType // 0: ẩn, 1: hiện
}

export interface ProductFilter {
  key_search?: string
  status?: string // 0: ẩn, 1: hiện
  category_id?: string
  gender?: string // 0: nữ, 1: nam, 2: unisex
  target_person?: string // 0: trẻ em, 1: người lớn
  price_min?: string
  price_max?: string
  stock?: string // 0: hết hàng, 1: còn hàng
}

export interface ProductCreateReq {
  category_id: string
  name: string
  price: number
  gender: number
  target_person: number
  description: string
  url_images: Media[]
}

export interface ProductUpdateReq {
  product_id: string
  name: string
  price: number
  promotion_price: number
  gender: number
  target_person: number
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
  image_variant_color: Media[]
  status: StatusType
  created_by: {
    [key: number]: {
      _id: string
      name: string
    }
  }
  created_at: string
  updated_at: string
}

export interface OptionProductList extends OptionProduct {
  stock: number
  sold: number
}

export interface OptionProductReq {
  product_id: string
  size: number
  color: string
  image_variant_color: Media[]
}

export interface OptionProductUpdateReq {
  option_product_id: string
  product_id: string
  size: number
  color: string
  image_variant_color: Media[]
}

export interface CheckStockOptionProduct {
  _id: string
  option_product_id: string
  size: number
  color: string
  stock: number
  cost_price: number
  sold: number
  isChoose: IsChoose
  created_by: {
    _id: string
    name: string
  }
  created_at: string
  updated_at: string
}

export interface CheckStockOptionProductList {
  totalStock: number
  totalSold: number
  inventories: CheckStockOptionProduct[]
}

export interface PurchaseOrderReq {
  option_product_id: string
  product_id: string
  stock: number
  cost_price: number
}

export interface Inventories {
  _id: string
  inventory_id: string
  size: number
  color: string
  stock: number
  image_variant_color: Media[]
  cost_price: number
  sold: number
}
export interface ProductDetail {
  product: Product
  inventories: Inventories[]
}

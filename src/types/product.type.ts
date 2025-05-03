export interface Product {
  _id: string
  category_id: {
    _id: string
    name: string
  }
  name: string
  description: string
  slug: string
  url_images: [
    {
      url: string
      type: number
    }
  ]
  price: number
  promotion_price: number
  sizes: {
    _id: string
    size_name: string
    stock: number
  }
  status: number
  view: number
  sold: number
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
  sort_by?: 'created_at' | 'view' | 'price' | 'sold'
  order?: 1 | -1 // 1: tăng dần, -1: giảm dần
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category_id?: string
}

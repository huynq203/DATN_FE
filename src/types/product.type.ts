export interface Product {
  _id: string
  category_id: {
    [key: number]: {
      _id: string
      name: string
    }
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
  }
  colors: {
    _id: string
    color_name: string
  }
  status: number
  view: number
  sold: number
  stock: number
  created_by: string
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

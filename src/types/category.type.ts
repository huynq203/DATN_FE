export interface Category {
  _id: string
  name: string
  description: string
  slug: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface CategoryList {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    total_page: number
  }
}

export interface CategoryListConfig {
  page?: number
  limit?: number
}

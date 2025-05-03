const a = {
  _id: '680bb79a9dbd841cffe012bb',
  name: 'New Balance',
  description: 'Thương hiệu New Balance',
  slug: 'thuong-hieu-new-balance',
  created_by: '67f2aa4a7c1befbd4e1fb8ae',
  created_at: '2025-04-25T16:26:02.856Z',
  updated_at: '2025-04-25T16:26:02.856Z'
}

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

export interface WishListReq {
  product_id: string
  isFavorite: number
}

export interface WishListRes {
  _id: string
  product_id: string
  customer_id: string
  isFavorite: number
  created_at: string
  updated_at: string
}

export interface GetWishListByCustomerRes {
  _id: string
  isFavorite: number
  created_at: string
  updated_at: string
  product?: {
    _id: string
    code_product: string
    name: string
    slug: string
    price: number
    url_images: {
      url: string
      type: string
    }[]
  }
}

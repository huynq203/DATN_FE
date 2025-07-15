export interface RateReq {
  order_id: string
  product_id: string
  star: number
  comment?: string
}

export interface RatingRes {
  _id: string
  name: string
  star: number
  comment?: string
  created_at: string
}

export interface GetRatingByProductRes {
  listRatings: RatingRes[]
  totalRatings: number
  averageStar: number
}

import { isUndefined, omitBy } from 'lodash'
import useQueryParams from 'src/components/useQueryParams'
import { ProductListConfig } from 'src/types/product.type'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      order: queryParams.order,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      key_search: queryParams.key_search,
      category_id: queryParams.category_id,
      gender: queryParams.gender,
      target_person: queryParams.target_person,
      status: queryParams.status
    },
    isUndefined
  )
  return queryConfig
}

import { isUndefined, omitBy } from 'lodash'
import useQueryParams from 'src/components/useQueryParams'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

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
      name: queryParams.name,
      category_id: queryParams.category_id
    },
    isUndefined
  )
  return queryConfig
}

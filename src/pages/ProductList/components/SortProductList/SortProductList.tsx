import { sortBy, order as orderConstant } from 'src/constants/product'
import { QueryConfig } from '../../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { paths } from 'src/constants'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  total_page: number
}

export default function SortProductList({ queryConfig, total_page }: Props) {
  const { sort_by = sortBy.created_at, order } = queryConfig
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: paths.Screens.PRODUCT,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: paths.Screens.PRODUCT,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className=''>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 text-xs text-center ', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Lượt xem
          </button>
          <button
            className={classNames('h-8 px-4 capitalize  text-xs text-center ', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.created_at),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.created_at)
            })}
            onClick={() => handleSort(sortBy.created_at)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize  text-xs text-center ', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <button
            className={classNames('h-8 px-4 capitalize  text-xs text-center ', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.promotion_price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.promotion_price)
            })}
            onClick={() => handleSort(sortBy.promotion_price)}
          >
            Giảm giá
          </button>
          <select
            className={classNames('h-8 px-4  text-xs ', {
              'bg-orange-600 text-white hover:bg-orange-600/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-white text-black' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black' value={orderConstant.asc}>
              Giá từ thấp đến cao
            </option>
            <option className='bg-white text-black' value={orderConstant.desc}>
              Giá từ cao đến thấp
            </option>
          </select>
        </div>
      </div>
    </div>
  )
}

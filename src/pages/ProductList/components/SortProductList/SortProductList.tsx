import { sortBy, order as orderConstant } from 'src/constants/product'
import { QueryConfig } from 'src/hooks/useQueryConfig'

import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { paths } from 'src/constants'
import { omit } from 'lodash'
import { Dropdown, MenuProps, Space } from 'antd'

interface Props {
  queryConfig: QueryConfig
  total_page: number
}

export default function SortProductList({ queryConfig, total_page }: Props) {
  console.log(total_page)

  const { sort_by = sortBy.created_at } = queryConfig
  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  console.log(isActiveSortBy)

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
  const items: MenuProps['items'] = [
    {
      label: (
        <button className={'h-8 text-sm text-center '} onClick={() => handleSort(sortBy.view)}>
          Lượt xem
        </button>
      ),
      key: '0'
    },
    {
      label: (
        <button className='h-8 capitalize  text-sm text-center ' onClick={() => handleSort(sortBy.created_at)}>
          Mới nhất
        </button>
      ),
      key: '1'
    },
    {
      label: (
        <button className='h-8 capitalize  text-sm text-center ' onClick={() => handleSort(sortBy.sold)}>
          Bán chạy
        </button>
      ),
      key: '2'
    },
    {
      label: (
        <button className='h-8 capitalize  text-sm text-center ' onClick={() => handleSort(sortBy.promotion_price)}>
          Giảm giá
        </button>
      ),
      key: '3'
    },
    {
      label: (
        <button
          className='h-8 capitalize  text-sm text-center '
          onClick={() => handlePriceOrder(orderConstant.asc as Exclude<ProductListConfig['order'], undefined>)}
        >
          Giá từ thấp đến cao
        </button>
      ),
      key: '4'
    },
    {
      label: (
        <button
          className='h-8 capitalize  text-sm text-center '
          onClick={() => handlePriceOrder(orderConstant.desc as Exclude<ProductListConfig['order'], undefined>)}
        >
          Giá từ cao đến thấp
        </button>
      ),
      key: '5'
    }
  ]

  return (
    <>
      <div className='hidden md:flex justify-between'>
        <div></div>
        <div>
          <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Sắp xếp
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='size-6'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                </svg>
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

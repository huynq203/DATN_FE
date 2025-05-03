import { Pagination } from 'antd'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import { paths } from 'src/constants'
import { QueryConfig } from 'src/pages/ProductList/ProductList'
interface Props {
  queryConfig: QueryConfig

  total_page: number
}
const RANGE = 2 // số trang hiển thị trước và sau trang hiện tại
export default function Paginate({ queryConfig, total_page }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='bg-gray-100 rounded px-3 py-2 shadow-sm mx-1 border'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='bg-gray-100 rounded px-3 py-2 shadow-sm mx-1 border'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(total_page)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < total_page - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && pageNumber < total_page - RANGE) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < total_page - RANGE + 1) {
            return renderDotAfter(index)
          }
        }
        return (
          <Link
            to={{
              pathname: paths.Screens.HOME,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('bg-gray-100 rounded px-3 py-2 shadow-sm mx-1 cursor-pointer border', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap mt-40 justify-center'>
      {page === 1 ? (
        <span className='bg-gray-300 rounded px-3 py-2 shadow-sm border'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: paths.Screens.HOME,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='bg-gray-100 rounded px-3 py-2 shadow-sm cursor-pointer border'
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {page === total_page ? (
        <span className='bg-gray-300 rounded px-3 py-2 shadow-sm  border'>Next</span>
      ) : (
        <Link
          to={{
            pathname: paths.Screens.HOME,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='bg-gray-100 rounded px-3 py-2 shadow-sm cursor-pointer border'
        >
          Next
        </Link>
      )}
    </div>
  )
}

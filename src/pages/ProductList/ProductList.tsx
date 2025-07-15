import AsideFilter from './components/AsideFilter'
import SortProductList from './components/SortProductList'
import Product from './components/Product/Product'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import productApi from 'src/apis/product.api'
import Paginate from 'src/components/Paginate'
import { ProductListConfig } from 'src/types/product.type'

import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'
import { Spin } from 'antd'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: listProduct, isLoading } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })
  const productData = listProduct?.data.result.products
  const totalPage = listProduct?.data.result.paginate.total_page

  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })

  return (
    <div className='bg-white'>
      <Helmet>
        <title>Sản phẩm</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>
      <div className='container'>
        <div className='overflow-auto pt-1 pb-5'>
          {productData && (
            <div className='grid grid-cols-12 gap-1'>
              <div className='col-span-2'>
                {listCategory && <AsideFilter queryConfig={queryConfig} categories={listCategory?.data.result} />}
              </div>
              <div className='col-span-10 ml-10'>
                {totalPage && <SortProductList queryConfig={queryConfig} total_page={totalPage} />}
                <Spin size='large' tip='Đang tải...' spinning={isLoading}>
                  {productData.length > 0 ? (
                    <div className='mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1'>
                      {productData.map((product) => (
                        <div className='col-span-1' key={product._id}>
                          <Product product={product} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center mt-10 text-gray-500 font-semibold text-lg'>
                      Không có sản phẩm nào phù hợp
                    </div>
                  )}
                </Spin>
              </div>
            </div>
          )}
          {totalPage ? (
            <div className='flex justify-center items-center'>
              <Paginate queryConfig={queryConfig} total_page={totalPage} />{' '}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

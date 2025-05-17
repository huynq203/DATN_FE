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
import { useEffect, useState } from 'react'
import Loading from '../Loading'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const [isLoading, setIsLoading] = useState(true)
  const { data: listProduct } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000
  })
  console.log(listProduct)

  const { data: listCategory } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])
  return (
    <div className='bg-white'>
      <Helmet>
        <title>Sản phẩm</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>
      <div className='container'>
        <div className='overflow-auto py-5'>
          {' '}
          {listProduct && (
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-2'>
                {listCategory && (
                  <AsideFilter queryConfig={queryConfig} categories={listCategory?.data.result.categories} />
                )}
              </div>
              <div className='col-span-10 ml-10'>
                <SortProductList queryConfig={queryConfig} total_page={listProduct.data.result.paginate.total_page} />
                <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3'>
                  {listProduct.data.result.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                <Paginate queryConfig={queryConfig} total_page={listProduct?.data.result.paginate.total_page} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

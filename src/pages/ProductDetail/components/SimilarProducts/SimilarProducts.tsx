import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import Product from 'src/pages/ProductList/components/Product'
import { ProductListConfig } from 'src/types/product.type'

interface Props {
  product_id: string
  category_id: string
}
export default function SimilarProducts({ category_id, product_id }: Props) {
  const queryConfig: ProductListConfig = { limit: '10', page: '1', category_id: category_id }
  const { data: listProduct } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000
  })
  return (
    <div className='mt-1 p-4 shadow bg-white rounded-lg'>
      <div className='rounded bg-gray-50 p-4 text-lg capitalize'>Sản phẩm tương tự</div>
      <div className='mx-4 mt-5 mb-4 text-sm leading-loose'>
        {listProduct && (
          <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5'>
            {listProduct.data.result.products.map((product) => {
              if (product._id !== product_id) {
                return (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                )
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}

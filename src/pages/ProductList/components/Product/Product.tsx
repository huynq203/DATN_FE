import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { paths } from 'src/constants'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId, rateSale } from 'src/utils/utils'
interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <>
      <Link to={`${paths.Screens.PRODUCT}/${generateNameId({ name: product.slug, id: product._id })}`}>
        <div className='shadow rounded-sm hover:translate-y-[-0.1rem] hover:shadow-md border transition-transform duration-200  overflow-hidden group'>
          <div className='w-[100%] pt-[100%] relative z-1'>
            <img
              src={product.url_images.length > 0 ? product.url_images[0].url : ''}
              alt={product.name}
              className='absolute top-0 left-0 w-full h-full object-cover'
            />
          </div>

          <div className='p-2 overflow-hidden'>
            <div className='my-2 min-h-[1.75rem] line-clamp-2 text-sm'>{product.name}</div>
            <div className='flex flex-col my-2 min-h-[1.75rem] text-sm text-gray-500'>
              <div className='flex items-center '>
                {product.promotion_price > 0 && (
                  <>
                    <div className='text-red-500 truncate text-lg'>
                      <span className=''>₫{formatCurrency(product.promotion_price)}</span>
                    </div>
                    <div className='ml-1 mr-3 rounded-sm bg-red-200/90 px-1 py-[2px] text-[10px] uppercase text-red-500'>
                      {rateSale(product.price, product.promotion_price)}
                    </div>
                  </>
                )}
                <div
                  className={`${product.promotion_price > 0 ? 'line-through text-gray-500 text-xs' : 'text-lg'} max-w-[50%] text-black truncate`}
                >
                  ₫{formatCurrency(product.price)}
                </div>
              </div>
              <span>
                <span>Lượt xem: {formatNumberToSocialStyle(product.view)}</span> | <span className='ml-1'>Đã bán</span>
                <span className='ml-1 mr-3'>{formatNumberToSocialStyle(product.sold)}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

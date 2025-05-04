import React from 'react'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { paths } from 'src/constants'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'
interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <>
      <Link to={`${paths.Screens.PRODUCT}/${generateNameId({ name: product.slug, id: product._id })}`}>
        <div className='bg-gray-100 shadow rounded-sm hover:translate-y-[-0.1rem] hover:shadow-md border hover:border-red-500 transition-transform duration-200 font-sans '>
          <div className='w-full pt-[100%] relative'>
            <img
              src={product.url_images.length > 0 ? product.url_images[0].url : ''}
              alt={product.name}
              className='absolute top-0 left-0 w-full h-full object-cover'
            />
          </div>
          <div className='p-2 overflow-hidden'>
            <div className='my-2 min-h-[1.75rem] line-clamp-2 text-sm'>{product.name}</div>
          </div>
          <div className='flex items-center mt-1'>
            <div className={`${product.promotion_price > 0 ? 'line-through' : ''} max-w-[50%] text-black truncate`}>
              đ {formatCurrency(product.price)}
            </div>
            {product.promotion_price > 0 && (
              <>
                <div className='text-red-500 truncate ml-3'>
                  <span className='text-sm'>đ</span>
                  <span className='ml-1'>{product.promotion_price}</span>
                </div>
              </>
            )}
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <div className='flex items-center'>
              <svg viewBox='0 0 9.5 8' className='h-3 w-3'>
                <defs>
                  <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                    <stop offset={0} stopColor='#ffca11' />
                    <stop offset={1} stopColor='#ffad27' />
                  </linearGradient>
                  <polygon
                    id='ratingStar'
                    points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                  />
                </defs>
                <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                  <g transform='translate(-876 -1270)'>
                    <g transform='translate(155 992)'>
                      <g transform='translate(600 29)'>
                        <g transform='translate(10 239)'>
                          <g transform='translate(101 10)'>
                            <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span className='ml-1 text-xs'>3.4</span>
            </div>
            <div className=' ml-1 text-xs text-end'>
              <span className='ml-1'>Đã bán</span>
              <span className='ml-1'>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

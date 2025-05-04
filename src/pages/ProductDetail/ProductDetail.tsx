import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId } from 'src/utils/utils'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useState } from 'react'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import classNames from 'classnames'
import Product from '../ProductList/components/Product'

export default function ProductDetail() {
  const { nameId } = useParams()
  const product_id = getIdFromNameId(nameId as string)
  const { data: ProductDetail } = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => productApi.getProductDetail(product_id as string),
    staleTime: 3 * 60 * 1000
  })

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const [activeSize, setActiveSize] = useState(0)
  const product = ProductDetail?.data.result
  const currentImages = useMemo(
    () => (product ? product.url_images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const queryConfig: ProductListConfig = { limit: '10', page: '1', category_id: product?.category_id[0]._id }
  const { data: listProduct } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  useEffect(() => {
    if (product && product.url_images.length > 0) {
      setActiveImage(product.url_images[0].url)
    }
  }, [product])

  const chooseActiveImage = (image: string) => {
    setActiveImage(image)
  }
  const chooseActiveSize = (size: number) => {
    setActiveSize(size)
  }
  const next = () => {
    if (currentIndexImages[1] < (product as ProductType)?.url_images.length) {
      setCurrentIndexImages((next) => [next[0] + 1, next[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-2 font-sans'>
      <Helmet>
        <title>{product.name}</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>

      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-4'>
              <div className='relative w-full pt-[100%] shadow'>
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 w-full h-full object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-t-1/2 bg-black/20 text-white hover:text-black'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img.url === activeImage
                  return (
                    <div
                      className=' relative w-full pt-[100%]'
                      key={img.url}
                      onMouseEnter={() => chooseActiveImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={product.name}
                        className='absolute top-0 left-0 w-full h-full cursor-pointer object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-black' />}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-t-1/2 bg-black/20 text-white hover:text-black'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-8'>
              <h1 className='text-xl font-sans uppercase font-bold'>
                {product.promotion_price > 0 ? '[Giảm giá]' : ''} {product.name}{' '}
              </h1>
              <div className='mt-5 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-black text-red-500'>3.7</span>
                  <ProductRating rating={3.7} />
                  <div className='mx-2 h-4 w-[1px] bg-black'></div>
                  <div>
                    <span className='border-b border-b-black'>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1'>Đã bán</span>
                  </div>
                  <div className='mx-2 h-4 w-[1px] bg-black'></div>
                  <div>
                    <span className='border-b border-b-black'>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1'>Đánh giá</span>
                  </div>
                </div>
              </div>
              <div className='mt-8 flex items-center pl-5 text-lg'>
                <span>Loại: {product.category_id[0].name}</span>
              </div>
              <div className='mt-5 flex items-center  px-5 py-4 text-lg'>
                <span>Giá bán: </span>
                <div className={` ml-5 ${product.promotion_price > 0 ? 'text-gray-400 line-through' : 'text-black'}`}>
                  {formatCurrency(product.price)} VNĐ
                </div>
                {product.promotion_price > 0 && (
                  <>
                    <div className='ml-5 text-red-600 text-3xl'>{formatCurrency(product.promotion_price)} VNĐ</div>
                  </>
                )}
              </div>
              <div className='mt-5 flex items-center  pl-5'>
                <span className='text-lg'>Kích thước: </span>
                {Array.isArray(product.sizes) &&
                  product.sizes.map((item) => {
                    const isActiveSize = item.size_name === activeSize
                    return (
                      <button
                        key={item._id}
                        className={classNames(
                          'ml-3 px-5 py-2 flex items-center justify-center rounded-sm border border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500',
                          {
                            'text-red-500 border-red-500': isActiveSize
                          }
                        )}
                        onMouseEnter={() => chooseActiveSize(item.size_name)}
                      >
                        {item.size_name}
                      </button>
                    )
                  })}
              </div>
              <div className='mt-5 flex items-center text-lg pl-5'>
                <span className=' text-black'>Số lượng</span>
                <div className='ml-10 flex items-center'>
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path stroke-linecap='round' stroke-linejoin='round' d='M5 12h14' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    classNameError='hidden'
                    classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path stroke-linecap='round' stroke-linejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-8 text-sm text-gray-500'>Hàng còn: {product.stock}</div>
              </div>
              <div className='mt-5 pl-5 flex items-center'>
                <button className='flex h-12 items-center justify-center rounded-sm border border-green-600 bg-green-600 text-white shadow-sm hover:bg-green-600/90'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-6 ml-4 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  <span className='mr-2'>Thêm vào giỏ hàng</span>
                </button>
                <button className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange-600 px-5 capitalize text-white shadow-sm outline-none hover:bg-orange-600/90'>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className=' bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-5 mb-4 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description.replace(/\n/g, '<br>')) }} />
          </div>
        </div>
      </div>

      <div className='container'>
        <div className=' bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize'>Đánh giá sản phẩm</div>
          <div className='mx-4 mt-5 mb-4 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          </div>
        </div>
      </div>
      <div className='container'>
        <div className=' bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize'>Sản phẩm tương tự</div>
          <div className='mx-4 mt-5 mb-4 text-sm leading-loose'>
            {listProduct && (
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
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
      </div>
    </div>
  )
}

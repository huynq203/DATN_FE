import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'

import { useState } from 'react'
import classNames from 'classnames'

import QuantityController from 'src/components/QuantityController'
import cartApi from 'src/apis/cart.api'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'

import { paths } from 'src/constants'
import { CartStatus } from 'src/constants/enum'
import ImageProduct from './components/ImageProduct'
import CommentProduct from './components/CommentProduct'
import DescriptionProduct from './components/DescriptionProduct'
import SimilarProducts from './components/SimilarProducts'
import rateApi from 'src/apis/ratings.api'
import { RatingRes } from 'src/types/ratings.type'
import Button from 'src/components/Button'
import { Tooltip } from 'antd'
import wishListApi from 'src/apis/wishlist.api'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const [sizeName, setSizeName] = useState(0)
  const [colorName, setColorName] = useState('')
  const [stock, setStock] = useState<number | null>(null)
  const [activeFlagSize, setActiveFlagSize] = useState(0)
  const [activeFlagColor, setActiveFlagColor] = useState('')
  const [imageVariantColor, setImageVariantColor] = useState('')
  const [listImageVariantColor, setListImageVariantColor] = useState<string[]>([])
  console.log(imageVariantColor)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const product_id = getIdFromNameId(nameId as string)
  const { data: ProductDetail } = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => productApi.getProductDetail(product_id as string),
    staleTime: 3 * 60 * 1000
  })
  const { data: RateData } = useQuery({
    queryKey: ['ratings', product_id],
    queryFn: () => rateApi.getRatingByProduct({ product_id: product_id as string })
  })
  const ratings = RateData?.data.result

  const product = ProductDetail?.data.result.product
  const inventories = ProductDetail?.data.result.inventories

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart
  })

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }
  const handleBuyColor = (value: string) => {
    const isSame = activeFlagColor === value
    if (isSame) {
      setActiveFlagColor('')
      setColorName('')
      setImageVariantColor('')
      setListImageVariantColor([])
      setStock(null)
    } else {
      setActiveFlagColor(value)
      setColorName(value)

      if (sizeName !== 0) {
        updateStock(value, sizeName.toString())
      }
    }
  }
  const handleBuySize = (value: number) => {
    const isSame = activeFlagSize === value
    if (isSame) {
      setActiveFlagSize(0)
      setSizeName(1)
      setImageVariantColor('')
      setListImageVariantColor([])
      setStock(null)
    } else {
      setActiveFlagSize(value)
      setSizeName(value)

      if (colorName) {
        updateStock(colorName, value.toString())
      }
    }
  }

  const updateStock = (color: string, size: string) => {
    if (!color || !size) {
      setStock(null)
      setImageVariantColor('')
      return
    }
    const result = inventories?.find((item) => item.color === color && item.size.toString() === size)
    setStock(result ? result.stock : null)
    setImageVariantColor(result?.image_variant_color[0].url || '')
    setListImageVariantColor(result?.image_variant_color.map((item) => item.url) || [])
  }

  const uniqueColors = Array.from(new Set(inventories?.map((item) => item.color)))
  const uniqueSizes = Array.from(new Set(inventories?.map((item) => item.size))).sort((a, b) => a - b)

  const handleAddToCart = () => {
    if (sizeName === 0) {
      toast.error(MESSAGE.PLEASE_CHOOSE_SIZE, { autoClose: 1000 })
      return
    }
    if (colorName === '') {
      toast.error(MESSAGE.PLEASE_CHOOSE_COLOR, { autoClose: 1000 })
      return
    }
    const variant = inventories?.find((item) => item.color === colorName && item.size === sizeName)
    if (!variant) {
      toast.error(MESSAGE.PRODUCT_NOT_AVAILABLE, { autoClose: 1000 })
      return
    }
    addToCartMutation.mutate(
      {
        product_id: product_id,
        size: sizeName,
        color: colorName,
        cost_price: inventories?.find(
          (item) => item.color === colorName && item.size.toString() === sizeName.toString()
        )?.cost_price as number,
        quantity: buyCount,
        image: listImageVariantColor[0] || ''
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message, { autoClose: 1000 })
          queryClient.invalidateQueries({ queryKey: ['cart', { status: CartStatus.InCart }] })
        },
        onError: (error) => {
          toast.error(MESSAGE.ADD_TO_CART_FAILED + error, { autoClose: 1000 })
        }
      }
    )
  }

  const handleBuyNow = async () => {
    if (sizeName === 0) {
      toast.error(MESSAGE.PLEASE_CHOOSE_SIZE, { autoClose: 1000 })
      return
    }
    if (colorName === '') {
      toast.error(MESSAGE.PLEASE_CHOOSE_COLOR, { autoClose: 1000 })
      return
    }
    // const variant = inventories?.find((item) => item.color === colorName && item.size === sizeName)
    // if (!variant) {
    //   toast.error(MESSAGE.PRODUCT_NOT_AVAILABLE, { autoClose: 1000 })
    //   return
    // }
    const res = await addToCartMutation.mutateAsync({
      product_id: product_id,
      size: sizeName,
      color: colorName,
      cost_price: inventories?.find((item) => item.color === colorName && item.size.toString() === sizeName.toString())
        ?.cost_price as number,
      quantity: buyCount,
      image: listImageVariantColor[0] || ''
    })
    const cart = res.data.result
    navigate(paths.Screens.CART, {
      state: {
        cartId: cart._id
      }
    })
  }

  const { data: wishListData, refetch } = useQuery({
    queryKey: ['wishlist', product_id],
    queryFn: () => wishListApi.getWishListByProduct({ product_id: product_id as string })
  })

  const wishListByProduct = wishListData?.data.result

  const changeFavoriteMutation = useMutation({
    mutationFn: wishListApi.changeWishListByProduct
  })
  const handleChangeFavorite = (productId: string) => {
    changeFavoriteMutation.mutate(
      { product_id: productId },
      {
        onSuccess: (res) => {
          console.log(res)
          refetch()
        },
        onError: (error) => {
          console.error('Lỗi khi cập nhật:', error)
        }
      }
    )
  }

  if (!product) return null
  const accessToken = localStorage.getItem('access_token')

  return (
    <div className='bg-gray-200 py-2 '>
      <Helmet>
        <title>{product.name}</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>
      <div className='container '>
        <div className='p-4 shadow bg-white rounded-lg'>
          <div className='grid grid-cols-12 gap-9'>
            <ImageProduct
              product={product}
              list_images_variant_color={listImageVariantColor}
              stock={stock as number}
              sizeName={sizeName}
              colorName={colorName}
            />
            <div className='col-span-8'>
              <div></div>
              <h1 className='text-xl  uppercase font-bold'>
                {product.promotion_price > 0 ? '[Giảm giá]' : ''} {product.name}{' '}
              </h1>

              <div className='mt-5 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-black text-red-500'>{ratings?.averageStar}</span>
                  <ProductRating rating={Number(ratings?.averageStar)} />
                  <div className='mx-2 h-4 w-[1px] bg-black'></div>
                  <div>
                    <span className='border-b border-b-black'>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-500'>Đã bán</span>
                  </div>
                  <div className='mx-2 h-4 w-[1px] bg-black'></div>
                  <div>
                    <span className='border-b border-b-black'>
                      {ratings?.totalRatings ? formatNumberToSocialStyle(Number(ratings?.totalRatings)) : 0}
                    </span>
                    <span className='ml-1 text-gray-500'>Đánh giá</span>
                  </div>
                  <div className='mx-2 h-4 w-[1px] bg-black'></div>
                  <div>
                    <Tooltip title='Thêm vào yêu thích'>
                      {wishListByProduct && wishListByProduct?.isFavorite === 1 ? (
                        <Button
                          onClick={() => handleChangeFavorite(product_id as string)}
                          className='ml-2 text-red-500'
                          title='Bỏ yêu thích'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                            className='size-6'
                          >
                            <path d='m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z' />
                          </svg>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleChangeFavorite(product_id as string)}
                          className='ml-2 '
                          title='Thêm vào yêu thích'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-6 h-6'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                            />
                          </svg>
                        </Button>
                      )}
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className='mt-3 flex items-center  bg-gray-50 px-5 py-4  font-semibold'>
                <div
                  className={` ml-1 ${product.promotion_price > 0 ? 'text-lg text-gray-500 line-through' : ' text-3xl text-black'}`}
                >
                  ₫{formatCurrency(product.price)}
                </div>
                {product.promotion_price > 0 && (
                  <>
                    <div className='ml-3 text-3xl font-medium text-red-600'>
                      ₫{formatCurrency(product.promotion_price)}
                    </div>
                    <div className='ml-4 rounded-sm bg-red-500 px-1 py-[2px] text-xs  uppercase text-white'>
                      {rateSale(product.price, product.promotion_price)} giảm
                    </div>
                  </>
                )}
              </div>
              <div className='mt-8 flex items-center pl-5 text-lg'>
                <span className='text-base font-semibold block mr-5'>Thương hiệu: </span>
                <span className=''>{product.category_id.name}</span>
              </div>
              <div className='mt-4 pl-5 flex '>
                <span className='text-base font-semibold block mb-3 mr-5'>Kích thước</span>
                <div className='grid grid-cols-5 gap-3 w-[320px] ml-5'>
                  {uniqueSizes.map((item) => {
                    const isFlagSize = item === activeFlagSize
                    return (
                      <button
                        key={item}
                        className={classNames('w-full h-10 rounded-md border text-sm font-medium transition-colors', {
                          'border-black text-black': isFlagSize,
                          'border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors duration-300':
                            !isFlagSize
                        })}
                        onClick={() => handleBuySize(item)}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className='mt-4 pl-5 flex'>
                <span className='text-base font-semibold block mb-3 mr-10'>Màu sắc</span>
                <div className='flex flex-wrap gap-3 w-[320px] ml-5'>
                  {uniqueColors.map((item) => {
                    const isFlagColor = item === activeFlagColor
                    return (
                      <button
                        key={item}
                        className={classNames(
                          'min-w-[60px] h-10 px-4 py-2 rounded-md border text-sm font-medium transition-colors',
                          {
                            'border-black text-black': isFlagColor,
                            'border-gray-300 text-gray-700 hover:border-black hover:text-black transition-colors duration-300':
                              !isFlagColor
                          }
                        )}
                        onClick={() => handleBuyColor(item)}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className='mt-5 pl-5'>
                <div className='flex items-center '>
                  <span className='text-base font-semibold text-black w-[80px]'>Số lượng</span>
                  <div className='flex items-center gap-1 ml-1'>
                    <QuantityController
                      max={10}
                      onDecrease={handleBuyCount}
                      onIncrease={handleBuyCount}
                      onType={handleBuyCount}
                      value={buyCount}
                    />

                    {sizeName !== 0 && colorName !== '' && (
                      <div className={`ml-2 text-sm ${stock && stock > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                        {stock && stock > 0 ? `${stock} sản phẩm có sẵn` : 'Hết hàng'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='mt-5 pl-5 flex items-center'>
                {accessToken ? (
                  <div className='flex items-center'>
                    <button
                      className='flex h-12 items-center justify-center rounded-md border border-gray-300  text-black shadow-sm hover:border-black transition-colors duration-300'
                      onClick={handleAddToCart}
                      disabled={stock === 0 || stock === null}
                    >
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
                    <button
                      className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-md bg-black px-5 capitalize text-white shadow-sm outline-none hover:bg-gray-500 trasition-colors duration-300'
                      onClick={handleBuyNow}
                      disabled={stock === 0 || stock === null}
                    >
                      Mua ngay
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link
                      className='flex h-12 items-center justify-center rounded-sm border border-gray-300 text-black shadow-sm hover:border-black transition-colors duration-300'
                      to={paths.Screens.AUTH_LOGIN}
                    >
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
                    </Link>
                    <Link
                      className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-md bg-black px-5 capitalize text-white shadow-sm outline-none hover:bg-gray-500 trasition-colors duration-300'
                      onClick={handleBuyNow}
                      to={paths.Screens.AUTH_LOGIN}
                    >
                      Mua ngay
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DescriptionProduct product={product} />
        <CommentProduct listRatings={ratings?.listRatings as RatingRes[]} totalRatings={ratings?.totalRatings} />
        <SimilarProducts product_id={product._id} category_id={product.category_id._id} />
      </div>
    </div>
  )
}

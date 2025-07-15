import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import cartApi from 'src/apis/cart.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { paths } from 'src/constants'
import { CartStatus } from 'src/constants/enum'
import { formatCurrency, generateNameId, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import voucherApi from 'src/apis/voucher.api'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'

export default function Cart() {
  const { extendedCarts, setExtendedCarts, profile } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [codeVoucher, setCodeVoucher] = useState<string>('')
  const navigate = useNavigate()

  const { data: CartData, refetch } = useQuery({
    queryKey: ['cart', { status: CartStatus.InCart }],
    queryFn: () => cartApi.getCart({ status: CartStatus.InCart })
  })

  const updateCartMutation = useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: () => {
      refetch()
    }
  })

  const deleteCartMutation = useMutation({
    mutationFn: cartApi.deleteCart,
    onSuccess: () => {
      refetch()
    }
  })

  const location = useLocation()
  const choosenCartIdFromLocation = (location.state as { cartId: string } | null)?.cartId
  const productInCart = CartData?.data.result
  //Every phải là true hết khi có 1 item là false sẽ return false hết
  const isAllChecked = useMemo(() => extendedCarts.every((item) => item.checked), [extendedCarts])
  const checkedCarts = useMemo(() => extendedCarts.filter((item) => item.checked), [extendedCarts])
  const checkedCartsCount = checkedCarts.length
  const totalCheckedCartPrice = useMemo(
    () =>
      checkedCarts.reduce((result, current) => {
        return (
          result +
          (current.product_id.promotion_price > 0 ? current.product_id.promotion_price : current.product_id.price) *
            current.quantity
        )
      }, 0),
    [checkedCarts]
  )
  const totalAfterDiscountPrice = useMemo(() => {
    return totalCheckedCartPrice - discount
  }, [totalCheckedCartPrice, discount])
  const totalCheckedCartServingPrice = useMemo(
    () =>
      checkedCarts.reduce((result, current) => {
        return (
          result +
          (current.product_id.promotion_price > 0
            ? current.product_id.price * current.quantity - current.product_id.promotion_price * current.quantity
            : 0)
        )
      }, 0),
    [checkedCarts]
  )
  const TotalDiscount = useMemo(() => {
    return totalCheckedCartServingPrice + discount
  }, [totalCheckedCartServingPrice, discount])
  useEffect(() => {
    setExtendedCarts((prev) => {
      const extendedCartsObject = keyBy(prev, '_id')
      return (
        productInCart?.carts.map((item) => {
          const isChoosenCartFromLocation = choosenCartIdFromLocation === item._id
          return {
            ...item,
            disabled: false,
            checked: isChoosenCartFromLocation || Boolean(extendedCartsObject[item._id]?.checked)
          }
        }) || []
      )
    })
  }, [productInCart, choosenCartIdFromLocation])

  const handleCheck = (cartIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedCarts(
      produce((draft) => {
        draft[cartIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedCarts((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (cartIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const cart = extendedCarts[cartIndex]
      setExtendedCarts(
        produce((draft) => {
          draft[cartIndex].disabled = true
        })
      )
      updateCartMutation.mutate({
        product_id: cart.product_id._id,
        size: cart.size,
        color: cart.color,
        quantity: value,
        cost_price: cart.cost_price
      })
    }
  }

  const handleDeleteCart = (cartIndex: number) => {
    const cartId = extendedCarts[cartIndex].product_id._id
    const cartSize = extendedCarts[cartIndex].size
    const cartColor = extendedCarts[cartIndex].color
    deleteCartMutation.mutate([{ product_id: cartId, size: cartSize, color: cartColor }])
  }

  const handleDeleteManyCart = () => {
    const cartIds = checkedCarts.map((item) => ({
      product_id: item.product_id._id,
      size: item.size,
      color: item.color
    }))
    deleteCartMutation.mutate(cartIds)
  }

  const handleTypeQuantity = (cartIndex: number) => (value: number) => {
    setExtendedCarts(
      produce((draft) => {
        draft[cartIndex].quantity = value
      })
    )
  }

  const handleBuyCart = () => {
    if (profile?.verify === 0) {
      toast.error('Vui lòng xác thực tài khoản trước khi mua hàng')
    } else {
      if (checkedCarts.length > 0) {
        const body = checkedCarts.map((item) => ({
          _id: item._id,
          product_id: item.product_id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          cost_price: item.cost_price,
          image: item.image
        }))
        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          navigate(paths.Screens.CHECKOUT, {
            state: { buyProducts: body, totalAfterDiscountPrice, TotalDiscount, codeVoucher }
          })
        }, 3000)
      }
    }
  }

  const saveVoucherMutation = useMutation({
    mutationFn: voucherApi.saveVoucher
  })

  const handleSaveVoucher = () => {
    if (checkedCarts.length > 0) {
      saveVoucherMutation.mutate(
        { code },
        {
          onSuccess: (data) => {
            toast.success(data.data.message, { autoClose: 1000 })
            setDiscount(Number(data.data.result))
            setCodeVoucher(code)
          },
          onError: (error) => {
            if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
              const formError = error.response?.data.errors
              if (formError) {
                Object.keys(formError).forEach((key) => {
                  toast.error(formError[key].msg, { autoClose: 1000 })
                })
              }
            } else {
              toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
            }
          }
        }
      )
    }
  }
  return (
    <div className='bg-neutral-100'>
      <Helmet>
        <title>Giỏ hàng</title>
        <meta name='description' content='Giỏ hàng Yoyo' />
      </Helmet>

      <div className='container'>
        {extendedCarts.length > 0 ? (
          <div className='py-5'>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize  shadow'>
                  <div className='col-span-6 '>
                    <div className='flex items-center '>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-black'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center text-gray-500'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-1 rounded-sm bg-white p-5 shadow'>
                  {extendedCarts?.map((item, index) => (
                    <div
                      key={item._id}
                      className='grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm first:mt-0 mt-1 '
                    >
                      <div className=' col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-black mt-1'
                              checked={item.checked}
                              onChange={handleCheck(index)}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                to={`${paths.Screens.PRODUCT}/${generateNameId({ name: item.product_id.slug, id: item.product_id._id })}`}
                                className='h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md  hover:opacity-80 transition-opacity duration-200 mr-3'
                              >
                                <img src={item.image} alt='Image' className='rounded-md ' />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2 text-left'>
                                <Link
                                  to={`${paths.Screens.PRODUCT}/${generateNameId({ name: item.product_id.slug, id: item.product_id._id })}`}
                                  className='line-clamp-2'
                                >
                                  {item.product_id.name}
                                </Link>
                                <div className='text-gray-600'>
                                  <span className='text-sm'>Size:</span>
                                  <span className='ml-2 text-sm'>{item.size}</span>
                                </div>
                                <div className='text-gray-600'>
                                  <span className='text-sm'>Màu sắc:</span>
                                  <span className='ml-2 text-sm'>{item.color}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6 mt-7'>
                        <div className='grid grid-cols-5 text-center'>
                          <div className=' col-span-2'>
                            <div className='flex items-center justify-center mt-1'>
                              {item.product_id.promotion_price > 0 ? (
                                <>
                                  <span className='line-through text-gray-500'>
                                    ₫{formatCurrency(item.product_id.price)}
                                  </span>
                                  <span className='ml-5 '>₫{formatCurrency(item.product_id.promotion_price)}</span>
                                </>
                              ) : (
                                <span>₫{formatCurrency(item.product_id.price)}</span>
                              )}
                            </div>
                          </div>
                          <div className='col-span-1 '>
                            <QuantityController
                              max={10}
                              value={item.quantity as number}
                              classNameWrapper='flex items-center'
                              onIncrease={(value) => handleQuantity(index, value, value <= 10)}
                              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                              onType={handleTypeQuantity(index)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value >= 1 && value <= 10 && value !== productInCart?.carts[index]?.quantity
                                )
                              }
                              disabled={item.disabled}
                            />
                          </div>
                          {item.product_id.promotion_price > 0 ? (
                            <div className='col-span-1 mt-1 text-red-500'>
                              ₫{formatCurrency(item.product_id.promotion_price * item.quantity)}
                            </div>
                          ) : (
                            <div className='col-span-1 mt-1 text-red-500'>
                              ₫{formatCurrency(item.product_id.price * item.quantity)}
                            </div>
                          )}

                          <div className='col-span-1'>
                            <button onClick={() => handleDeleteCart(index)} className='bg-none  hover:text-red-500'>
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 border border-gray-300 mt-5 '>
              <div className='flex flex-col sm:flex-row bg-white px-3 py-2'>
                <span className='mt-2'>Mã giảm giá:</span>
                <input
                  type='text'
                  className='border border-gray-500 px-1 outline-none ml-5 mt-2 sm:mt-0 rounded-md'
                  placeholder='Nhập mã giảm giá'
                  name='code'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  className='ml-5 px-2 py-2 bg-red-500 text-white rounded-md flex flex-col sm:flex-row mt-2 sm:mt-0'
                  onClick={handleSaveVoucher}
                  disabled={checkedCarts.length === 0}
                >
                  Áp dụng
                </Button>
              </div>
              <div className='border border-t-gray-300'></div>
              <div className=' flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-2 shadow '>
                <div className='flex -mt-20 ml-3'>
                  <div className='flex flex-shrink-0 pr-3'>
                    <input
                      type='checkbox'
                      className='h-6 w-6 accent-black ml-5'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <button className='mx-3 border-none bg-none ' onClick={handleCheckAll}>
                    Chọn tất cả ({extendedCarts.length})
                  </button>
                  <button onClick={handleDeleteManyCart} className='mx-3 border-none bg-none '>
                    Xóa
                  </button>
                </div>

                <div className='ml-auto mt-5 sm:mt-0 flex flex-col sm:flex-row items-center'>
                  <div>
                    <div className='flex justify-between items-center mb-2'>
                      <div className='text-base'>Tổng thanh toán ({checkedCartsCount} sản phẩm):</div>
                      <div className='text-2xl text-black font-semibold ml-3'>
                        {checkedCartsCount > 0 ? `${formatCurrency(totalCheckedCartPrice)} ₫` : '₫0'}
                      </div>
                    </div>
                    <div className='flex justify-between items-center text-sm mb-1'>
                      <div className='text-gray-500'>Giảm giá</div>
                      <div className='text-red-600'>
                        {checkedCartsCount > 0 ? `${formatCurrency(discount)} ₫` : '0₫'}
                      </div>
                    </div>
                    <div className='flex justify-between items-center text-sm mb-4'>
                      <div className='text-gray-500'>Tiết kiệm</div>
                      <div className='text-red-600'>
                        {checkedCartsCount > 0 ? `₫${formatCurrency(TotalDiscount)} ₫` : '0₫'}
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <Button
                        className='ml-5 mt-5 sm:mt-0 h-10  w-52 uppercase text-white bg-red-500 text-sm hover:bg-red-600 rounded-xl flex items-center justify-center'
                        onClick={handleBuyCart}
                        disabled={checkedCarts.length === 0}
                        loading={isLoading}
                      >
                        Mua hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-[500px]'>
            <div className='text-2xl text-gray-400'>Giỏ hàng trống</div>
          </div>
        )}
      </div>
    </div>
  )
}

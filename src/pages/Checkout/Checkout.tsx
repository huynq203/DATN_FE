import React, { use, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from '../Loading'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { formatCurrency } from 'src/utils/utils'
import { Product } from 'src/types/product.type'
import { Cart } from 'src/types/cart.type'
import { Customer } from 'src/types/customer.type'

interface CheckoutState {
  buyProducts: Cart[]
  totalCheckedCartPrice: number
  totalCheckedCartServingPrice: number
}

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { buyProducts, totalCheckedCartPrice, totalCheckedCartServingPrice } = location.state as CheckoutState
  const getProfile = localStorage.getItem('profile')
  const profile = JSON.parse(getProfile || '{}') as Customer

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  })
  return (
    <div className='bg-neutral-100 '>
      <Helmet>
        <title>Thanh toán</title>
        <meta name='description' content='Thanh toán Yoyo' />
      </Helmet>
      <div className='container'>
        {buyProducts && (
          <div className='py-5'>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize  shadow'>
                  <div className='col-span-12'>
                    <div className='flex-col items-center '>
                      <div className='flex flex-row text-black'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke-width='1.5'
                          stroke='currentColor'
                          className='h-5 w-5'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                          />
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
                          />
                        </svg>
                        <span>Địa chỉ nhận hàng</span>
                      </div>
                      <div className='flex flex-row text-black  ml-5 mt-3'>
                        <span className='font-bold'>{profile.name}</span>
                        <span className='ml-2 font-bold'>+84({profile.phone})</span>
                        <select className='ml-5' name='' id=''>
                          {profile.addresses.length > 1 &&
                            profile.addresses.map((item) => <option value={item.address}>{item.address}</option>)}
                        </select>
                        <span className='ml-3 border border-red-500 text-xs text-red-500'>Mặc định</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className='col-span-6'>
                    <div className='grid grid-cols-6 text-center text-gray-500'>
                      <div className='col-span-2'>{profile.name}</div>
                      <div className='col-span-2'>2</div>
                      <div className='col-span-2'>3</div>
                    </div>
                  </div> */}
                </div>

                <div className='my-1 rounded-sm bg-white p-5 shadow'>
                  {buyProducts.map((item) => (
                    <div
                      key={item._id}
                      className='grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm first:mt-0 mt-1 '
                    >
                      <div className=' col-span-6'>
                        <div className='flex'>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <div className='h-20 w-20 flex-shrink-0 ml-5'>
                                <img
                                  src={item.product_id.url_images?.[0]?.url}
                                  alt='Image'
                                  className='rounded-md object-cover'
                                />
                              </div>
                              <div className='flex-grow px-2 pt-1 pb-2 text-left'>
                                <div className='line-clamp-2'>{item.product_id.name}</div>
                                <div className='text-gray-600'>
                                  <span className='text-sm'>Size:</span>
                                  <span className='ml-2 text-sm'>{item.size}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6 mt-7'>
                        <div className='grid grid-cols-6 text-center'>
                          <div className=' col-span-2'>
                            <div className='flex items-center justify-center mt-1'>
                              {item.product_id.promotion_price > 0 ? (
                                <span className=''>₫{formatCurrency(item.product_id.promotion_price)}</span>
                              ) : (
                                <span>₫{formatCurrency(item.product_id.price)}</span>
                              )}
                            </div>
                          </div>
                          <div className='col-span-2'>{item.quantity}</div>

                          {item.product_id.promotion_price > 0 ? (
                            <div className='col-span-2 mt-1 text-red-500'>
                              ₫{formatCurrency(item.product_id.promotion_price * item.quantity)}
                            </div>
                          ) : (
                            <div className='col-span-2 mt-1 text-red-500'>
                              ₫{formatCurrency(item.product_id.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 border border-gray-300'>
              <div className=' flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-5 shadow'>
                <div className='ml-auto mt-5 sm:mt-0 flex flex-col sm:flex-row items-center'>
                  <div>
                    <div className='flex items-center justify-end'>
                      <div>Tổng thanh toán ({buyProducts.length} sản phẩm):</div>
                      <div className='ml-2 text-2xl text-orange-600'>₫{formatCurrency(totalCheckedCartPrice)}</div>
                    </div>
                  </div>
                  <Button className='ml-5 mt-5 sm:mt-0 h-10  w-52 uppercase text-white bg-red-500 text-sm hover:bg-red-600 rounded-xl flex items-center justify-center'>
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

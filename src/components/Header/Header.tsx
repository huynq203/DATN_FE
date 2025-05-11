import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { paths, resources } from 'src/constants'

import Popover from '../Popover'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { MdMail } from 'react-icons/md'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import cartApi from 'src/apis/cart.api'
import { formatCurrency, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import Menu from '../Menu'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'

import { CartStatus } from 'src/constants/enum'
import NavHeader from '../NavHeader'
type FormData = Pick<Schema, 'search_name'>
const nameSearchSchema = schema.pick(['search_name'])
export default function Header() {
  const queryConfig = useQueryConfig()

  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      search_name: ''
    },
    resolver: yupResolver(nameSearchSchema)
  })
  const toggleMobileMenu = () => {
    alert('toggleMobileMenu')
  }

  //Khi chuyển trang header thì header chỉ bị re-render
  //Chứ không bị unmout - mouting again
  //Tất nhiên là trừ trường hợp logout ròi nhảy sang RegisterHeader sẽ bị gọi lại
  //nên các query này sẽ không bị inactive => Không bị gọi lại => Không cần thiết phải set stale : Infinity
  const { data: CartData } = useQuery({
    queryKey: ['cart', { status: CartStatus.InCart }],
    queryFn: () => cartApi.getCart({ status: CartStatus.InCart })
  })
  const cartDataByCustomer = CartData?.data.result

  const onSubmitSearch = handleSubmit((data) => {
    navigate({
      pathname: paths.Screens.PRODUCT,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.search_name
          },
          ['order', 'sort_by', 'category_id']
        )
      ).toString()
    })
  })

  return (
    <>
      <header className='w-full top-0 fixed z-10'>
        <NavHeader />
        <div className='bg-white border-b-2'>
          <div className='container'>
            <div className=' text-black'>
              <nav className='flex items-center bg-w lg:py-1 '>
                <div className='flex lg:flex'>
                  <Link to='/'>
                    {/* <span className='sr-only'>Your Company</span> */}
                    <img alt='YoYo' src={resources.Images.APP_LOGO} className='h-[80px] w-[200px] items-center' />
                  </Link>
                </div>
                <div className='flex lg:hidden'>
                  <button className='search-btn text-black'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='size-5'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                      />
                    </svg>
                  </button>
                  <button
                    type='button'
                    onClick={toggleMobileMenu}
                    className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
                  >
                    <span className='sr-only'>Open main menu</span>
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7' />
                    </svg>
                  </button>
                </div>
                <Menu />
                <div className='hidden lg:flex lg:justify-end my-2 ml-24'>
                  <div className=' flex items-center space-x-4'>
                    <form className='flex items-center w-full max-w-xs' onSubmit={onSubmitSearch}>
                      <input
                        type='text'
                        className='text-black px-3 py-2 flex-grow border-none outline-none '
                        placeholder='Tìm kiếm sản phẩm'
                        aria-label='Search'
                        {...register('search_name')}
                      />
                      <button className='search-btn'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke-width='1.5'
                          stroke='currentColor'
                          className='h-6 w-6 hover:text-red-500'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                          />
                        </svg>
                      </button>
                    </form>
                    <Link to={paths.Screens.CART}>
                      <div className='hover:text-red-500 relative col-span-1 justify-self-start'>
                        <Popover
                          className=''
                          classNameSpan='border-x-transparent border-t-transparent border-b-black border-[11px] absolute z-10 -translate-y-4'
                          children={
                            <>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke-width='1.5'
                                stroke='currentColor'
                                className='h-6 w-6'
                              >
                                <path
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                                />
                              </svg>
                            </>
                          }
                          renderPopover={
                            <div className='bg-white relative shadow-md rounded-sm border border-gray-200 text-left mt-1 max-w-[400px] text-sm'>
                              {cartDataByCustomer ? (
                                <div className='p-2'>
                                  <div className='text-gray-400 capitalize'>Sản phẩm mới thêm</div>
                                  <div className='mt-5'>
                                    {cartDataByCustomer.carts.slice(0, 5).map((item) => (
                                      <div className='mt-1 flex hover:bg-gray-100' key={item._id}>
                                        <div className='flex-shrink-0'>
                                          <img
                                            src={item.product_id.url_images?.[0]?.url}
                                            alt='Image'
                                            className='w-16 h-16 rounded-md object-cover'
                                          />
                                        </div>
                                        <div className='flex flex-col overflow-hidden'>
                                          <div className='ml-2 '>
                                            <div className='truncate'>{item.product_id.name}</div>
                                          </div>
                                          <div className='ml-2'>
                                            <div className='truncate '>Size: {item.size}</div>
                                          </div>
                                        </div>
                                        <div className='ml-5 text-right flex-shrink-0'>
                                          <span className='text-red-600'>
                                            ₫
                                            {item.product_id.promotion_price > 0
                                              ? formatCurrency(item.product_id.promotion_price)
                                              : formatCurrency(item.product_id.price)}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className='flex mt-6 items-center justify-between'>
                                    <span className=''>
                                      {cartDataByCustomer.carts.slice(0, 5).length} Thêm hàng vào giỏ
                                    </span>
                                    <Link
                                      to='/cart'
                                      className='capitalize bg-red-600 hover:bg-red-700 text-white  px-4 py-2 rounded-sm'
                                    >
                                      Xem giỏ hàng
                                    </Link>
                                  </div>
                                </div>
                              ) : (
                                <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                                  <span className='font-bold'>Giỏ hàng trống</span>
                                </div>
                              )}
                            </div>
                          }
                        />
                        <div className='absolute ml-3  -top-2 text-xs text-red-700'>
                          {cartDataByCustomer?.total_cart && (
                            <div className='px-[7px] py-[1px] bg-red-200 rounded-md items-center'>
                              {cartDataByCustomer?.total_cart}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

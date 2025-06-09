import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { paths, resources } from 'src/constants'

import Popover from '../Popover'

import { useQuery } from '@tanstack/react-query'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit, set } from 'lodash'
import cartApi from 'src/apis/cart.api'
import { formatCurrency } from 'src/utils/utils'
import Menu from '../Menu'

import { CartStatus } from 'src/constants/enum'
import NavHeader from '../NavHeader'
import { Button, Drawer, DrawerProps, Space } from 'antd'
import { useState } from 'react'
type FormData = Pick<Schema, 'search_name'>
const nameSearchSchema = schema.pick(['search_name'])
export default function Header() {
  const [open, setOpen] = useState(false)

  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      search_name: ''
    },
    resolver: yupResolver(nameSearchSchema)
  })
  const toggleMobileMenu = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
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
            key_search: data.search_name
          },
          ['order', 'sort_by', 'category_id']
        )
      ).toString()
    })
  })
  const navLinks = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Sản phẩm', to: paths.Screens.PRODUCT },
    { label: 'Giày Nam', to: paths.Screens.MEN },
    { label: 'Giày Nữ', to: paths.Screens.WOMEN },
    { label: 'Giới thiệu', to: paths.Screens.INTRODUCE },
    { label: 'Liên hệ', to: paths.Screens.CONTACT }
  ]

  return (
    <header className='w-full shadow-sm bg-white fixed z-10'>
      <NavHeader />
      <div className='max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16'>
        <div className='text-2xl font-semibold tracking-wide font-serif'>
          <Link to='/'>YoYo Store</Link>
        </div>

        <Menu />

        <div className='hidden sm:flex items-center space-x-6'>
          <form className='relative' onSubmit={onSubmitSearch}>
            <input
              type='text'
              placeholder='Tìm kiếm sản phẩm'
              className='border border-gray-300 hover:bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-700 focus:outline-none'
              {...register('search_name')}
            />
            <button
              type='submit'
              className=' absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black rounded-full hover:bg-gray-300'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6 pl-1'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                />
              </svg>
            </button>
          </form>
          <Link to={paths.Screens.CART}>
            <div className=' relative col-span-1 justify-self-start hover:bg-gray-300 rounded-full'>
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
                    <div className='absolute ml-3  -top-2 text-xs text-red-700'>
                      {cartDataByCustomer?.total_cart && (
                        <div className='absolute  bg-red-300 text-red-800 text-xs font-semibold px-1.5 py-0.5 rounded-full'>
                          {cartDataByCustomer?.total_cart}
                        </div>
                      )}
                    </div>
                  </>
                }
                renderPopover={
                  <div className='bg-white relative shadow-md rounded-sm border border-gray-200 text-left mt-1 max-w-[400px] text-sm  '>
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
                          <span className=''>{cartDataByCustomer.carts.slice(0, 5).length} Thêm hàng vào giỏ</span>
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
            </div>
          </Link>
        </div>
        <div className='lg:hidden'>
          <button
            onClick={toggleMobileMenu}
            className='text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
            </svg>
          </button>
          <Drawer title='Menu' width={200} onClose={onClose} open={open}>
            <div className='flex flex-col gap-4'>
              {navLinks.map((link, index) => (
                <Button
                  className='block text-lg hover:font-bold transition-colors duration-200 border-none'
                  onClick={onClose}
                >
                  <Link key={index} to={link.to}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </Drawer>
        </div>
      </div>
    </header>
  )
}

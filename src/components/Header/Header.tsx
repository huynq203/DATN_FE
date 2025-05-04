import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import { paths, resources } from 'src/constants'

import Popover from '../Popover'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { MdMail } from 'react-icons/md'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
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

  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const toggleMobileMenu = () => {}
  const refresh_token = localStorage.getItem('refresh_token') || ''
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutCustomer({ refresh_token }),
    onSuccess: (res) => {
      toast.success(res.data.message)
      setIsAuthenticated(false)
      setProfile(null)
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
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
      <header className='w-full top-0 left-0'>
        <div className='bg-black'>
          <div className='container  '>
            <div className='flex justify-between items-center  text-white'>
              <div className=' items-center text-sm '>
                <div className='flex gap-x-2'>
                  <FaFacebookF className='capitalize hover:text-red-500 cursor-pointer text-lg' />
                  <FaYoutube className='capitalize hover:text-red-500 cursor-pointer text-lg' />
                  <FaInstagram className='capitalize hover:text-red-500 cursor-pointer text-lg' />
                  <MdMail className='capitalize hover:text-red-500 cursor-pointer text-lg' />
                </div>
              </div>
              <div className=' items-center py-2 m-2 mr-14'>
                <span className='items-center text-sm '>
                  Miễn Phí Giao Hàng Tiêu Chuẩn [Nội thành HCM từ 1.000.000đ - Khu Vực khác từ 1.100.000đ]
                </span>
              </div>
              <div className='flex'>
                <Popover
                  className='flex items-center py-2 m-1 mr-3 hover:text-gray-300 cursor-pointer h-full'
                  classNameSpan='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-10 -translate-y-6 '
                  children={
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke-width='1.5'
                        stroke='currentColor'
                        className='size-5 '
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                        />
                      </svg>
                      <span className=''>Tiếng Việt</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke-width='1.5'
                        stroke='currentColor'
                        className='size-5'
                      >
                        <path stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                      </svg>
                    </>
                  }
                  renderPopover={
                    <div className='bg-white relative shadow-md rounded-sm border text-gray-500 border-gray-200 -translate-x-10 -mt-1'>
                      <div className='flex flex-col '>
                        <button className='py-3 px-10 hover:text-black border-b-2  text-left font-sans'>
                          Tiếng Việt
                        </button>
                      </div>
                      <div className='flex flex-col'>
                        <button className='py-3 px-10 hover:text-black  text-left font-sans'>English</button>
                      </div>
                    </div>
                  }
                />
                {isAuthenticated ? (
                  <Popover
                    className='flex items-center hover:text-gray-300 cursor-pointer'
                    classNameSpan='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-10 -translate-y-7 '
                    children={
                      <>
                        <div className='w-6 h-6 mr-2 flex-shrink-0'>
                          <img
                            className='rounded-full object-cover '
                            src='https://down-vn.img.susercontent.com/file/vn-11134226-7ras8-m2vjvaq13agq13_tn'
                            alt='Avatar'
                          />
                        </div>
                        <span className=''>{profile?.name}</span>
                      </>
                    }
                    renderPopover={
                      <div className='bg-white relative shadow-md rounded-sm border border-gray-200 -translate-x-10 text-left -mt-2'>
                        <div className='flex flex-col'>
                          <Link
                            to={paths.Screens.PROFILE}
                            className='py-3 px-10 hover:bg-gray-200 border-b-2  hover:text-green-500 text-left font-sans'
                          >
                            Tài khoản của tôi
                          </Link>
                        </div>
                        <div className='flex flex-col'>
                          <Link
                            to={paths.Screens.CART}
                            className='py-3 px-10 hover:bg-gray-200 border-b-2  hover:text-green-500 text-left font-sans'
                          >
                            Đơn mua
                          </Link>
                        </div>
                        <div className='flex flex-col'>
                          <Link
                            to={paths.Screens.CHANGE_PASSWORD}
                            className='py-3 px-10 hover:bg-gray-200 border-b-2  hover:text-green-500 text-left font-sans'
                          >
                            Đổi mật khẩu
                          </Link>
                        </div>
                        <div className='flex flex-col'>
                          <button
                            onClick={handleLogout}
                            className='py-3 px-10 hover:bg-gray-200  hover:text-green-500 text-left font-sans'
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <div className='flex items-center '>
                    <Link to={paths.Screens.AUTH_LOGIN} className=' mx-2 hover:text-gray-300 cursor-pointer font-sans'>
                      Đăng nhập
                    </Link>
                    <div className='border-r-2 border-r-white h-4' />
                    <Link
                      to={paths.Screens.AUTH_REGISTER}
                      className=' mx-2 hover:text-gray-300 cursor-pointer font-sans'
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
                <div className='hidden lg:flex items-center justify-center mx-20 lg:gap-x-10 my-2 font-Josephin font-bold'>
                  <Link to='/' className='block  hover:text-red-500  font-sans text-lg'>
                    Trang chủ
                  </Link>
                  <Link to={paths.Screens.PRODUCT} className='block  hover:text-red-500 font-sans text-lg'>
                    Sản phẩm
                  </Link>
                  <Link to={paths.Screens.BLOG} className=' block hover:text-red-500 font-sans text-lg'>
                    Blog
                  </Link>
                  <Link to='/' className=' block hover:text-red-500 font-sans text-lg'>
                    Giới thiệu
                  </Link>
                  <Link to='/' className=' block hover:text-red-500 font-sans text-lg'>
                    Liên hệ
                  </Link>
                </div>
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
                          className='size-5 hover:opacity-90'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                          />
                        </svg>
                      </button>
                    </form>
                    <div className='col-span-1 justify-self-start'>
                      <Popover
                        className=' hover:text-red-500 cursor-pointer'
                        classNameSpan='border-x-transparent border-t-transparent border-b-black border-[11px] absolute z-10 -translate-y-4'
                        children={
                          <>
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
                                d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                              />
                            </svg>
                          </>
                        }
                        renderPopover={
                          <div className='bg-white relative shadow-md rounded-sm border border-gray-200 text-left mt-1 max-w-[400px] text-sm'>
                            <div className='p-2'>
                              <div className='text-gray-400 capitalize'>Sản phẩm mới thêm</div>
                              <div className='mt-5'>
                                <div className='mt-4 flex'>
                                  <div className='flex-shrink-0'>
                                    <img
                                      src='https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m8mrix6lofvy80_tn'
                                      alt='Image'
                                      className='w-16 h-16 rounded-md object-cover'
                                    />
                                  </div>
                                  <div className='flex-grow ml-2 overflow-hidden'>
                                    <div className='truncate '>
                                      Bộ Serum Glycolic Melasyl Kem dưỡng ngày đêm sáng mờ thâm nám L'Oreal Paris
                                      Glycolic
                                    </div>
                                  </div>
                                  <div className='ml-2 flex-shrink-0'>
                                    <span className='text-orange-600'>₫459.000</span>
                                  </div>
                                </div>
                                <div className='mt-4 flex'>
                                  <div className='flex-shrink-0'>
                                    <img
                                      src='https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m8mrix6lofvy80_tn'
                                      alt='Image'
                                      className='w-16 h-16 rounded-md object-cover'
                                    />
                                  </div>
                                  <div className='flex-grow ml-2 overflow-hidden'>
                                    <div className='truncate '>
                                      Bộ Serum Glycolic Melasyl Kem dưỡng ngày đêm sáng mờ thâm nám L'Oreal Paris
                                      Glycolic
                                    </div>
                                  </div>
                                  <div className='ml-2 flex-shrink-0'>
                                    <span className='text-orange-600'>₫459.000</span>
                                  </div>
                                </div>
                                <div className='mt-4 flex'>
                                  <div className='flex-shrink-0'>
                                    <img
                                      src='https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m8mrix6lofvy80_tn'
                                      alt='Image'
                                      className='w-16 h-16 rounded-md object-cover'
                                    />
                                  </div>
                                  <div className='flex-grow ml-2 overflow-hidden'>
                                    <div className='truncate '>
                                      Bộ Serum Glycolic Melasyl Kem dưỡng ngày đêm sáng mờ thâm nám L'Oreal Paris
                                      Glycolic
                                    </div>
                                  </div>
                                  <div className='ml-2 flex-shrink-0'>
                                    <span className='text-orange-600'>₫459.000</span>
                                  </div>
                                </div>
                                <div className='mt-4 flex'>
                                  <div className='flex-shrink-0'>
                                    <img
                                      src='https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m8mrix6lofvy80_tn'
                                      alt='Image'
                                      className='w-16 h-16 rounded-md object-cover'
                                    />
                                  </div>
                                  <div className='flex-grow ml-2 overflow-hidden'>
                                    <div className='truncate '>
                                      Bộ Serum Glycolic Melasyl Kem dưỡng ngày đêm sáng mờ thâm nám L'Oreal Paris
                                      Glycolic
                                    </div>
                                  </div>
                                  <div className='ml-2 flex-shrink-0'>
                                    <span className='text-orange-600'>₫459.000</span>
                                  </div>
                                </div>
                                <div className='mt-4 flex'>
                                  <div className='flex-shrink-0'>
                                    <img
                                      src='https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m8mrix6lofvy80_tn'
                                      alt='Image'
                                      className='w-16 h-16 rounded-md object-cover'
                                    />
                                  </div>
                                  <div className='flex-grow ml-2 overflow-hidden'>
                                    <div className='truncate '>
                                      Bộ Serum Glycolic Melasyl Kem dưỡng ngày đêm sáng mờ thâm nám L'Oreal Paris
                                      Glycolic
                                    </div>
                                  </div>
                                  <div className='ml-2 flex-shrink-0'>
                                    <span className='text-orange-600'>₫459.000</span>
                                  </div>
                                </div>
                              </div>
                              <div className='flex mt-6 items-center justify-between'>
                                <span className=''>1 Thêm hàng vào giỏ</span>
                                <Link
                                  to='/cart'
                                  className='capitalize bg-red-600 hover:bg-red-700 text-white  px-4 py-2 rounded-sm'
                                >
                                  Xem giỏ hàng
                                </Link>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </div>
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

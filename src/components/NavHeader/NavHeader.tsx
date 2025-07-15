import { useMutation, useQueryClient } from '@tanstack/react-query'
import Popover from '../Popover'

import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import { MdMail, MdOutlineDoneAll } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { paths } from 'src/constants'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { CartStatus } from 'src/constants/enum'
import { useContext, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'
import Button from '../Button'
import ChangePassword from './components/ChangePassword'

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const refresh_token = localStorage.getItem('refresh_token') || ''

  const queryClient = useQueryClient()
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutCustomer({ refresh_token }),
    onSuccess: (res) => {
      toast.success(res.data.message, { autoClose: 1000 })
      queryClient.removeQueries({ queryKey: ['cart', { status: CartStatus.InCart }] })
      setIsAuthenticated(false)
      setProfile(null)
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
        toast.error(error.response?.data.message)
      } else {
        toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
      }
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  return (
    <div className=' bg-black '>
      <div className='container '>
        <div className='flex justify-between items-center  text-white'>
          <div className=' items-center text-sm '>
            <div className='flex gap-x-2'>
              <FaFacebookF className='capitalize hover:text-gray-300 cursor-pointer text-lg' />
              <FaYoutube className='capitalize hover:text-gray-300 cursor-pointer text-lg' />
              <FaInstagram className='capitalize hover:text-gray-300 cursor-pointer text-lg' />
              <MdMail className='capitalize hover:text-gray-300 cursor-pointer text-lg' />
            </div>
          </div>
          <div className=' items-center py-2 m-2 mr-14'>
            <span className='items-center text-sm '>
              Miễn Phí Giao Hàng Tiêu Chuẩn [Nội thành HCM từ 1.000.000đ - Khu Vực khác từ 1.100.000đ]
            </span>
          </div>
          <div className='flex'>
            {/* <Popover
              className='flex items-center py-2 m-1 mr-3 hover:text-gray-300 cursor-pointer h-full relative z-50'
              classNameSpan='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-50 -translate-y-6 '
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
                <div className='bg-white relative z-50 shadow-md rounded-sm border text-gray-500 border-gray-200 -translate-x-10 -mt-1'>
                  <div className='flex flex-col '>
                    <button className='py-3 px-10 hover:text-black border-b-2  text-left '>Tiếng Việt</button>
                  </div>
                  <div className='flex flex-col'>
                    <button className='py-3 px-10 hover:text-black  text-left '>English</button>
                  </div>
                </div>
              }
            /> */}
            {isAuthenticated ? (
              <Popover
                className='flex items-center hover:text-gray-300 cursor-pointer ml-5 relative z-50'
                classNameSpan='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-50 -translate-y-7 '
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
                  <div className='bg-white relative z-50 shadow-md rounded-sm border border-gray-200 -translate-x-5 text-center -mt-2'>
                    <div className='flex flex-col'>
                      <Link
                        to={paths.Screens.PROFILE}
                        className='py-3 px-10 hover:bg-gray-200 border-b-2 text-gray-500 hover:text-black text-left '
                      >
                        Tài khoản của tôi
                      </Link>
                    </div>
                    <div className='flex flex-col'>
                      <Link
                        to={paths.Screens.HISTORY_ORDER}
                        className='py-3 px-10 hover:bg-gray-200 border-b-2 text-gray-500 hover:text-black text-left '
                      >
                        Đơn hàng của tôi
                      </Link>
                    </div>

                    <div className='flex flex-col'>
                      <button
                        onClick={handleLogout}
                        className='py-3 px-10 hover:bg-gray-200 text-gray-500 hover:text-black text-left '
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                }
              />
            ) : (
              <div className='flex items-center '>
                <Link to={paths.Screens.AUTH_LOGIN} className=' mx-2 hover:text-gray-300 cursor-pointer '>
                  Đăng nhập
                </Link>
                <div className='border-r-2 border-r-white h-4' />
                <Link to={paths.Screens.AUTH_REGISTER} className=' mx-2 hover:text-gray-300 cursor-pointer '>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

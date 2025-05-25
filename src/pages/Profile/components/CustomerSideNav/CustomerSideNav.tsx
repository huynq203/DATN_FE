import path from 'path'
import React from 'react'
import { Link } from 'react-router-dom'
import { paths } from 'src/constants'

export default function CustomerSideNav() {
  return (
    <div className=' mb-20'>
      <div className='flex items-center border-b border-b-gray-200 py-4 '>
        <Link
          to={paths.Screens.PROFILE}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10 '
        >
          <img
            className='h-full w-full  object-cover '
            src='https://down-vn.img.susercontent.com/file/vn-11134226-7ras8-m2vjvaq13agq13_tn'
            alt='Avatar'
          />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>Nguyễn Quốc Huy</div>
          <Link to={paths.Screens.PROFILE} className='flex items-center capitalize text-gray-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
            <span>Sửa thông tin</span>
          </Link>
        </div>
      </div>
      <div className='mt-5'>
        <Link to={paths.Screens.PROFILE} className='flex items-center capitalize  transition-colors font-bold'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6 mr-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
            />
          </svg>
          <span className='mt-1'>Tài khoản của tôi</span>
        </Link>
        <Link to={paths.Screens.ADDRESS} className='flex items-center capitalize  transition-colors mt-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-6 mr-3'
          >
            <path stroke-linecap='round' stroke-linejoin='round' d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
            />
          </svg>

          <span className='mt-1'>Địa chỉ</span>
        </Link>
        <Link
          to={paths.Screens.CHANGE_PASSWORD}
          className='flex items-center capitalize text-black transition-colors mt-3'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-6 mr-3'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
            />
          </svg>

          <span className='mt-1'>Đổi mật khẩu</span>
        </Link>
        <Link to={paths.Screens.WISH_LIST} className='flex items-center capitalize text-black transition-colors mt-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6 mr-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
            />
          </svg>

          <span className='mt-1'>Sản phẩm yêu thích</span>
        </Link>
        <Link
          to={paths.Screens.HISTORY_ORDER}
          className='flex items-center capitalize text-black transition-colors mt-3'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6 mr-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
            />
          </svg>

          <span className='mt-1'>Đơn hàng</span>
        </Link>
      </div>
    </div>
  )
}

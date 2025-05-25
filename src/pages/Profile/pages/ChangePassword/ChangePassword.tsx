import React from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'

export default function ChangePassword() {
  return (
    <div className='rounded-sm  px-7 pb-20 shadow'>
      <Helmet>
        <title>Đổi mật khẩu - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.CHANGE_PASSWORD} />
      </Helmet>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
      </div>
      Đổi mật khẩu
    </div>
  )
}

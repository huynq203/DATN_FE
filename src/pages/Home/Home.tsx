import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Constants } from 'src/constants'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Trang chủ - YOYO Store</title>
        <meta name='description' content='Trang chủ - Yoyo' />
        <link rel='canonical' href={Constants.Screens.HOME} />
      </Helmet>
      <div className=''>Home</div>
    </>
  )
}

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Screens } from 'src/constants'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Trang chủ - YOYO Store</title>
        <meta name='description' content='Trang chủ' />
        <link rel='canonical' href={Screens.HOME} />
      </Helmet>
      <div className=''>Home</div>
    </>
  )
}

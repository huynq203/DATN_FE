import React from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'
import ProductList from '../ProductList'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Trang chủ - YOYO Store</title>
        <meta name='description' content='Trang chủ - Yoyo' />
        <link rel='canonical' href={paths.Screens.HOME} />
      </Helmet>
      Trang Home
    </>
  )
}

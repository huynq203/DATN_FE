import React from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'
import ProductList from '../ProductList'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ | Yoyo Store' />
        <link rel='canonical' href={paths.Screens.HOME} />
      </Helmet>
      Trang Home
    </>
  )
}

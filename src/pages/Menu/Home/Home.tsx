import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'
import ProductList from '../../ProductList'
import Loading from '../../Loading'

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])
  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ | Yoyo Store' />
        <link rel='canonical' href={paths.Screens.HOME} />
      </Helmet>
      {isLoading && (
        <div className='fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50'>
          <div className='text-xl font-semibold animate-pulse text-black-700'>Đang tải dữ liệu</div>
          <div className='ml-48 mt-2'>
            <Loading loading={isLoading} color='black' top='50%' />
          </div>
        </div>
      )}
      Trang Home
    </>
  )
}

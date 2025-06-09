
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'

export default function WishList() {
  return (
    <div className='rounded-sm  px-7 pb-20 shadow'>
      <Helmet>
        <title>Sản phẩm yêu thích - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.WISH_LIST} />
      </Helmet>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Sản phẩm yêu thích</h1>
      </div>
      Sản phẩm yêu thích
    </div>
  )
}

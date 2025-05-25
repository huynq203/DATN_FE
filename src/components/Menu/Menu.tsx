
import { Link } from 'react-router-dom'
import { paths } from 'src/constants'

export default function Menu() {
  return (
    <div className='hidden lg:flex items-center justify-center mx-25 lg:gap-x-10 my-2 font-bold font-sans ml-10'>
      <Link to='/' className='block  hover:text-red-500   text-lg'>
        Trang chủ
      </Link>
      <Link to={paths.Screens.PRODUCT} className='block  hover:text-red-500 text-lg'>
        Sản phẩm
      </Link>
      <Link to={paths.Screens.BLOG} className=' block hover:text-red-500  text-lg'>
        Blog
      </Link>
      <Link to={paths.Screens.INTRODUCE} className=' block hover:text-red-500  text-lg'>
        Giới thiệu
      </Link>
      <Link to={paths.Screens.CONTACT} className=' block hover:text-red-500  text-lg'>
        Liên hệ
      </Link>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { paths, resources } from 'src/constants'

export default function SideBar() {
  return (
    <div>
      <section className='w-full h-[400px] md:h-[550px] bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-between overflow-hidden relative'>
        <div className='w-full md:w-1/2 px-6 md:px-20 z-1'>
          <h1 className='text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6'>
            Chào mừng đến với YoYo Store
          </h1>
          <p className='text-gray-600 text-lg mb-6'>Nơi thời trang hòa quyện cùng sự thoải mái tuyệt đối</p>
          <Link
            to={paths.Screens.PRODUCT}
            className='bg-white px-6 py-3 rounded-md hover:bg-black hover:text-white transition-color duration-700'
          >
            Mua ngay
          </Link>
        </div>

        <div className='hidden md:block md:w-1/2 absolute right-28 top-0 z-0'>
          <img
            src={resources.Images.LOGO}
            alt='Fashion Shoes'
            className='w-[600px] lg:w-[700px] object-contain translate-x-1/4'
          />
        </div>
      </section>
    </div>
  )
}

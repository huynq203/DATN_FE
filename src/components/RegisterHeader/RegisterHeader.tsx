import { Link } from 'react-router-dom'
import { paths } from 'src/constants'

export default function RegisterHeader() {
  return (
    <header className='py-3 bg-black text-white'>
      <div className='container'>
        <div className='flex items-center justify-between'>
          <Link to={paths.Screens.HOME}>Hotline: 0971570582 (8h – 21h30)</Link>
          <div className='flex items-centertext-sm'>
            <Link to={paths.Screens.AUTH_LOGIN} className='mr-2 hover:text-gray-300 '>
              Đăng nhập
            </Link>
            <div className='border-r-2 border-r-white h-5' />
            <Link to={paths.Screens.AUTH_REGISTER} className='ml-2 hover:text-gray-300 '>
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

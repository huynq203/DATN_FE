import { Link } from 'react-router-dom'
import { Screens } from 'src/constants'

export default function RegisterHeader() {
  return (
    <header className='py-3 bg-blue-400 text-white'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center'>
          <Link to={Screens.HOME}>Hotline: 0971570582 (8h – 21h30)</Link>
          <div className='text-sm'>
            <Link to={Screens.AUTH_LOGIN} className='mr-1'>
              ĐĂNG NHẬP
            </Link>
            |
            <Link to={Screens.AUTH_REGISTER} className='ml-1'>
              ĐĂNG KÝ
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

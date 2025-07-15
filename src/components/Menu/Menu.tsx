import { Link } from 'react-router-dom'
import { paths } from 'src/constants'

const navLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: paths.Screens.PRODUCT },
  // { label: 'Giày Nam', to: paths.Screens.MEN },
  // { label: 'Giày Nữ', to: paths.Screens.WOMEN },
  { label: 'Giới thiệu', to: paths.Screens.INTRODUCE },
  { label: 'Liên hệ', to: paths.Screens.CONTACT }
]
export default function Menu() {
  return (
    <div className='hidden lg:flex items-center justify-center mx-6 gap-x-10 my-2 font-sans '>
      {navLinks.map((link, index) => (
        <Link key={index} to={link.to} className='block text-lg hover:font-bold transition-colors duration-200'>
          {link.label}
        </Link>
      ))}
    </div>
  )
}

import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
export default function Footer() {
  return (
    <footer className='bg-neutral-200  py-10'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div>
          <h3 className='text-lg font-semibold border-b border-red-500 pb-2 mb-4'>YOYO STORE</h3>
          <p className='text-sm leading-relaxed'>
            YoYo Store Shop Thời Trang Giao chúng tôi không đơn thuần là cái đẹp thời trang, chúng tôi khao khát kiến
            tạo những giá trị xã hội nhân văn,trở thành một lối sống đồng hành cùng phụ nữ trên hành trình thấu cảm vẻ
            đẹp của chính mình
          </p>
          <div className='flex mt-4 space-x-3'>
            <FaFacebookF className='hover:text-red-500 cursor-pointer' />
            <FaTwitter className='hover:text-red-500 cursor-pointer' />
            <FaLinkedinIn className='hover:text-red-500 cursor-pointer' />
            <FaGooglePlusG className='hover:text-red-500 cursor-pointer' />
            <FaYoutube className='hover:text-red-500 cursor-pointer' />
          </div>
        </div>
        <div>
          <h3 className='text-lg font-semibold border-b border-red-500 pb-2 mb-4'>THÔNG TIN CHÍNH SÁCH CỬA HÀNG</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#' className='hover:underline'>
                Giới thiệu
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Dịch vụ chăm sóc khách hàng
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Our Sitemap
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Điều khoản và điều kiện
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Thông tin giao hàng
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-semibold border-b border-red-500 pb-2 mb-4'>THÔNG TIN LIÊN HỆ</h3>
          <ul className='space-y-3 text-sm'>
            <li className='flex items-start'>
              <FaLocationDot />
              <span className='ml-2'>Địa chỉ: 175 Tây Sơn,Đống Đa, Hà Nội.</span>
            </li>
            <li className='flex items-start'>
              <FaPhone />
              <span className='ml-2'>Số điện thoại: +(84) 0971570582</span>
            </li>
            <li className='flex items-start'>
              <MdEmail />
              <span className='ml-2'>Email: 2151062787@e.tlu.edu.vn</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

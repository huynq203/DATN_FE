import { Helmet } from 'react-helmet-async'

export default function Contact() {
  return (
    <div>
      <Helmet>
        <title>Liên hệ</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>
      <div className='container mx-auto px-4 py-16'>
        {/* Title */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-red-500'>Liên hệ với chúng tôi</h1>
          <p className='text-gray-600 mt-2'>Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>

        {/* Grid layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Left - Info */}
          <div className='space-y-6 text-gray-700 text-base leading-relaxed'>
            <div>
              <h2 className='text-lg font-semibold mb-1'>📍 Địa chỉ</h2>
              <p>175 Tây Sơn, Đống Đa, Hà Nội</p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-1'>📞 Điện thoại</h2>
              <p>0971 570 582</p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-1'>✉️ Email</h2>
              <a href='mailto:2151062787@e.tlu.edu.vn' className='text-blue-600 underline'>
                2151062787@e.tlu.edu.vn
              </a>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-1'>🕒 Giờ làm việc</h2>
              <p>Thứ 2 - Thứ 7: 8h00 - 20h00</p>
              <p>Chủ nhật: 9h00 - 18h00</p>
            </div>
          </div>

          {/* Right - Map */}
          <div>
            <div className='rounded-xl overflow-hidden shadow-lg border-2 border-blue-300'>
              <iframe
                title='Google Map - YOYO Store'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6535429665723!2d105.82169617587208!3d21.006520588540926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac8173d4dd7d%3A0xa798cebdceba4367!2zMTc1IFAuIFTDonkgU8ahbiwgVHJ1bmcgTGnhu4d0LCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpIDEwMDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1751773800811!5m2!1svi!2s'
                width='100%'
                height='400'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

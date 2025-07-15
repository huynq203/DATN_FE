import { Helmet } from 'react-helmet-async'

export default function Introduce() {
  return (
    <div>
      <Helmet>
        <title>Giới thiệu</title>
        <meta name='description' content='Cửa hàng Yoyo' />
      </Helmet>
      <div className='container mx-auto px-4 py-10'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl font-bold text-red-500'>Về chúng tôi</h1>
          <p className='text-gray-600 mt-2'>Câu chuyện và sứ mệnh của YOYO Store</p>
        </div>

        <div className='max-w-4xl mx-auto text-justify text-gray-700 leading-relaxed'>
          <p className='mb-4'>
            <strong>YOYO Store</strong> là cửa hàng thời trang hiện đại, nơi chúng tôi không đơn thuần cung cấp sản
            phẩm, mà còn lan toả những giá trị về phong cách sống, cá tính và sự tự tin của bạn.
          </p>

          <p className='mb-4'>
            Với sứ mệnh <em>"Tôn vinh cái đẹp đậm chất cá nhân"</em>, YOYO Store mong muốn đồng hành cùng bạn trong từng
            khoảnh khắc – từ đời thường đến công sở, từ cá tính đến thanh lịch.
          </p>

          <p className='mb-4'>Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với:</p>

          <ul className='list-disc pl-5 space-y-2'>
            <li>Sản phẩm chất lượng, cập nhật xu hướng mới nhất</li>
            <li>Dịch vụ khách hàng tận tâm, hỗ trợ nhanh chóng</li>
            <li>Chính sách đổi trả linh hoạt, minh bạch</li>
          </ul>

          <p className='mt-6'>
            Hãy để YOYO Store trở thành người bạn đồng hành của bạn trong hành trình định hình phong cách và khẳng định
            dấu ấn cá nhân.
          </p>
        </div>

        <div className='mt-12 text-center'>
          <h2 className='text-xl font-semibold mb-2'>Liên hệ với chúng tôi</h2>
          <p>
            Email:{' '}
            <a href='mailto:2151062787@e.tlu.edu.vn' className='text-blue-600'>
              2151062787@e.tlu.edu.vn
            </a>
          </p>
          <p>Địa chỉ: 175 Tây Sơn, Đống Đa, Hà Nội</p>
          <p>Điện thoại: 0971570582</p>
        </div>
      </div>
    </div>
  )
}

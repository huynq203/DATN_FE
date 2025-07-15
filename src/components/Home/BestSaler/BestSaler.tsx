import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths } from 'src/constants'
import { generateNameId, rateSale } from 'src/utils/utils'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
export default function BestSaler() {
  const { data: productDiscountData } = useQuery({
    queryKey: ['productDiscountList'],
    queryFn: () => {
      return productApi.getProductByDiscount()
    },
    refetchOnWindowFocus: false, // Không tự động làm mới khi cửa sổ được lấy lại tiêu điểm
    staleTime: 1000 * 60 * 5 // Dữ liệu sẽ được coi là mới trong 5 phút
  })
  const listProductDiscount = productDiscountData?.data.result
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])
  return (
    <section className='py-16 px-6 bg-white'>
      <h2
        className='text-4xl font-bold mb-10 text-black'
        data-aos='fade-right'
        data-aos-duration='800'
        data-aos-delay='200'
        data-aos-once='true'
      >
        Sản phẩm giảm giá mạnh
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {listProductDiscount &&
          listProductDiscount.map((product, index) => (
            <div
              key={index}
              className='bg-gray-100 rounded-xl p-6 relative'
              data-aos='fade-up'
              data-aos-duration='800'
              data-aos-delay={`${index * 100}`}
              data-aos-once='true'
            >
              {product.promotion_price && (
                <span className='absolute top-4 left-4 text-xs bg-white text-red-500 font-semibold px-2 py-1 rounded'>
                  Giảm {rateSale(product.price, product.promotion_price)}
                </span>
              )}
              <img src={product.url_images[0].url} alt={product.name} className='w-full h-48 object-cover mx-auto' />
              <div className='mt-6 flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-black'>{product.name}</h3>
                <Link
                  to={`${paths.Screens.PRODUCT}/${generateNameId({
                    name: product.slug,
                    id: product._id
                  })}`}
                  aria-label='Shop Now'
                  className='w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border-2 border-black text-black transition-all duration-300 hover:bg-black hover:text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}

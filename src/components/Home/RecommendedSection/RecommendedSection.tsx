import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths } from 'src/constants'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

export default function RecommendedSection() {
  const { data: productNewData } = useQuery({
    queryKey: ['products', {}],
    queryFn: () => {
      return productApi.getProducts({})
    }
  })
  const listProductNew = productNewData?.data.result.products
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  return (
    <section className='py-16 px-6 bg-white'>
      <div
        className='flex items-center justify-between mb-8'
        data-aos='fade-up'
        data-aos-duration='800'
        data-aos-delay='200'
        data-aos-easing='ease-in-out'
        data-aos-once='true'
      >
        <h2 className='text-3xl md:text-4xl font-bold text-black'>Đề xuất cho bạn</h2>
        <Link to={paths.Screens.PRODUCT} className='text-sm font-semibold underline hover:text-black'>
          Mua ngay
        </Link>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {listProductNew &&
          listProductNew.slice(0, 4).map((product, index) => (
            <div
              key={product._id}
              className='bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition'
              data-aos='fade-up'
              data-aos-duration='800'
              data-aos-delay={index * 100}
              data-aos-easing='ease-in-out'
              data-aos-once='true'
            >
              <img
                src={product.url_images[0].url}
                alt={product.name}
                className='w-full h-48 object-cover mb-6 rounded-md '
              />
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium'>{product.name}</h3>
                  <p className='text-sm mt-1'>
                    {product.promotion_price > 0
                      ? formatCurrency(product.promotion_price)
                      : formatCurrency(product.price)}{' '}
                    đ
                  </p>
                </div>
                <Link
                  to={`${paths.Screens.PRODUCT}/${generateNameId({
                    name: product.slug,
                    id: product._id
                  })}`}
                  className='w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition'
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

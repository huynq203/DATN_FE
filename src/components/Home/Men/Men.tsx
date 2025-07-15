import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths } from 'src/constants'
import { generateNameId } from 'src/utils/utils'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
export default function Men() {
  const { data: productByMenData } = useQuery({
    queryKey: ['productByMen'],
    queryFn: () => {
      return productApi.getProductByMen()
    }
  })
  const listProductByMen = productByMenData?.data.result
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])
  return (
    <section className='py-16 px-6 bg-white'>
      <h2
        className='text-4xl font-bold mb-5 text-black'
        data-aos='fade-right'
        data-aos-duration='800'
        data-aos-delay='200'
        data-aos-easing='ease-in-out'
        data-aos-once='true'
      >
        Sản phẩm cho nam
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {listProductByMen &&
          listProductByMen.slice(0, 4).map((product, index) => (
            <div
              key={product._id}
              className='bg-gray-100 rounded-xl p-6 relative'
              data-aos='fade-up'
              data-aos-duration='800'
              data-aos-delay={index * 100}
              data-aos-easing='ease-in-out'
              data-aos-once='true'
            >
              {product && (
                <span className='absolute top-4 left-4 text-xs bg-white text-red-500 font-semibold px-2 py-1 rounded'>
                  Nam
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

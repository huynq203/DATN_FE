import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { paths } from 'src/constants'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

export default function Kid() {
  const { data: productByKidData } = useQuery({
    queryKey: ['productByKid'],
    queryFn: () => {
      return productApi.getProductByKid()
    }
  })
  const listProductByKid = productByKidData?.data.result
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])
  return (
    <section className='px-6 py-10 max-w-7xl mx-auto'>
      <h2
        className='text-3xl md:text-4xl font-bold mb-6'
        data-aos='fade-up'
        data-aos-duration='800'
        data-aos-delay='200'
        data-aos-easing='ease-in-out'
        data-aos-once='true'
      >
        Dành cho trẻ em
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* Left Image */}
        <div className='relative w-full h-[580px] rounded-lg overflow-hidden'>
          <img
            src='https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/h_568,c_limit/4c059e6c-7051-4a0c-9904-68604f788369/nike-kids.png'
            alt="Kid's Lifestyle"
            className='w-full h-auto object-cover'
            data-aos='fade-right'
            data-aos-duration='800'
            data-aos-delay='200'
            data-aos-easing='ease-in-out'
            data-aos-once='true'
          />
        </div>

        {/* Right Product Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {listProductByKid &&
            listProductByKid.map((item, idx) => (
              <div
                key={idx}
                className='bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition duration-200'
                data-aos='fade-left'
                data-aos-duration='800'
                data-aos-delay={idx * 100}
                data-aos-easing='ease-in-out'
                data-aos-once='true'
              >
                <img src={item.url_images[0].url} alt={item.name} className='w-full h-48 object-cover mx-auto mb-4' />
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold text-lg'>{item.name}</h4>
                    <p className='text-sm text-gray-500'>{formatCurrency(item.price)} đ</p>
                  </div>
                  {/* <FiArrowRight className='text-xl text-gray-600 hover:text-black' /> */}
                  <Link
                    to={`${paths.Screens.PRODUCT}/${generateNameId({
                      name: item.slug,
                      id: item._id
                    })}`}
                    className='mt-3 ml-5 w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border-2 border-black text-black transition-all duration-300 hover:bg-black hover:text-white'
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
      </div>
    </section>
  )
}

import { Carousel } from '@material-tailwind/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import imageSliderApi from 'src/apis/imageSlider.api'
import { paths, resources } from 'src/constants'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
export function CarouselDefault() {
  const { data: imageSliders, isLoading } = useQuery({
    queryKey: ['imageSliders'],
    queryFn: () => {
      return imageSliderApi.getAllImageSlider()
    }
  })
  const listImageSliders = imageSliders?.data.result
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])
  return (
    <Carousel
      className='rounded-md h-[500px] w-full'
      autoplay={true}
      loop={true}
      placeholder='Carousel Placeholder'
      onPointerEnterCapture={() => console.log('Pointer entered')}
      onPointerLeaveCapture={() => console.log('Pointer left')}
      data-aos='fade-right'
      data-aos-duration='800'
      data-aos-delay='200'
      data-aos-easing='ease-in-out'
      data-aos-once='true'
    >
      <section className='w-full h-[500px]  bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-between overflow-hidden relative'>
        <div className='w-full md:w-1/2 px-6 md:px-20 z-1'>
          <h1 className='text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6'>
            Chào mừng đến với YoYo Store
          </h1>
          <p className='text-gray-600 text-lg mb-6'>Nơi thời trang hòa quyện cùng sự thoải mái tuyệt đối</p>
          <Link
            to={paths.Screens.PRODUCT}
            className='bg-white px-6 py-3 rounded-md hover:bg-black hover:text-white transition-color duration-700'
          >
            Mua ngay
          </Link>
        </div>

        <div className='hidden md:block md:w-1/2 absolute right-28 top-0 z-0'>
          <img
            src={resources.Images.LOGO}
            alt='Fashion Shoes'
            className='w-[600px] lg:w-[700px] object-contain translate-x-1/4'
          />
        </div>
      </section>
      {listImageSliders?.map((imageSlider) => (
        <img
          key={imageSlider._id}
          src={imageSlider.urlImage[0].url}
          alt='image slider'
          className='h-full w-full object-cover'
        />
      ))}
    </Carousel>
  )
}

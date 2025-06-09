import { useEffect, useMemo, useState } from 'react'
import { Product as ProductType } from 'src/types/product.type'
interface Props {
  product: ProductType
  image_variant_color?: string
  stock?: number
}
export default function ImageProduct({ product, image_variant_color, stock }: Props) {


  const [activeImage, setActiveImage] = useState('')
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentImages = useMemo(
    () => (product ? product.url_images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  useEffect(() => {
    if (product && product.url_images.length > 0) {
      setActiveImage(product.url_images[0].url)
    }
  }, [product])

  const chooseActiveImage = (image: string) => {
    setActiveImage(image)
  }

  const next = () => {
    const max = product!.url_images.length - 1
    if (currentImageIndex < max) {
      const newIndex = currentImageIndex + 1
      setCurrentImageIndex(newIndex)
      setActiveImage(product!.url_images[newIndex].url)

      // Cập nhật thumbnail nếu cần
      if (newIndex >= currentIndexImages[1]) {
        setCurrentIndexImages([currentIndexImages[0] + 1, currentIndexImages[1] + 1])
      }
    }
  }

  const prev = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1
      setCurrentImageIndex(newIndex)
      setActiveImage(product!.url_images[newIndex].url)

      // Cập nhật thumbnail nếu cần
      if (newIndex < currentIndexImages[0]) {
        setCurrentIndexImages([currentIndexImages[0] - 1, currentIndexImages[1] - 1])
      }
    }
  }
  return (
    <div className='col-span-4'>
      <div className='relative w-full pt-[100%] shadow '>
        <button
          className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-t-1/2 bg-black/20 text-white hover:text-black'
          onClick={prev}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>
        <div>
          <img
            src={image_variant_color ? image_variant_color : activeImage}
            alt={product.name}
            className='absolute top-0 left-0 w-full h-full object-cover rounded-md'
          />
          {stock === 0 && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center rounded-md'>
              <span className='text-white text-sm font-semibold'>Đã hết hàng</span>
            </div>
          )}
        </div>

        <button
          className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-t-1/2 bg-black/20 text-white hover:text-black'
          onClick={next}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path stroke-linecap='round' stroke-linejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
      <div className='relative mt-4 grid grid-cols-5 gap-1'>
        {currentImages.map((img) => {
          const isActive = img.url === activeImage
          return (
            <div
              className=' relative w-full pt-[100%]'
              key={img.url}
              onMouseEnter={() => {
                chooseActiveImage(img.url)
                setActiveImage(img.url)
              }}
            >
              <img
                src={img.url}
                alt={product.name}
                className='absolute top-0 left-0 w-full h-full cursor-pointer object-cover rounded-md'
              />
              {isActive && <div className='absolute inset-0 border-2 border-black rounded-md' />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

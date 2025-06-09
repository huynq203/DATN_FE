const products = [
  {
    label: '20% OFF',
    title: 'Gift For Everyone',
    image: '/images/shoe1.png' // cập nhật lại đường dẫn thực tế
  },
  {
    label: 'Best Seller',
    title: 'Best Selling Gift',
    image: '/images/shoe2.png'
  },
  {
    label: '15% OFF',
    title: 'Cold Weather Shop',
    image: '/images/shoe3.png'
  },
  {
    label: 'Top Seller',
    title: 'Winter Tones',
    image: '/images/shoe4.png'
  }
]
export default function SeasonShopSection() {
  return (
    <section className='py-16 px-6 bg-white'>
      <h2 className='text-4xl font-bold mb-10 text-black'>Mùa để mua sắm</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {products.map((product, index) => (
          <div key={index} className='bg-gray-100 rounded-xl p-6 relative'>
            {product.label && (
              <span className='absolute top-4 left-4 text-xs bg-white text-red-500 font-semibold px-2 py-1 rounded'>
                {product.label}
              </span>
            )}
            <img src={product.image} alt={product.title} className='w-full h-48 object-contain mx-auto' />
            <div className='mt-6 flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-black'>{product.title}</h3>
              <button
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
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const recommendedProducts = [
  {
    label: 'Top Seller',
    title: 'Dunk The Halls',
    price: '$240',
    image: 'https://link-to-image-dunk.jpg'
  },
  {
    label: 'Best Seller',
    title: 'Jordan 1 Shoes',
    price: '$140',
    image: 'https://link-to-image-jordan.jpg'
  },
  {
    label: 'Top Seller',
    title: 'Cold Weather',
    price: '$120',
    image: 'https://link-to-image-cold.jpg'
  },
  {
    label: 'Best Seller',
    title: 'Air Max',
    price: '$300',
    image: 'https://link-to-image-airmax.jpg'
  }
]
export default function RecommendedSection() {
  return (
    <section className='py-16 px-6 bg-white'>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-3xl md:text-4xl font-bold text-black'>Đề xuất cho bạn</h2>
        <a href='#' className='text-sm font-semibold underline hover:text-black'>
          Shop Now
        </a>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {recommendedProducts.map((product, index) => (
          <div key={index} className='bg-gray-50 p-5 rounded-xl shadow hover:shadow-md transition'>
            {product.label && (
              <span className='text-xs font-semibold text-black bg-white px-2 py-1 rounded mb-2 inline-block'>
                {product.label}
              </span>
            )}
            <img src={product.image} alt={product.title} className='w-full h-40 object-contain mb-6' />
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>{product.title}</h3>
                <p className='text-sm mt-1'>{product.price}</p>
              </div>
              <button className='w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition'>
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

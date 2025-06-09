const categories = [
  {
    title: "Men's Lifestyle",
    desc: 'Ahdhia lifestyle shoes for men',
    image: 'https://link-to-image-men.jpg'
  },
  {
    title: "Woman's Lifestyle",
    desc: 'Ahdhia lifestyle shoes for woman',
    image: 'https://link-to-image-woman.jpg'
  },
  {
    title: "Kid's Lifestyle",
    desc: 'Ahdhia lifestyle shoes for kid’s',
    image: 'https://link-to-image-kids.jpg'
  },
  {
    title: 'Casual Lifestyle',
    desc: 'Ahdhia lifestyle shoes for casual',
    image: 'https://link-to-image-casual.jpg'
  }
]
export default function DiscoverFootwearSection() {
  return (
    <section className='px-6 py-10 max-w-7xl mx-auto'>
      <h2 className='text-3xl md:text-4xl font-bold mb-6'>Khám phá giày mới</h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* Left Image */}
        <div className='relative w-full h-[500px] rounded-lg overflow-hidden'>
          <img src='https://link-to-main-kid-image.jpg' alt="Kid's Lifestyle" className='w-full h-full object-cover' />
          <div className='absolute bottom-6 left-6  bg-opacity-60 p-4 rounded flex'>
            <div>
              <h3 className='text-xl font-semibold'>Kid’s Lifestyle</h3>
              <p className='text-sm mt-1'>Experience the epitome of the kids lifestyle with Ahdhia.</p>
            </div>
            <button className='mt-3 ml-5 w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border-2 border-black text-black transition-all duration-300 hover:bg-black hover:text-white'>
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

        {/* Right Product Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {categories.map((cat, idx) => (
            <div key={idx} className='bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition duration-200'>
              <img src={cat.image} alt={cat.title} className='w-full h-40 object-contain mb-4' />
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-semibold text-lg'>{cat.title}</h4>
                  <p className='text-sm text-gray-500'>{cat.desc}</p>
                </div>
                {/* <FiArrowRight className='text-xl text-gray-600 hover:text-black' /> */}
                <button className='mt-3 ml-5 w-8 h-8 flex items-center justify-center text-xl font-bold rounded-full border-2 border-black text-black transition-all duration-300 hover:bg-black hover:text-white'>
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
      </div>
    </section>
  )
}

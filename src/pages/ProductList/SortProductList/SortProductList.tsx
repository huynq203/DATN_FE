export default function SortProductList() {
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='font-sans'>Sắp xếp theo</div>
          <button className='h-8 px-4 capitalize bg-orange-600 text-white text-xs text-center font-sans'>
            Liên quan
          </button>
          <button className='h-8 px-4 capitalize bg-white text-black hover:bg-orange-600 hover:text-white text-xs text-center font-sans'>
            Mới nhất
          </button>
          <button className='h-8 px-4 capitalize bg-white text-black hover:bg-orange-600 hover:text-white text-xs text-center font-sans'>
            Bán chạy
          </button>
          <button className='h-8 px-4 capitalize bg-white text-black hover:bg-orange-600 hover:text-white text-xs text-center font-sans'>
            Giảm giá
          </button>
          <select className='h-8 px-4 capitalize bg-white text-black text-xs font-sans' defaultValue=''>
            <option value='' disabled>
              Giá
            </option>
            <option value=''>Giá từ thấp đến cao</option>
            <option value=''>Giá từ cao đến thấp</option>
          </select>
        </div>
      </div>
    </div>
  )
}

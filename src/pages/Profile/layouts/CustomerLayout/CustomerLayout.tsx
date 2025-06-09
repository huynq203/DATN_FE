
import CustomerSideNav from '../../components/CustomerSideNav'
import { Outlet } from 'react-router-dom'

export default function CustomerLayout() {
  return (
    <div className='bg-white py-16 text-sm text-black'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          <div className='md:col-span-3 lg:col-span-2'>
            <CustomerSideNav />
          </div>
          <div className='md:col-span-9 lg:col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

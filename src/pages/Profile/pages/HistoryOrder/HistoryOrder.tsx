import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AllOrder from './components/AllOrder'
import PendingPayment from './components/PendingPayment'
import PendingDelivery from './components/PendingDelivery'
import SuccessOrder from './components/SuccessOrder'
import CancelOrder from './components/CancelOrder'
export default function HistoryOrder() {
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '-1',
      label: 'Tất cả',
      children: <AllOrder />
    },
    {
      key: '0',
      label: 'Chờ thanh toán',
      children: <PendingPayment />
    },
    {
      key: '1',
      label: 'Chờ xác nhận',
      children: <></>
    },
    {
      key: '2',
      label: 'Vận chuyển', // 2,3,4
      children: <></>
    },
    {
      key: '3',
      label: 'Hoàn thành',
      children: <SuccessOrder />
    },
    {
      key: '4',
      label: 'Đã hủy',
      children: <CancelOrder />
    }
  ]

  return (
    <div className='rounded-sm  px-7 pb-20 shadow'>
      <Helmet>
        <title>Đơn hàng - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.HISTORY_ORDER} />
      </Helmet>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đơn hàng</h1>
      </div>
      <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
    </div>
  )
}

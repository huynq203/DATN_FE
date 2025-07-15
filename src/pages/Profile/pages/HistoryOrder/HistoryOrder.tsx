import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AllOrder from './components/AllOrder'

import SuccessOrder from './components/SuccessOrder'
import CancelOrder from './components/CancelOrder'
import orderApi from 'src/apis/order.api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { OrderResponse } from 'src/types/order.type'
import WaittingConfirm from './components/WaittingConfirm'
import Delevery from './components/Delevery'

export default function HistoryOrder() {
  const [filterOrderStatus, setFilterOrderStatus] = useState('')
  const { data: OrderData } = useQuery({
    queryKey: ['listOrder', { order_status: filterOrderStatus }],
    queryFn: () => orderApi.getOrderbyCustomerId({ order_status: filterOrderStatus }) // Replace with actual customer ID
  })
  const listOrders = OrderData?.data.result

  const onChange = (key: string) => {
    setFilterOrderStatus(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'Tất cả',
      children: <AllOrder listOrder={listOrders as OrderResponse[]} />
    },

    {
      key: '1',
      label: 'Chờ xác nhận',
      children: <WaittingConfirm listOrder={listOrders as OrderResponse[]} />
    },
    {
      key: '2',
      label: 'Vận chuyển', // 2,3,4
      children: <Delevery listOrder={listOrders as OrderResponse[]} />
    },
    {
      key: '5',
      label: 'Hoàn thành',
      children: <SuccessOrder listOrder={listOrders as OrderResponse[]} />
    },
    {
      key: '6',
      label: 'Đã hủy',
      children: <CancelOrder listOrder={listOrders as OrderResponse[]} />
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
      <Tabs defaultActiveKey='' items={items} onChange={onChange} />
    </div>
  )
}

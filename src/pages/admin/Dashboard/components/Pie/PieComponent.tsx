import PieChart from '@ant-design/plots/es/components/pie'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import orderApi from 'src/apis/order.api'

export default function PieComponent() {
  const { data: dataCountStatus } = useQuery({
    queryKey: ['order'],
    queryFn: () => {
      return orderApi.getOrderStatusCount()
    }
  })

  const listCountStatus = dataCountStatus?.data.result
  const data = [
    { type: 'Chờ xác nhận', value: listCountStatus?.totalWaitConfirmed },
    { type: 'Đang giao', value: listCountStatus?.totalDelivery },
    { type: 'Giao thành công', value: listCountStatus?.totalSuccess },
    { type: 'Đã hủy', value: listCountStatus?.totalCanceled }
  ]

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ type }: { type: string }) => type,
      style: {
        textAlign: 'center',
        fontSize: 14
      }
    },
    interactions: [{ type: 'element-active' }]
  }

  return <PieChart {...config} />
}

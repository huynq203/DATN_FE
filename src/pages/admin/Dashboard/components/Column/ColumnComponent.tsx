import { Column } from '@ant-design/plots'
import { useQuery } from '@tanstack/react-query'
import orderApi from 'src/apis/order.api'
export default function ColumnComponent() {
  const { data: listDataToProfit } = useQuery({
    queryKey: ['listDataToProfit'],
    queryFn: () => {
      return orderApi.getTotalProfitToMonth()
    }
  })

  const listData = listDataToProfit?.data.result
  const data = listData?.map((item) => {
    return {
      month: item.month,
      revenue: item.totalProfit
    }
  })
  // const data = [
  //   { month: 'Tháng 1', revenue: 0 },
  //   { month: 'Tháng 2', revenue: 0 },
  //   { month: 'Tháng 3', revenue: 0 },
  //   { month: 'Tháng 4', revenue: 0 },
  //   { month: 'Tháng 5', revenue: 0 },
  //   { month: 'Tháng 6', revenue: 2600000 },
  //   { month: 'Tháng 7', revenue: 1600000 },
  //   { month: 'Tháng 8', revenue: 2600000 },
  //   { month: 'Tháng 9', revenue: 3600000 },
  //   { month: 'Tháng 10', revenue: 4600000 },
  //   { month: 'Tháng 11', revenue: 5600000 },
  //   { month: 'Tháng 12', revenue: 6600000 }
  // ]

  const config = {
    data,
    xField: 'month',
    yField: 'revenue',
    label: {
      position: 'middle',
      style: {
        fill: '#000',
        opacity: 0.6
      }
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false
      }
    },
    meta: {
      month: { alias: 'Tháng' },
      orders: { alias: 'Tổng doanh thu' }
    }
  }
  return <Column {...config} />
}

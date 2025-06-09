import { Button, Card } from 'antd'
import { useState } from 'react'
import { Line } from '@ant-design/plots'

const data = [
  { month: 'Tháng 1', value: 400 },
  { month: 'Tháng 2', value: 700 },
  { month: 'Tháng 3', value: 200 },
  { month: 'Tháng 4', value: 880 },
  { month: 'Tháng 5', value: 990 },
  { month: 'Tháng 6', value: 1200 },
  { month: 'Tháng 7', value: 1500 },
  { month: 'Tháng 8', value: 1300 },
  { month: 'Tháng 9', value: 1700 },
  { month: 'Tháng 10', value: 1600 },
  { month: 'Tháng 11', value: 1800 },
  { month: 'Tháng 12', value: 2000 }
]
export default function LineBar() {
  const [filter, setFilter] = useState('6m')

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    smooth: true,
    height: 300,
    point: {
      size: 5,
      shape: 'diamond'
    },
    tooltip: { showMarkers: true }
  }
  return (
    <Card
      title='Biểu đồ doanh thu'
      extra={
        <>
          <Button
            type={filter === '6m' ? 'primary' : 'default'}
            size='small'
            onClick={() => setFilter('6m')}
            style={{ marginRight: 8 }}
          >
            6 tháng
          </Button>
          <Button type={filter === '12m' ? 'primary' : 'default'} size='small' onClick={() => setFilter('12m')}>
            12 tháng
          </Button>
        </>
      }
      style={{ marginTop: 24 }}
    >
      <Line {...config} />
    </Card>
  )
}

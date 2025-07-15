import { Layout, theme } from 'antd'
import { resources } from 'src/constants'
import { Helmet } from 'react-helmet-async'
const { Content } = Layout
import { Card, Statistic, Row, Col } from 'antd'

import PieComponent from './components/Pie'
import ColumnComponent from './components/Column'
import { useQuery } from '@tanstack/react-query'
import orderApi from 'src/apis/order.api'
import { DollarOutlined, UserOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'

export default function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const { data: totalDashBoard } = useQuery({
    queryKey: ['totalDashBoard'],
    queryFn: () => {
      return orderApi.getTotalDashBoard()
    }
  })
  const data = [
    {
      title: 'Tổng lợi nhuận tháng này',
      value: totalDashBoard?.data.result.totalProfit?.totalProfit
        ? totalDashBoard?.data.result.totalProfit.totalProfit
        : 0,
      suffix: '₫',
      prefix: <DollarOutlined style={{ fontSize: 24, color: '#faad14' }} />
    },
    {
      title: 'Khách hàng đã đăng ký',
      value: totalDashBoard?.data.result.totalCustomer,
      prefix: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    {
      title: 'Tổng sản phẩm',
      value: totalDashBoard?.data.result.totalProduct,
      prefix: <ShoppingOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
    },
    {
      title: 'Tổng đơn hàng',
      value: totalDashBoard?.data.result.totalOrder,
      prefix: <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />
    }
  ]
  return (
    <div>
      <Helmet>
        <title>Tổng quan - YOYO Store</title>
        <meta name='description' content='Dashboard YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='container'></div>
          <div style={{ padding: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Tổng quan</h1>

            <Row gutter={[24, 24]} justify='space-between' style={{ marginTop: 24 }}>
              {data.map((item, index) => (
                <Col key={index} flex='1' xs={24} sm={12} md={6}>
                  <Card>
                    <Statistic title={item.title} value={item.value} prefix={item.prefix} suffix={item.suffix} />
                  </Card>
                </Col>
              ))}
            </Row>
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Card title='Trạng thái đơn hàng'>
                  <PieComponent />
                </Card>
              </Col>
              <Col span={12}>
                <Card title='Lợi nhuận theo tháng'>
                  <ColumnComponent />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </div>
  )
}

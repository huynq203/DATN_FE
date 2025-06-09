import { useState } from 'react'
import { Breadcrumb, Layout, theme } from 'antd'
import { resources } from 'src/constants'
import { Helmet } from 'react-helmet-async'
const { Content } = Layout
import { Card, Statistic, Button, Row, Col } from 'antd'

import { Pie } from '@ant-design/plots'
import LineBar from './components/Line'

export default function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  return (
    <Content style={{ margin: '0 16px' }}>
      <Breadcrumb style={{ margin: '16px 0', paddingTop: 24 }}>
        <Breadcrumb.Item>/</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG
        }}
      >
        <div className='container'>
          <Helmet>
            <title>Dashboard - YOYO Store</title>
            <meta name='description' content='Thêm sản phẩm YOYO Store' />
            <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
          </Helmet>
        </div>
        <div style={{ padding: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Dashboard</h1>

          <Row gutter={16} style={{ marginTop: 24 }}>
            <div className='flex'>
              <Col span={6}>
                <Card>
                  <Statistic title='Tổng doanh thu' value={12000000} suffix='₫' />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title='Người dùng mới' value={420} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title='Giao dịch thành công' value={1278} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title='Giao dịch thành công' value={1278} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title='Giao dịch thành công' value={1278} />
                </Card>
              </Col>
            </div>
          </Row>
          <LineBar />
        </div>
      </div>
    </Content>
  )
}

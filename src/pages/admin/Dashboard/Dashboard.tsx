import React from 'react'
import { Breadcrumb, Layout, theme } from 'antd'
import { resources } from 'src/constants'
import { Helmet } from 'react-helmet-async'
const { Content } = Layout

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
        Trang chủ
      </div>
    </Content>
  )
}

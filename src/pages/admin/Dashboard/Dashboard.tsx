import React from 'react'
import { Breadcrumb, Layout, theme } from 'antd'
const { Content } = Layout

export default function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  return (
    <>
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
          Trang chủ
        </div>
      </Content>
    </>
  )
}

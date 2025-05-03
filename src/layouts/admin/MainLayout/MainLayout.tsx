import React, { useState } from 'react'
import { AppstoreOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, theme } from 'antd'
const { Footer, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTicket, faUser, faHouse, faCartShopping, faPenToSquare, faPen } from '@fortawesome/free-solid-svg-icons'
import HeaderAdmin from 'src/components/Admin/HeaderAdmin/HeaderAdmin'
import { paths } from 'src/constants'
import { useNavigate } from 'react-router-dom'
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}
const items: MenuItem[] = [
  getItem('Dashboard', paths.Screens.ADMIN_DASHBOARD, <FontAwesomeIcon icon={faHouse} />),
  getItem('Quản lý tài khoản', '', <FontAwesomeIcon icon={faUser} />, [
    getItem('Khách hàng', paths.Screens.ADMIN_MANAGER_CUSTOMER, <FontAwesomeIcon icon={faUser} />),
    getItem('Người dùng', paths.Screens.ADMIN_MANAGER_USER, <FontAwesomeIcon icon={faUser} />)
  ]),
  getItem('Quản lý danh mục', paths.Screens.ADMIN_MANAGER_CATEGORY, <UnorderedListOutlined />),
  getItem('Quản lý sản phẩm', paths.Screens.ADMIN_MANAGER_PRODUCT, <AppstoreOutlined />),
  getItem('Quản lý đơn hàng', paths.Screens.ADMIN_MANAGER_ORDER, <FontAwesomeIcon icon={faCartShopping} />),
  getItem('Quản lý nhập hàng', paths.Screens.ADMIN_MANAGER_RECCEIPTES, <FontAwesomeIcon icon={faPenToSquare} />),
  getItem('Quản lý Voucher', paths.Screens.ADMIN_MANAGER_VOUCHER, <FontAwesomeIcon icon={faTicket} />),
  getItem('Quản lý bài đăng', paths.Screens.ADMIN_MANAGER_POST, <FontAwesomeIcon icon={faPen} />),
  getItem('Quản lý chủ đề', paths.Screens.ADMIN_MANAGER_THEME, <FontAwesomeIcon icon={faTicket} />)
]

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  let navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const onSelect: MenuProps['onClick'] = (e) => {
    navigate(e.key)
    setSelectedKeys([e.key])
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className='demo-logo-vertical' />
        <Menu theme='dark' selectedKeys={selectedKeys} mode='inline' items={items} onClick={onSelect} />
      </Sider>
      <Layout>
        <HeaderAdmin />
        {children}
        <Footer style={{ textAlign: 'center' }}>
          HuyNQ1 Design ©{new Date().getFullYear()} Created by Nguyễn Quốc Huy 2025
        </Footer>
      </Layout>
    </Layout>
  )
}

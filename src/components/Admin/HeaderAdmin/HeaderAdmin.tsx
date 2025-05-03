import React from 'react'
import { Dropdown, Layout, Menu, theme } from 'antd'
import { AppstoreOutlined, DownOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { paths } from 'src/constants'
const { Header, Footer, Sider } = Layout
export default function HeaderAdmin() {
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const menuDropItems = [
    { key: 'change-password', label: 'Đổi mật khẩu' },
    { key: 'sign-out', label: 'Đăng xuất' }
  ]
  const onSelectDrop = (data: { key: string }) => {
    if (data.key === 'sign-out') {
    }
    if (data.key === 'change-password') {
      navigate(paths.Screens.CHANGE_PASSWORD)
    }
  }
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <div className='px-3 pl-12 pr-32  bg-white flex items-center justify-end'>
        <Dropdown overlay={<Menu items={menuDropItems} onClick={onSelectDrop} />} trigger={['click']}>
          <a className='inline-flex items-center ant-dropdown-link gap-5' onClick={(e) => e.preventDefault()}>
            <UserOutlined /> Nguyễn Quốc Huy <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

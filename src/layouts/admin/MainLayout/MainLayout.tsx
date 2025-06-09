import React, { useContext, useState } from 'react'
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
const { Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import HeaderAdmin from 'src/components/Admin/HeaderAdmin/HeaderAdmin'
import { paths } from 'src/constants'
import { useNavigate } from 'react-router-dom'
import FooterAdmin from 'src/components/Admin/FooterAdmin'
import { useMutation } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'
import ModalChangePasswordAdmin from 'src/components/Admin/ModalChangePasswordAdmin'
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const items: MenuItem[] = [
    !collapsed ? getItem(<span className='font-bold text-sm uppercase text-white'>Yoyo Store Admin</span>, '') : null,
    getItem(
      'Dashboard',
      paths.Screens.ADMIN_DASHBOARD,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        />
      </svg>
    ),
    getItem(
      'Quản lý account',
      '',
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
        />
      </svg>,
      [
        getItem(
          'Khách hàng',
          paths.Screens.ADMIN_MANAGER_CUSTOMER,
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-5'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
            />
          </svg>
        ),
        getItem(
          'Người dùng',
          paths.Screens.ADMIN_MANAGER_USER,
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-5'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
            />
          </svg>
        )
      ]
    ),
    getItem(
      'Quản lý danh mục',
      paths.Screens.ADMIN_MANAGER_CATEGORY,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
        />
      </svg>
    ),
    getItem(
      'Quản lý sản phẩm',
      paths.Screens.ADMIN_MANAGER_PRODUCT,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
        />
      </svg>
    ),
    getItem(
      'Quản lý đơn hàng',
      paths.Screens.ADMIN_MANAGER_ORDER,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
        />
      </svg>
    ),
    getItem(
      'Quản lý nhập hàng',
      paths.Screens.ADMIN_MANAGER_RECCEIPTES,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
        />
      </svg>
    ),
    getItem(
      'Quản lý Voucher',
      paths.Screens.ADMIN_MANAGER_VOUCHER,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z'
        />
      </svg>
    ),
    getItem(
      'Quản lý bài đăng',
      paths.Screens.ADMIN_MANAGER_POST,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
        />
      </svg>
    ),
    !collapsed ? getItem(<span className='font-bold text-sm text-white'>Quản lý hồ sơ</span>, '') : null,
    getItem(
      <span className='uppercase font-bold'>{profile?.name}</span>,
      paths.Screens.ADMIN_PROFILE,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
        />
      </svg>
    ),
    getItem(
      'Đổi mật khẩu',
      paths.Screens.ADMIN_CHANGE_PASSWORD,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
        />
      </svg>
    ),
    getItem(
      'Đăng xuất',
      paths.Screens.ADMIN_LOGOUT,
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke-width='1.5'
        stroke='currentColor'
        className='size-5'
      >
        <path stroke-linecap='round' stroke-linejoin='round' d='M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9' />
      </svg>
    )
  ]
  const refresh_token = localStorage.getItem('refresh_token') || ''
  const logoutMutation = useMutation({
    mutationFn: () => userApi.logoutUser({ refresh_token }),
    onSuccess: (res) => {
      toast.success(res.data.message, { autoClose: 1000 })
      setIsAuthenticated(false)
      setProfile(null)
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
        toast.error(error.response?.data.message)
      } else {
        toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
      }
    }
  })
  const onSelect: MenuProps['onClick'] = (e) => {
    if (e.key === paths.Screens.ADMIN_PROFILE || e.key === '') {
      return
    } else if (e.key === paths.Screens.ADMIN_LOGOUT) {
      logoutMutation.mutate()
    } else if (e.key === paths.Screens.ADMIN_CHANGE_PASSWORD) {
      setIsModalOpen(true)
    } else {
      navigate(e.key)
      setSelectedKeys([e.key])
    }
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        {/* <div className='demo-logo-vertical' /> */}
        <Menu theme='dark' selectedKeys={selectedKeys} mode='inline' items={items} onClick={onSelect} />
      </Sider>
      <Layout>
        {/* <HeaderAdmin /> */}
        {children}
        <FooterAdmin />
        <ModalChangePasswordAdmin isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </Layout>
    </Layout>
  )
}

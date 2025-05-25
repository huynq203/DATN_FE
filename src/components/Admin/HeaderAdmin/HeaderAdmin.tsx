import React, { useContext } from 'react'
import { Dropdown, Layout, Menu, theme } from 'antd'
import { AppstoreOutlined, DownOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { paths } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'
const { Header } = Layout
export default function HeaderAdmin() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)

  const refresh_token = localStorage.getItem('refresh_token') || ''
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
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
  const menuDropItems = [
    { key: 'change-password', label: 'Đổi mật khẩu' },
    { key: 'sign-out', label: 'Đăng xuất' }
  ]

  const onSelectDrop = (data: { key: string }) => {
    if (data.key === 'sign-out') {
      logoutMutation.mutate()
    }
    if (data.key === 'change-password') {
      }
  }
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <div className='px-3 pl-12 pr-32  bg-white flex items-center justify-end'>
        {isAuthenticated && (
          <Dropdown overlay={<Menu items={menuDropItems} onClick={onSelectDrop} />} trigger={['click']}>
            <a className='inline-flex items-center ant-dropdown-link gap-5' onClick={(e) => e.preventDefault()}>
              <UserOutlined /> {profile?.name} <DownOutlined />
            </a>
          </Dropdown>
        )}
      </div>
    </Header>
  )
}

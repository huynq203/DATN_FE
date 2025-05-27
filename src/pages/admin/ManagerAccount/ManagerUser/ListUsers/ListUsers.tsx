import { useMutation, useQuery } from '@tanstack/react-query'
import { Breadcrumb, Table, TableColumnsType, Tag, theme } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import { paths, resources } from 'src/constants'
import { StatusType } from 'src/constants/enum'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import ModalCreateUser from '../components/ModalCreateUser'
import { useState } from 'react'
import ModalUpdateUser from '../components/ModalUpdateUser'

interface DataType {
  key: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  status: number
  address: string
  role: {
    _id: string
    role_name: string
  }
  created_at: string
  updated_at: string
}

export default function ListUsers() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const useStyle = createStyles(({ css, token }) => {
    return {
      customTable: css`
        .ant-table {
          .ant-table-container {
            .ant-table-body,
            .ant-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `
    }
  })
  const { styles } = useStyle()

  const [isModalOpenCreateUser, setIsModalOpenCreateUser] = useState(false)
  const [IsModalOpenUpdateUser, setIsModalOpenUpdateUser] = useState(false)
  const [userDetail, setUserDetail] = useState<DataType>()

  const { data: listUsers, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return userApi.getAllUsers()
    }
  })
  const userData = listUsers?.data.result


  const changeStatusUserMutation = useMutation({
    mutationFn: userApi.changeStatusUser
  })

  const handleChangeStatusUser = (user_id_change: string, status: StatusType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changeStatusUserMutation.mutate(
          { user_id_change, status },
          {
            onSuccess: () => {
              swalAlert.notifySuccess('Thông báo', 'Bạn đã thay đổi trạng thái thành công')
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError('Thông báo', error.response?.data.message as string)
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: 'status',
      align: 'center',
      key: '0',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusType.Inactive ? (
            <Button onClick={() => handleChangeStatusUser(record.key, StatusType.Inactive)}>
              <Tag color='volcano'>Inactive</Tag>
            </Button>
          ) : (
            <Button onClick={() => handleChangeStatusUser(record.key, StatusType.Active)}>
              <Tag color='green'>Active</Tag>
            </Button>
          )}
        </>
      )
    },

    {
      title: 'Họ tên',
      width: 150,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Email',
      width: 200,
      dataIndex: 'email',
      align: 'center',
      key: '2',
      sorter: true
    },
    {
      title: 'Điện thoại',
      width: 150,
      dataIndex: 'phone',
      align: 'center',
      key: '3'
    },
    {
      title: 'Ngày sinh',
      width: 150,
      dataIndex: 'date_of_birth',
      align: 'center',
      key: '4'
    },
    {
      title: 'Địa chỉ',
      width: 150,
      dataIndex: 'address',
      align: 'center',
      key: '5'
    },
    {
      title: 'Phân quyền',
      width: 150,
      dataIndex: 'role',
      align: 'center',
      key: '6',
      render: (role) => role.role_name
    },
    {
      title: 'Người tạo',
      width: 200,
      dataIndex: 'created_by',
      align: 'center',
      key: '7'
    },
    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '7'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '8'
    },
    {
      title: 'Thao tác',
      key: '9',
      fixed: 'right',
      dataIndex: 'key',
      width: 200,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Button
            className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => {
              setIsModalOpenUpdateUser(true)

              setUserDetail(record)
            }}
          >
            Sửa quyền
          </Button>
          <Button
            className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-sm'
            // onClick={() => handleDelteCustomer(record.key)}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ]
  const dataSource =
    userData?.map((item) => ({
      key: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      date_of_birth: item.date_of_birth,
      address: item.address,
      role: {
        _id: item.role._id,
        role_name: item.role.role_name
      },
      status: item.status,
      created_by: item.created_by?.name || 'N/A',
      created_at: new Date().toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      updated_at: new Date(item.updated_at).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    })) || []
  return (
    <div className='container'>
      <Helmet>
        <title>Quản lý tài khoản hệ thống - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content style={{ margin: '0 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', paddingTop: 10 }}>
          <Breadcrumb.Item>{paths.Screens.ADMIN_MANAGER_USER}</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='rounded bg-gray-50 p-4 '>
            <div className='grid grid-cols-2'>
              <div className='flex text-lg capitalize mt-1'>Quản lý người dùng hệ thống</div>
              <div className='flex justify-end'>
                <Button
                  className='bg-blue-200/90 text-blue-700 hover:bg-blue-300/90 px-4 py-2 rounded-md font-bold mr-4'
                  // onClick={handleExportFile}
                >
                  <div className='flex'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='size-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                      />
                    </svg>

                    <span className=''>Tải xuống</span>
                  </div>
                </Button>
                <Button
                  className='bg-blue-200/90 text-blue-700 hover:bg-blue-300/90 px-4 py-2 rounded-md font-bold mr-4'
                  onClick={() => {
                    setIsModalOpenCreateUser(true)
                  }}
                >
                  <div className='flex'>
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
                        d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <span className=''>Tạo người dùng</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <Table<DataType>
              className={styles.customTable}
              columns={columns}
              dataSource={dataSource}
              bordered
              size='middle'
              scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
            />
            <ModalCreateUser isModalOpen={isModalOpenCreateUser} setIsModalOpen={setIsModalOpenCreateUser} />
            <ModalUpdateUser
              isModalOpen={IsModalOpenUpdateUser}
              setIsModalOpen={setIsModalOpenUpdateUser}
              userDetail={userDetail as DataType}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}

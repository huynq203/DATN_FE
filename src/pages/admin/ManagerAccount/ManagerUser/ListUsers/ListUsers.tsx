import { useMutation, useQuery } from '@tanstack/react-query'
import { Input, Select, Spin, Table, TableColumnsType, TableProps, Tag, theme, Tooltip, DatePicker } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import { StatusType } from 'src/constants/enum'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import ModalCreateUser from '../components/ModalCreateUser'
import { useEffect, useState } from 'react'
import ModalUpdateUser from '../components/ModalUpdateUser'
import { saveAs } from 'file-saver'
import { User } from 'src/types/user.type'
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
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
  created_by: string
  created_at: string
  updated_at: string
}

export default function ListUsers() {
  const { RangePicker } = DatePicker
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

  const [listUsers, setListUsers] = useState<User[]>([])
  const [rowSelectionIds, setRowSelectionIds] = useState<string[]>([])
  const [isModalOpenCreateUser, setIsModalOpenCreateUser] = useState(false)
  const [IsModalOpenUpdateUser, setIsModalOpenUpdateUser] = useState(false)
  const [userDetail, setUserDetail] = useState<DataType>()
  const [keySearch, setKeySearch] = useState<string>('') // State to hold the search key
  const [status, setStatus] = useState('')
  const [dateStart, setDateStart] = useState<string | null | undefined>(null)
  const [dateEnd, setDateEnd] = useState<string | null | undefined>(null)

  const dataSourceStatus = [
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' }
  ]
  const {
    data: listUser,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['users', { key_search: keySearch, status: status, dateStart: dateStart, dateEnd: dateEnd }], // Include keySearch in the query key to refetch when it changes
    queryFn: () => {
      return userApi.getAllUsers({
        key_search: keySearch,
        status: status,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string
      }) // You can pass a search term here if needed
    }
  })

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
  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      refetch()
    }
  })
  const handleDelteUser = (user_id: string) => {
    swalAlert.showConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate({ user_id })
        swalAlert.notifySuccess('Thông báo', 'Bạn đã xóa bản ghi thành công')
      }
    })
  }
  const exportFileMutation = useMutation({
    mutationFn: userApi.exportFileUser,
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${new Date().toISOString()}_users_list.xlsx`)
    }
  })
  const handleExportFile = () => {
    if (rowSelectionIds.length === 0) {
      swalAlert.notifyError('Thông báo', 'Vui lòng chọn tài khoản để xuất dữ liệu')
      return
    } else {
      swalAlert.showConfirmExportFile(rowSelectionIds.length, 'tài khoản hệ thống').then((result) => {
        if (result.isConfirmed) {
          exportFileMutation.mutate(rowSelectionIds, {
            onSuccess: () => {
              swalAlert.notifySuccess('Thông báo', 'Đang xuất dữ liệu, vui lòng đợi trong giây lát')
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError('Thông báo', error.response?.data.message as string)
              } else {
                swalAlert.notifyError('Thông báo', MESSAGE.SERVER_ERROR)
              }
            }
          })
        }
      })
    }
  }
  const handleResetFilter = () => {
    setKeySearch('')
    setStatus('')
    setDateStart(null)
    setDateEnd(null)
  }
  const handleOnchangeSearchUser = (even: any) => {
    setKeySearch(even.target.value)
  }
  const handleFilterStatus = (value: string) => {
    setStatus(value)
  }
  const onSubmitDate = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    if (value && Array.isArray(value)) {
      setDateStart(value[0]?.toISOString())
      setDateEnd(value[1]?.toISOString())
    }
  }
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setRowSelectionIds(selectedRowKeys as string[])
    }
  }
  const columns: TableColumnsType<DataType> = [
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
      key: '2'
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
      align: 'center',
      dataIndex: 'key',
      width: 150,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Cập nhật người dùng'>
            <Button
              className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalOpenUpdateUser(true)

                setUserDetail(record)
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='size-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip title='Xoá người dùng'>
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => handleDelteUser(record.key)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='size-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]
  const dataSource =
    listUsers?.map((item) => ({
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
      created_at: new Date(item.created_at).toLocaleTimeString('vi-VN', {
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

  // Cập nhật danh sách người dùng khi dữ liệu thay đổi
  useEffect(() => {
    if (listUser?.data.result) {
      setListUsers(listUser?.data.result)
    }
  }, [listUser])
  return (
    <div className=''>
      <Helmet>
        <title>Quản lý tài khoản hệ thống - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý người dùng</div>
        <div className='flex col-span-1 justify-end'>
          <Button
            className='bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md font-bold'
            onClick={handleExportFile}
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
            className='bg-blue-500 text-white hover:text-white hover:bg-blue-700 px-4 py-2 rounded-md font-bold ml-4'
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
              <span className='ml-1'>Tạo người dùng</span>
            </div>
          </Button>
        </div>
      </div>
      <Content>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='rounded-md bg-gray-50 p-2 '>
            <div className='grid grid-cols-4'>
              <div className='flex col-span-1 mt-1 mr-4 '>
                <Input.Search
                  placeholder='Tìm kiếm User theo tên/email/sdt'
                  onChange={handleOnchangeSearchUser}
                  value={keySearch || undefined}
                />
              </div>
              <div className='flex col-span-1 text-lg capitalize mt-1 mr-4'>
                <Select
                  showSearch
                  placeholder='Chọn Trạng thái'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourceStatus}
                  onChange={handleFilterStatus}
                  value={status || undefined}
                />
              </div>
              <div className='flex col-span-1 text-lg capitalize mt-1 mr-4'>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format='YYYY-MM-DD HH:mm'
                  onOk={onSubmitDate}
                  value={dateStart && dateEnd ? [dayjs(dateStart), dayjs(dateEnd)] : null}
                />
              </div>
              <div className='flex col-span-1 mt-1'>
                <Button
                  className='flex h-8 px-2 text-black bg-gray-200 hover:bg-gray-300 text-sm  items-center justify-center rounded-md mr-3'
                  onClick={handleResetFilter}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <Spin tip='Đang tải...' size='large' spinning={isLoading}>
              <Table<DataType>
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                bordered
                size='middle'
                scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
              />
            </Spin>
            <ModalCreateUser
              isModalOpen={isModalOpenCreateUser}
              setIsModalOpen={setIsModalOpenCreateUser}
              onUpdateSuccess={(ListUsers) => {
                setListUsers(ListUsers)
              }}
            />
            <ModalUpdateUser
              isModalOpen={IsModalOpenUpdateUser}
              setIsModalOpen={setIsModalOpenUpdateUser}
              userDetail={userDetail as DataType}
              onUpdateSuccess={(ListUsers) => {
                setListUsers(ListUsers)
              }}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}

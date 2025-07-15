import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Input,
  Select,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  theme,
  DatePicker,
  DatePickerProps,
  TableProps,
  Tooltip
} from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import customerApi from 'src/apis/customer.api'
import Button from 'src/components/Button'
import { paths, resources } from 'src/constants'
import { StatusType } from 'src/constants/enum'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { saveAs } from 'file-saver'
import { useEffect, useState } from 'react'
import { Customer } from 'src/types/customer.type'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
interface DataType {
  key: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  status: number
  created_at: string
  updated_at: string
}
export default function ListCustomers() {
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
  const [listCustomers, setListCustomers] = useState<Customer[]>([])
  const [rowSelectionIds, setRowSelectionIds] = useState<string[]>([])
  const [keySearch, setKeySearch] = useState<string>('')
  const [status, setStatus] = useState('')
  const [dateStart, setDateStart] = useState<string | null | undefined>(null)
  const [dateEnd, setDateEnd] = useState<string | null | undefined>(null)

  const dataSourceStatus = [
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' }
  ]
  const {
    data: CustomerData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ['customers', { key_search: keySearch, status: status, dateStart: dateStart, dateEnd: dateEnd }],
    queryFn: () => {
      return customerApi.getAllCustomers({
        key_search: keySearch,
        status: status,
        dateStart: dateStart as string,
        dateEnd: dateEnd as string
      })
    }
  })

  const deleteCustomerMutation = useMutation({
    mutationFn: customerApi.deleteCustomer
  })

  const handleDelteCustomer = (customer_id: string) => {
    swalAlert.showConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        deleteCustomerMutation.mutate(
          { customer_id },
          {
            onSuccess: () => {
              swalAlert.notifySuccess('Bạn đã xóa bản ghi thành công')
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
  }

  const changeStatusCustomerMutation = useMutation({
    mutationFn: customerApi.changeStatusCustomer
  })

  const handleChangeStatusCustomer = (customer_id: string, status: StatusType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changeStatusCustomerMutation.mutate(
          { customer_id, status },
          {
            onSuccess: () => {
              swalAlert.notifySuccess('Bạn đã thay đổi trạng thái thành công')
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else {
                swalAlert.notifyError(MESSAGE.SERVER_ERROR)
              }
            }
          }
        )
      }
    })
  }

  const exportFileCustomerMutation = useMutation({
    mutationFn: customerApi.exportFileCustomer,
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${new Date().toISOString()}_customers_list.xlsx`)
    }
  })
  const handleExportFile = () => {
    if (rowSelectionIds.length === 0) {
      swalAlert.notifyError('Vui lòng chọn khách hàng để xuất dữ liệu')
      return
    } else {
      swalAlert.showConfirmExportFile(rowSelectionIds.length, 'khách hàng').then((result) => {
        if (result.isConfirmed) {
          exportFileCustomerMutation.mutate(rowSelectionIds, {
            onSuccess: () => {
              swalAlert.notifySuccess('Đang xuất dữ liệu, vui lòng đợi trong giây lát')
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else {
                swalAlert.notifyError(MESSAGE.SERVER_ERROR)
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

  const handleOnchangeSearchCustomer = (event: any) => {
    setKeySearch(event.target.value)
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
      width: 250,
      dataIndex: 'email',
      align: 'center',
      key: '2'
    },
    {
      title: 'Điện thoại',
      width: 100,
      dataIndex: 'phone',
      align: 'center',
      key: '3'
    },
    {
      title: 'Ngày sinh',
      width: 100,
      dataIndex: 'date_of_birth',
      align: 'center',
      key: '4'
    },
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: 'status',
      align: 'center',
      key: '5',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusType.Inactive ? (
            <Button onClick={() => handleChangeStatusCustomer(record.key, StatusType.Inactive)}>
              <Tag color='volcano'>Inactive</Tag>
            </Button>
          ) : (
            <Button onClick={() => handleChangeStatusCustomer(record.key, StatusType.Active)}>
              <Tag color='green'>Active</Tag>
            </Button>
          )}
        </>
      )
    },
    {
      title: 'Ngày tạo',
      width: 150,
      dataIndex: 'created_at',
      align: 'center',
      key: '6'
    },
    {
      title: 'Ngày cập nhật',
      width: 150,
      dataIndex: 'updated_at',
      align: 'center',
      key: '7'
    },
    {
      title: 'Thao tác',
      key: '8',
      fixed: 'right',
      dataIndex: 'key',
      align: 'center',
      width: 150,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Chi tiết khách hàng'>
            <Link
              to={`${paths.Screens.ADMIN_MANAGER_CUSTOMER}/${record.key}`}
              className='flex h-9 px-3   text-white bg-gray-400/90 text-sm hover:bg-gray-500 hover:text-white flex items-center justify-center rounded-md'
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
                  d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
                />
              </svg>
            </Link>
          </Tooltip>
          <Tooltip title='Xóa khách hàng'>
            <Button
              className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => handleDelteCustomer(record.key)}
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
    listCustomers?.map((item) => ({
      key: item._id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      date_of_birth: new Date(item.date_of_birth).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      status: item.status,
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

  useEffect(() => {
    if (CustomerData?.data.result) {
      setListCustomers(CustomerData?.data.result)
    }
  }, [CustomerData])
  return (
    <div className=''>
      <Helmet>
        <title>Quản lý khách hàng - YOYO Store</title>
        <meta name='description' content='Quản lý khách hàngs YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý khách hàng</div>
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

              <span className=''>Xuất dữ liệu</span>
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
          <div className='rounded bg-gray-50 p-2 '>
            <div className='grid grid-cols-4'>
              <div className='flex col-span-1 text-lg capitalize mt-1 mr-4'>
                <Input.Search
                  placeholder='Tìm kiếm KH theo tên/email/sdt'
                  onChange={handleOnchangeSearchCustomer}
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
          </div>
        </div>
      </Content>
    </div>
  )
}

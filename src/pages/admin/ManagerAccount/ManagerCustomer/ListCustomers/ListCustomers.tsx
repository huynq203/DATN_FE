import { useMutation, useQuery } from '@tanstack/react-query'
import { Breadcrumb, Table, TableColumnsType, Tag, theme } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import React from 'react'
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

  const { data: listCustomers, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => {
      return customerApi.getAllCustomers()
    }
  })
  const customerData = listCustomers?.data.result

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
              swalAlert.notifySuccess('Thông báo', 'Bạn đã xóa bản ghi thành công')
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
            <Tag color='volcano'>Inactive</Tag>
          ) : (
            <Tag color='green'>Active</Tag>
          )}
        </>
      )
    },

    {
      title: 'Họ tên',
      width: 200,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Email',
      width: 300,
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
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '5'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '6'
    },
    {
      title: 'Thao tác',
      key: '7',
      fixed: 'right',
      dataIndex: 'key',
      width: 200,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Link
            to={`${paths.Screens.ADMIN_MANAGER_CUSTOMER}/${record.key}`}
            className='flex h-9 px-3   text-white bg-blue-500/90 text-sm hover:bg-blue-400 hover:text-white flex items-center justify-center rounded-sm'
          >
            Xem chi tiết
          </Link>
          <Button
            className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => handleDelteCustomer(record.key)}
          >
            Xóa
          </Button>
        </div>
      )
    }
  ]
  const dataSource =
    customerData?.map((item) => ({
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

  return (
    <div className='container'>
      <Helmet>
        <title>Quản lý khách hàng - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content style={{ margin: '0 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', paddingTop: 10 }}>
          <Breadcrumb.Item>{paths.Screens.ADMIN_MANAGER_CUSTOMER}</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='grid grid-cols-2'>
            <div className='flex '>Quản lý khách hàng</div>
            <div className='flex justify-end'>
              <Button className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold mr-4'>
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
          </div>
        </div>
      </Content>
    </div>
  )
}

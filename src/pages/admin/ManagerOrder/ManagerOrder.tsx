import { useQuery } from '@tanstack/react-query'
import { Input, Select, Spin, Table, TableColumnsType, TableProps, Tag, theme, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import orderApi from 'src/apis/order.api'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import { OrderStatus, PaymentMethod, PaymentStatus } from 'src/constants/enum'
import { OrderManagerResponse } from 'src/types/order.type'
interface DataType {
  key: string
  code_order: string
  address: {
    name: string
    phone: string
    address: string
  }
  order_status: number
  payment_method: number
  payment_status: number
  created_at: string
}
export default function ManagerOrder() {
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
  const [listOrders, setListOrder] = useState<OrderManagerResponse[]>([])
  const [rowSelectionIds, setRowSelectionIds] = useState<string[]>([])
  const [keySearch, setKeySearch] = useState('')
  const {
    data: OrderData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [
      'orders',
      {
        key_search: keySearch
      }
    ],
    queryFn: () => {
      return orderApi.getOrderManager({
        key_search: keySearch
      })
    }
  })

  const dataSourceOrderStatus = [
    {
      label: 'Chờ thanh toán',
      value: OrderStatus.WaitPayment
    },
    {
      label: 'Chờ xác nhận',
      value: OrderStatus.WaitConfirmed
    },
    {
      label: 'Chờ lấy hàng',
      value: OrderStatus.WaitForGetting
    },
    {
      label: 'Chờ giao hàng',
      value: OrderStatus.WaitDelivery
    },
    {
      label: 'Đang giao hàng',
      value: OrderStatus.OnDelevery
    },
    {
      label: 'Thành công',
      value: OrderStatus.Success
    },
    {
      label: 'Đã hủy',
      value: OrderStatus.Cancel
    }
  ]

  const dataSourcePaymentMethod = [
    {
      label: 'COD',
      value: PaymentMethod.COD
    },
    {
      label: 'VNPAY',
      value: PaymentMethod.VNPAY
    }
  ]
  const dataSourcePaymentStatus = [
    {
      label: 'Chưa thanh toán',
      value: PaymentStatus.Unpaid
    },
    {
      label: 'Đã thanh toán',
      value: PaymentStatus.Paid
    }
  ]
  const handleResetFilter = () => {
    setKeySearch('')
    refetch()
  }
  const handleChangeKeySearch = (event: any) => {
    setKeySearch(event.target.value)
  }
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setRowSelectionIds(selectedRowKeys as string[])
    }
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Mã đơn hàng',
      width: 100,
      dataIndex: 'code_order',
      align: 'center',
      key: '0'
    },
    {
      title: 'TT người mua',
      width: 170,

      align: 'left',
      key: '1',
      render: (_, record: DataType) => (
        <div className='flex flex-col  gap-1'>
          <span className='text-sm font-semibold'>{record.address.name}</span>
          <span className='text-xs text-gray-500'>{record.address.phone}</span>
          <span className='text-xs text-gray-500'>{record.address.address}</span>
        </div>
      )
    },
    {
      title: 'TT đơn hàng',
      width: 100,
      align: 'center',
      key: '1',
      render: (_, record: DataType) => {
        return record.order_status === OrderStatus.WaitPayment ? (
          <Tag color='gray'>Chờ thanh toán</Tag>
        ) : record.order_status === OrderStatus.WaitConfirmed ? (
          <Tag color='yellow'>Chờ xác nhận</Tag>
        ) : record.order_status === OrderStatus.WaitForGetting ? (
          <Tag color='blue'>Chờ lấy hàng</Tag>
        ) : record.order_status === OrderStatus.WaitDelivery ? (
          <Tag color='orange'>Chờ giao hàng</Tag>
        ) : record.order_status === OrderStatus.OnDelevery ? (
          <Tag color='green'>Đang giao hàng</Tag>
        ) : record.order_status === OrderStatus.Success ? (
          <Tag color='green'>Thành công</Tag>
        ) : (
          <Tag color='red'>Đã hủy</Tag>
        )
      }
    },
    {
      title: 'PT thanh toán',
      width: 120,
      align: 'center',
      key: '1',
      render: (_, record: DataType) => (
        <div className='flex justify-center items-center gap-1'>
          {record.payment_method === PaymentMethod.COD ? (
            <Tag color='default'>COD</Tag>
          ) : record.payment_method === PaymentMethod.MOMO ? (
            <Tag color='magenta'>MOMO</Tag>
          ) : (
            <Tag color='volcano'>VNPAY</Tag>
          )}
        </div>
      )
    },
    {
      title: 'TT thanh toán',
      width: 100,
      align: 'center',
      key: '1',
      render: (_, record: DataType) => (
        <div className='flex justify-center items-center gap-1'>
          {record.payment_status === PaymentStatus.Unpaid ? (
            <Tag color='red'>Chưa thanh toán</Tag>
          ) : (
            <Tag color='green'>Đã thanh toán</Tag>
          )}
        </div>
      )
    },

    {
      title: 'Thời gian đặt hàng',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '8'
    },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      align: 'center',
      width: 50,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Xem chi tiết đơn hàng'>
            {' '}
            <Button
              className='flex h-9 px-3 text-white bg-blue-500/90 text-sm hover:bg-blue-400 hover:text-white items-center justify-center rounded-md '
              onClick={() => {}}
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
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]
  useEffect(() => {
    if (OrderData?.data.result) {
      setListOrder(OrderData.data.result)
    }
  }, [OrderData])
  const dataSource =
    listOrders?.map((item) => ({
      key: item._id,
      code_order: item.code_order,
      address: {
        name: item.address.name,
        phone: item.address.phone,
        address: item.address.address
      },
      order_status: item.order_status,
      payment_method: item.payment_method,
      payment_status: item.payment_status,
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
  console.log(listOrders)

  return (
    <div>
      <Helmet>
        <title>Quản lý đơn hàng - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <div className='rounded-md grid grid-cols-2 bg-gray-50 p-2 m-2'>
        <div className='flex col-span-1 text-lg font-bold capitalize mt-1'>Quản lý đơn hàng</div>
        <div className='flex col-span-1 justify-end'>
          <Button className='bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md font-bold mr-4'>
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

              <span className='ml-1'>Xuất dữ liệu</span>
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
            <div className=' grid grid-cols-11'>
              <div className='flex col-span-3 text-lg capitalize mt-1 ml-3'>
                <Input.Search
                  placeholder='Tìm kiếm mã đh/tên kh/sđt...'
                  onChange={handleChangeKeySearch}
                  value={keySearch || undefined}
                />
              </div>
              <div className='flex  col-span-2 capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Trạng thái đơn hàng'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourceOrderStatus}
                />
              </div>
              <div className='flex col-span-2  capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Phương thức thanh toán'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourcePaymentMethod}
                />
              </div>
              <div className='flex col-span-2 capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Trạng thái thanh toán'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourcePaymentStatus}
                />
              </div>
              <div className='flex col-span-1  capitalize mt-1 ml-3'>
                <Tooltip title='Reset bộ lọc tìm kiếm'>
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
                </Tooltip>
                <Tooltip title='Tìm kiếm nâng cao'>
                  {' '}
                  <Button className='flex h-8 px-2 text-black bg-gray-200 hover:bg-gray-300 items-center justify-center rounded-md'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
                      />
                    </svg>
                  </Button>
                </Tooltip>
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

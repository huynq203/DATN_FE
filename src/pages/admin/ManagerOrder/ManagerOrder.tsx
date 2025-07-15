import { useMutation, useQuery } from '@tanstack/react-query'
import { DatePicker, Input, Select, Spin, Table, TableColumnsType, TableProps, Tag, theme, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import orderApi from 'src/apis/order.api'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import { OrderStatus, PaymentMethod, PaymentStatus } from 'src/constants/enum'
import { OrderResponse } from 'src/types/order.type'
import {  isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import ModalListProductDetail from './components/ModalListProductDetail'
import ModalChangeOrderStatus from './components/ModalChangeOrderStatus'
import swalAlert from 'src/utils/SwalAlert'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'
import { toast } from 'react-toastify'
import { saveAs } from 'file-saver'
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
  total_price: number
  discount_price: number
  created_at: string
}
export default function ManagerOrder() {
  const { RangePicker } = DatePicker
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const useStyle = createStyles(({ css }) => {
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

  const [listOrders, setListOrder] = useState<OrderResponse[]>([])
  const [rowSelectionIds, setRowSelectionIds] = useState<string[]>([])
  const [keySearch, setKeySearch] = useState('')
  const [FilterOrderStatus, setFilterOrderStatus] = useState<string | undefined>(undefined)
  const [FilterPaymentMethod, setFilterPaymentMethod] = useState<string | undefined>(undefined)
  const [FilterPaymentStatus, setFilterPaymentStatus] = useState<string | undefined>(undefined)
  const [dateStart, setDateStart] = useState<string | null | undefined>(null)
  const [dateEnd, setDateEnd] = useState<string | null | undefined>(null)
  const [isModelOpen, setIsModalOpen] = useState(false)
  const [isModelOpenChangeOrderStatus, setIsModelOpenChangeOrderStatus] = useState(false)
  const [orderDetailId, setOrderDetailId] = useState('')
  const [orderStatus, setOrderStatus] = useState<number>()
  const [codeOrder, setCodeOrder] = useState('')

  const {
    data: OrderData,
    refetch,
    isLoading
  } = useQuery({
    queryKey: [
      'orders',
      {
        key_search: keySearch,
        order_status: FilterOrderStatus,
        payment_method: FilterPaymentMethod,
        payment_status: FilterPaymentStatus,
        date_start: dateStart,
        date_end: dateEnd
      }
    ],
    queryFn: () => {
      return orderApi.getOrderManager({
        key_search: keySearch,
        order_status: FilterOrderStatus as string,
        payment_method: FilterPaymentMethod as string,
        payment_status: FilterPaymentStatus as string,
        date_start: dateStart as string,
        date_end: dateEnd as string
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
    setFilterOrderStatus(undefined)
    setFilterPaymentMethod(undefined)
    setFilterPaymentStatus(undefined)
    setDateStart(null)
    setDateEnd(null)
    refetch()
  }
  const handleChangeKeySearch = (event: any) => {
    setKeySearch(event.target.value)
  }
  const handleChangeOrderStatus = (value: string) => {
    setFilterOrderStatus(value)
  }
  const handleChangePaymentMethod = (value: string) => {
    setFilterPaymentMethod(value)
  }
  const handleChangePaymentStatus = (value: string) => {
    setFilterPaymentStatus(value)
  }
  const onSubmitDate = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    if (value && Array.isArray(value)) {
      setDateStart(value[0]?.toISOString())
      setDateEnd(value[1]?.toISOString())
    }
  }
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setRowSelectionIds(selectedRowKeys as string[])
    }
  }
  const exportFileMutation = useMutation({
    mutationFn: orderApi.exportFileOrder,
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${new Date().toISOString()}_orders_list.xlsx`)
    }
  })
  const handleExportFile = () => {
    if (rowSelectionIds.length === 0) {
      swalAlert.notifyError('Vui lòng chọn đơn hàng để xuất dữ liệu')
      return
    } else {
      swalAlert.showConfirmExportFile(rowSelectionIds.length, 'đơn hàng').then((result) => {
        if (result.isConfirmed) {
          exportFileMutation.mutate(rowSelectionIds, {
            onSuccess: () => {
              swalAlert.notifySuccess('Đang xuất dữ liệu, vui lòng đợi trong giây lát')
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                swalAlert.notifyError(error.response?.data.message as string)
              } else if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
                toast.error(error.response?.data.message, { autoClose: 1000 })
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          })
        }
      })
    }
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Mã đơn hàng',
      width: 170,
      dataIndex: 'code_order',
      align: 'left',
      key: '0',
      render: (_, record: DataType) => {
        return (
          <div className='flex flex-col'>
            <span className='ml-1 text-black font-bold'>{record.code_order}</span>
            <div className='flex justify-between'>
              <span className='text-gray-500 ml-1'>Tổng tiền hàng: </span>
              <span className='ml-3 text-green-500 font-bold'>
                {record.total_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500 ml-1'>Giảm giá: </span>
              <span className='ml-3 text-red-500 font-bold'>
                {record.discount_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          </div>
        )
      }
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
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='gray'>Chờ thanh toán</Tag>
          </Button>
        ) : record.order_status === OrderStatus.WaitConfirmed ? (
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='yellow'>Chờ xác nhận</Tag>
          </Button>
        ) : record.order_status === OrderStatus.WaitForGetting ? (
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='blue'>Chờ lấy hàng</Tag>
          </Button>
        ) : record.order_status === OrderStatus.WaitDelivery ? (
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='orange'>Chờ giao hàng</Tag>
          </Button>
        ) : record.order_status === OrderStatus.OnDelevery ? (
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='green'>Đang giao hàng</Tag>
          </Button>
        ) : record.order_status === OrderStatus.Success ? (
          <Button
            onClick={() => {
              setIsModelOpenChangeOrderStatus(true)
              setOrderDetailId(record.key)
              setOrderStatus(record.order_status)
            }}
          >
            <Tag color='green'>Thành công</Tag>
          </Button>
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
              className='flex h-9 px-3 text-white bg-gray-400/90 text-sm hover:bg-gray-500 hover:text-white items-center justify-center rounded-md '
              onClick={() => {
                setIsModalOpen(true)
                setOrderDetailId(record.key)
                setCodeOrder(record.code_order)
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
                  d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
                />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]

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
      total_price: item.total_price,
      discount_price: item.discount_price,

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
    if (OrderData?.data.result) {
      setListOrder(OrderData.data.result)
    }
  }, [OrderData])
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
          <Button
            className='bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md font-bold mr-4'
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
            <div className=' grid grid-cols-12'>
              <div className='flex col-span-2 text-lg capitalize mt-1 ml-3'>
                <Input.Search
                  placeholder='Tìm kiếm mã đh/tên/sđt...'
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
                  onChange={handleChangeOrderStatus}
                  value={FilterOrderStatus !== null && FilterOrderStatus !== undefined ? FilterOrderStatus : undefined}
                />
              </div>
              <div className='flex col-span-2  capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Phương thức thanh toán'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourcePaymentMethod}
                  onChange={handleChangePaymentMethod}
                  value={
                    FilterPaymentMethod !== null && FilterPaymentMethod !== undefined ? FilterPaymentMethod : undefined
                  }
                />
              </div>
              <div className='flex col-span-2 capitalize mt-1 ml-3'>
                <Select
                  showSearch
                  placeholder='Trạng thái thanh toán'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  className='w-full'
                  options={dataSourcePaymentStatus}
                  onChange={handleChangePaymentStatus}
                  value={
                    FilterPaymentStatus !== null && FilterPaymentStatus !== undefined ? FilterPaymentStatus : undefined
                  }
                />
              </div>
              <div className='flex col-span-3 text-lg capitalize mt-1 ml-3'>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format='YYYY-MM-DD HH:mm'
                  onOk={onSubmitDate}
                  value={dateStart && dateEnd ? [dayjs(dateStart), dayjs(dateEnd)] : null}
                />
              </div>
              <div className='flex col-span-1 capitalize mt-1 ml-3'>
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
                {/* <Tooltip title='Tìm kiếm nâng cao'>
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
                </Tooltip> */}
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
            <ModalListProductDetail
              isModalOpen={isModelOpen}
              setIsModalOpen={setIsModalOpen}
              orderId={orderDetailId}
              order_code={codeOrder}
            />
            <ModalChangeOrderStatus
              isModalOpen={isModelOpenChangeOrderStatus}
              setIsModalOpen={setIsModelOpenChangeOrderStatus}
              order_id={orderDetailId}
              order_status={orderStatus}
              onUpdateSuccess={(listOrder) => {
                setListOrder(listOrder)
              }}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}

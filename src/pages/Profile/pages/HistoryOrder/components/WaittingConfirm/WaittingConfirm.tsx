import { useMutation, useQuery } from '@tanstack/react-query'
import { Table, TableColumnsType, Tag, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { useState } from 'react'
import { toast } from 'react-toastify'
import orderApi from 'src/apis/order.api'
import Button from 'src/components/Button'
import { PaymentMethod, PaymentStatus } from 'src/constants/enum'
import { OrderResponse } from 'src/types/order.type'
import swalAlert from 'src/utils/SwalAlert'
import { formatCurrency } from 'src/utils/utils'
import ModalOrderDetail from '../ModalOrderDetail'

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
interface Props {
  listOrder: OrderResponse[]
}
export default function WaittingConfirm({ listOrder }: Props) {
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [orderCode, setOrderCode] = useState<string>('')
  const cancelOrderMutation = useMutation({
    mutationFn: orderApi.cancelOrder
  })
  const handleCancelOrder = (orderId: string) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        cancelOrderMutation.mutate(
          { order_id: orderId },
          {
            onSuccess: (res) => {
              window.location.reload()
            },
            onError: (error) => {}
          }
        )
      }
    })
  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Mã đơn hàng',
      width: 230,
      dataIndex: 'code_order',
      align: 'left',
      key: '0',
      render: (_, record: DataType) => {
        return (
          <div className='flex flex-col'>
            <span className='ml-1 text-black font-bold'>{record.code_order}</span>
            <div className='flex justify-between'>
              <span className='text-gray-500 ml-1'>Tổng tiền hàng: </span>
              <span className='ml-3 text-green-500 font-bold'>{formatCurrency(record.total_price)} đ</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500 ml-1'>Giảm giá: </span>
              <span className='ml-3 text-red-500 font-bold'>{formatCurrency(record.discount_price)} đ</span>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Thông tin địa chỉ',
      width: 300,

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
      title: 'Phương thức thanh toán',
      width: 150,
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
      title: 'Trạng thái thanh toán',
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
              onClick={() => {
                setIsModalOpen(true)
                setOrderId(record.key)
                setOrderCode(record.code_order)
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
          <Tooltip title='Hủy đơn hàng'>
            {' '}
            <Button
              className='flex h-9 px-3 text-white bg-red-500/90 text-sm hover:bg-red-400 hover:text-white items-center justify-center rounded-md '
              onClick={() => handleCancelOrder(record.key)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='size-6'
              >
                <path stroke-linecap='round' stroke-linejoin='round' d='M6 18 18 6M6 6l12 12' />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]

  const dataSource =
    listOrder?.map((item) => ({
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
  return (
    <div>
      <Table<DataType>
        className={styles.customTable}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 'max-content' }}
      />
      <ModalOrderDetail
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        orderId={orderId}
        order_code={orderCode}
      />
    </div>
  )
}

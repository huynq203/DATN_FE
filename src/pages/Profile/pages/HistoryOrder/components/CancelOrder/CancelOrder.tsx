import { Table, TableColumnsType, Tag } from 'antd'
import { createStyles } from 'antd-style'
import { PaymentMethod } from 'src/constants/enum'
import { OrderResponse } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'

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
export default function CancelOrder({ listOrder }: Props) {
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
      title: 'Thời gian đặt hàng',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '8'
    },
    {
      title: 'Thời gian hủy đơn',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '8'
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
    <Table<DataType>
      className={styles.customTable}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
    />
  )
}

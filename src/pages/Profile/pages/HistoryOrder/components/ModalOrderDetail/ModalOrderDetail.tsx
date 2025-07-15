import { useQuery } from '@tanstack/react-query'
import { Modal, Spin, Table, TableColumnsType, theme } from 'antd'
import { createStyles } from 'antd-style'
import { useState } from 'react'
import orderApi from 'src/apis/order.api'
import Button from 'src/components/Button'
import ModalRating from '../ModalRating'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  orderId?: string
  orderCode?: string
  orderStatus?: number
}
interface DataType {
  key: string
  product_id: {
    _id: string
    name: string
  }
  quantity: number
  size: number
  color: string
  cost_price: number
  price: number
  image: string
}
export default function ModalOrderDetail({ isModalOpen, setIsModalOpen, orderId, orderCode, orderStatus }: Props) {
  const {
    token: {}
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
  const [isModalOpenRating, setIsModalOpenRating] = useState(false)
  const [productId, setProductId] = useState<string>('')
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { data: OrderDetailData, isLoading } = useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () => {
      return orderApi.getOrderDetail({ order_id: orderId as string })
    }
  })
  const orderDetailList = OrderDetailData?.data.result

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      align: 'left',
      width: 100,
      render: (_, record: DataType) => (
        <div className='flex'>
          <img src={record.image} alt={record.product_id.name} className='w-20 h-20 object-cover mr-4 rounded-md' />
          <div className='flex flex-col'>
            <span className='font-medium'>{record.product_id.name}</span>
            <span className='text-sm text-gray-500'>Kích thước: {record.size}</span>
            <span className='text-sm text-gray-500'>Màu sắc: {record.color}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 50,
      render: (value) => <span className='font-medium'>{value}</span>
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: 80,
      render: (value) => (
        <span className='text-black font-semibold'>
          {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      )
    },
    {
      title: 'Tổng tiền',

      key: 'price',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <span className='text-black font-semibold'>
          {(record.price * record.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      )
    },
    {
      title: 'Đánh giá',
      key: 'price',
      align: 'center',
      width: 80,
      render: (_, record) => (
        <Button
          disabled={orderStatus !== 5}
          onClick={() => {
            setIsModalOpenRating(true)
            setProductId(record.product_id._id)
          }}
        >
          <span className={orderStatus === 5 ? 'text-blue-600' : 'text-gray-500'}>Đánh giá</span>
        </Button>
      )
    }
  ]

  const dataSource =
    orderDetailList?.map((item) => ({
      key: item._id,
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      cost_price: item.cost_price,
      price: item.price,
      image: item.image
    })) || []

  return (
    <>
      <Modal
        title={`Danh sách chi tiết sản phẩm trong đơn hàng: ${orderCode}`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        centered
        width={900}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin tip='Đang tải...' size='large' spinning={isLoading}>
          <div className='mt-5'>
            <Table<DataType>
              className={styles.customTable}
              columns={columns}
              dataSource={dataSource}
              bordered
              size='small'
            />
          </div>
        </Spin>
      </Modal>
      <ModalRating
        isModalOpen={isModalOpenRating}
        setIsModalOpen={setIsModalOpenRating}
        productId={productId}
        orderId={orderId}
      />
    </>
  )
}

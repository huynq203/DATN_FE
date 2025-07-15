import { useQuery } from '@tanstack/react-query'
import { Modal, Spin, Table, TableColumnsType, TableProps, theme } from 'antd'
import { createStyles } from 'antd-style'
import { useState } from 'react'
import orderApi from 'src/apis/order.api'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  orderId?: string
  order_code?: string
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
export default function ModalListProductDetail({ isModalOpen, setIsModalOpen, orderId, order_code }: Props) {
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

  // const columns: TableColumnsType<DataType> = [
  //   {
  //     title: 'Sản phẩm',
  //     width: 50,
  //     dataIndex: 'size',
  //     align: 'left',
  //     key: '0',
  //     render: (_, record: DataType) => {
  //       return (
  //         <div className='flex flex-col'>
  //           <span>{record.product_id.name}</span>
  //           <span className='text-sm text-gray-500'>Kích thước: {record.size}</span>
  //           <span className='text-sm text-gray-500'>Màu sắc: {record.color}</span>
  //         </div>
  //       )
  //     }
  //   },
  //   {
  //     title: 'Số tiền lãi',
  //     width: 50,
  //     align: 'center',
  //     key: '3',
  //     render: (_, record: DataType) => {
  //       const profit = (record.price - record.cost_price) * record.quantity
  //       return <span className='text-green-500'>{profit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
  //     }
  //   },
  //   {
  //     title: 'Giá bán',
  //     width: 50,
  //     dataIndex: 'price',
  //     align: 'center',
  //     key: '2',
  //     render: (text) => {
  //       return <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
  //     }
  //   },
  //   {
  //     title: 'Giá nhập',
  //     width: 50,
  //     dataIndex: 'cost_price',
  //     align: 'center',
  //     key: '2',
  //     render: (text) => {
  //       return <span>{text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
  //     }
  //   },
  //   {
  //     title: 'Số lượng',
  //     width: 50,
  //     dataIndex: 'quantity',
  //     align: 'center',
  //     key: '3'
  //   }
  // ]
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      align: 'left',
      width: 130,
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
      title: 'Giá nhập',
      dataIndex: 'cost_price',
      key: 'cost_price',
      align: 'center',
      width: 80,
      render: (value) => (
        <span className='text-gray-700'>{value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
      )
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: 80,
      render: (value) => (
        <span className='text-blue-600 font-semibold'>
          {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      )
    },
    {
      title: 'Lợi nhuận',
      key: 'profit',
      align: 'center',
      width: 100,
      render: (_, record: DataType) => {
        const profit = (record.price - record.cost_price) * record.quantity
        const isPositive = profit >= 0
        return (
          <span className={isPositive ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
            {profit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        )
      }
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
    <Modal
      title={`Danh sách chi tiết sản phẩm trong đơn hàng: ${order_code}`}
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      width={800}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Spin tip='Đang tải...' size='large' spinning={isLoading}>
        <div className='grid grid-cols-3'>
          <div className='col-spans-1 justify-between flex'>
            <span className='text-gray-500 '>Tổng sản phẩm: </span>
            <span className='text-black font-bold'>{dataSource.length} sản phẩm</span>
          </div>
        </div>
        <div className='grid grid-cols-3'>
          <div className='col-spans-1 justify-between flex'>
            <span className='text-gray-500 '>Tổng số tiền: </span>
            <span className='text-black font-bold'>
              {dataSource
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
            </span>
          </div>
        </div>
        <div className='grid grid-cols-3'>
          <div className='col-spans-1 justify-between flex'>
            <span className='text-gray-500 '>Tổng lợi nhuận: </span>
            <span className='text-green-500 font-bold'>
              {dataSource
                .reduce((total, item) => total + (item.price - item.cost_price) * item.quantity, 0)
                .toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
            </span>
          </div>
        </div>

        <div className='mt-5'>
          <Table<DataType>
            className={styles.customTable}
            columns={columns}
            dataSource={dataSource}
            bordered
            size='middle'
          />
        </div>
      </Spin>
    </Modal>
  )
}

import { useQuery } from '@tanstack/react-query'
import { Modal, Spin, Table, TableColumnsType, theme } from 'antd'
import { createStyles } from 'antd-style'
import { useEffect } from 'react'
import scheduleProductApi from 'src/apis/scheduleProduct.api'
import { PromotionPriceType } from 'src/constants/enum'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  scheduleProduct_id?: string
}
interface DataType {
  key: string
  code_product: string
  name: string
  price_discount: string
  url_image: string
}
export default function ModalProductDetail({ isModalOpen, setIsModalOpen, scheduleProduct_id }: Props) {
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

  const { data: scheduleProductDetail } = useQuery({
    queryKey: ['scheduleProductDetail', { scheduleProductId: scheduleProduct_id as string }],
    queryFn: () => scheduleProductApi.getScheduleProductById({ scheduleProductId: scheduleProduct_id as string })
  })
  const listProductDetail = scheduleProductDetail?.data.result.products_mapped

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Sản phẩm',
      width: 150,
      align: 'left',
      key: '3',
      render: (_, record: DataType) => (
        <div className='flex gap-2'>
          <img src={record.url_image} alt={record.name} className='w-20 h-20 object-cover rounded' />
          <div className='flex flex-col'>
            <span>{record.name}</span>
            <span className='text-gray-500'>{record.code_product}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Giá khuyến mãi dự kiến',
      width: 200,
      dataIndex: 'price_discount',
      align: 'center',
      key: '4'
    }
  ]

  const dataSource =
    listProductDetail?.map((item) => ({
      key: item._id,
      code_product: item.code_product,
      name: item.name,
      price_discount: item.price_discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      url_image: item.url_image.url
    })) || []

  return (
    <Modal
      title={'Danh sách chi tiết sản phẩm giảm giá'}
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      width={700}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Table<DataType> className={styles.customTable} columns={columns} dataSource={dataSource} bordered size='small' />
    </Modal>
  )
}

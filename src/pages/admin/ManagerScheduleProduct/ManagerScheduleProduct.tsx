import { useQuery } from '@tanstack/react-query'
import { Modal, Spin, Table, TableColumnsType, Tag, theme, Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import scheduleProductApi from 'src/apis/scheduleProduct.api'
import Button from 'src/components/Button'
import { resources } from 'src/constants'
import { PromotionPriceType, StatusScheduleProduct, StatusType } from 'src/constants/enum'
import ModalProductDetail from './components/ModalProductDetail'
import ModalUpdateScheduleProduct from './components/ModalUpdateScheduleProduct/ModalUpdateScheduleProduct'
interface DataType {
  key: string
  promotion_type: number
  name: string
  price_value: number
  status: number
  time_start: string
  time_end: string
  created_by: string
  created_at: string
  updated_at: string
}
export default function ManagerScheduleProduct() {
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [scheduleProductId, setScheduleProductId] = useState<string>('')

  const { data: ScheduleProductsData, isLoading } = useQuery({
    queryKey: ['listScheduleProducts'],
    queryFn: () => {
      return scheduleProductApi.getAllScheduleProduct()
    }
  })

  const listScheduleProducts = ScheduleProductsData?.data.result

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Trạng thái',
      width: 100,
      align: 'center',
      key: '0',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusScheduleProduct.Ready ? (
            <Button>
              <Tag color='gray'>Đang chờ</Tag>
            </Button>
          ) : record.status === StatusScheduleProduct.Running ? (
            <Button>
              <Tag color='green'>Đang chạy</Tag>
            </Button>
          ) : (
            <Button>
              <Tag color='red'>Kết thúc</Tag>
            </Button>
          )}
        </>
      )
    },

    {
      title: 'Chương trình khuyến mãi',
      width: 200,
      dataIndex: 'name',
      align: 'center',
      key: '1'
    },
    {
      title: 'Kiểu khuyến mãi',
      width: 180,
      align: 'center',
      key: '2',
      render: (_, record: DataType) => (
        <>
          {record.promotion_type === PromotionPriceType.Percentage ? (
            <span>Giảm giá theo %</span>
          ) : record.promotion_type === PromotionPriceType.Fixed ? (
            <span>Giảm giá theo giá cố định</span>
          ) : (
            <span>Giảm giá theo giá khuyến mãi</span>
          )}
        </>
      )
    },
    {
      title: 'Giá trị khuyến mãi',
      width: 150,

      align: 'center',
      key: '3',
      render: (_, record: DataType) => (
        <>
          {record.promotion_type === PromotionPriceType.Percentage ? (
            <span>{record.price_value} %</span>
          ) : (
            <span>{record.price_value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          )}
        </>
      )
    },
    {
      title: 'Thời gian bắt đầu',
      width: 200,
      dataIndex: 'time_start',
      align: 'center',
      key: '4'
    },
    {
      title: 'Thời gian kết thúc',
      width: 200,
      dataIndex: 'time_end',
      align: 'center',
      key: '5'
    },
    {
      title: 'Người tạo',
      width: 200,
      dataIndex: 'created_by',
      align: 'center',
      key: '6'
    },
    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '8'
    },

    {
      title: 'Thao tác',
      key: '10',
      fixed: 'right',
      dataIndex: 'key',
      width: 120,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Xem chi tiết'>
            <Button
              className='flex h-9 px-3   text-white bg-gray-400/90 text-sm hover:bg-gray-500 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalOpen(true)
                setScheduleProductId(record.key)
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
          <Tooltip title='Chỉnh sửa'>
            <Button
              className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalUpdateOpen(true)
                setScheduleProductId(record.key)
              }}
              disabled={record.status === StatusScheduleProduct.Running || record.status === StatusScheduleProduct.End}
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
        </div>
      )
    }
  ]
  const dataSource =
    listScheduleProducts?.map((item) => ({
      key: item._id,
      name: item.name,
      promotion_type: item.promotion_type,
      price_value: item.price_value,
      status: item.status,
      time_start: new Date(item.time_start).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time_end: new Date(item.time_end).toLocaleTimeString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
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

  return (
    <div className=''>
      <Helmet>
        <title>Quản lý thời gian đặt lịch - YOYO Store</title>
        <meta name='description' content='Thêm sản phẩm YOYO Store' />
        <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
      </Helmet>
      <Content>
        <div
          style={{
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='rounded bg-gray-50 p-4'>
            <div className='grid grid-cols-2'>
              <div className='flex text-lg capitalize mt-1 font-bold'>Quản lý thời gian đặt lịch</div>
              <div className='flex justify-end'></div>
            </div>
          </div>

          <div className='mt-5'>
            <Spin tip='Đang tải dữ liệu...' size='large' spinning={isLoading}>
              <Table<DataType>
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                bordered
                size='middle'
                scroll={{ x: 'calc(700px + 50%)', y: 47 * 10 }}
              />
            </Spin>
            <ModalProductDetail
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              scheduleProduct_id={scheduleProductId}
            />
            <ModalUpdateScheduleProduct
              isModalOpen={isModalUpdateOpen}
              setIsModalOpen={setIsModalUpdateOpen}
              scheduleProduct_id={scheduleProductId}
            />
          </div>
        </div>
      </Content>
    </div>
  )
}

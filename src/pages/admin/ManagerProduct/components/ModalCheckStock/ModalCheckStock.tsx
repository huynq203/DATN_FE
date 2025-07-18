import { useMutation, useQuery } from '@tanstack/react-query'
import { Modal, Table, TableColumnsType, Tag,  Tooltip } from 'antd'
import { createStyles } from 'antd-style'
import { useMemo, useState } from 'react'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import {  isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import ModalCreateInventoryNew from '../ModalCreateInventoryNew'
import purchaseOrderApi from 'src/apis/purchaseOrder.api'
import swalAlert from 'src/utils/SwalAlert'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { IsChoose } from 'src/constants/enum'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  option_product_id?: string
  product_id?: string
  size?: number
  color?: string
}
interface DataType {
  key: string
  size: number
  color: string
  stock: number
  cost_price: string
  sold: number
  isChoose: number
  created_by: string
  created_at: string
  updated_at: string
}
export default function ModalCheckStock({
  isModalOpen,
  setIsModalOpen,
  option_product_id,
  product_id,
  size,
  color
}: Props) {
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
  const [isModalOpenCreateInventoryNew, setIsModalOpenCreateInventoryNew] = useState(false)

  const { refetch: refetchOptionProductDetail } = useQuery({
    queryKey: ['option_product_id', option_product_id],
    queryFn: () => productApi.getStockOptionProductById(option_product_id as string)
  })
  const { refetch: refetchListOptionProduct } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const { data: listCheckStockOptionProduct, refetch: refetchListCheckStock } = useQuery({
    queryKey: ['option_product_id', option_product_id],
    queryFn: () => productApi.getStockOptionProductById(option_product_id as string)
  })
  const checkStockOptionProductData = listCheckStockOptionProduct?.data.result

  const isChoosePushInventory = useMutation({
    mutationFn: purchaseOrderApi.setIsPushInventory
  })
  const handleIsChoosePushInventory = (inventory_id: string) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        isChoosePushInventory.mutateAsync(
          { inventory_id },
          {
            onSuccess: (res) => {
              swalAlert.notifySuccess(res.data.message)
              refetchListCheckStock()
              refetchOptionProductDetail()
              refetchListOptionProduct()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                const formError = error.response?.data.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key].msg, { autoClose: 1000 })
                  })
                }
              }
              if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
                toast.error(error.response?.data.message, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Trạng thái đẩy hàng',
      width: 130,
      align: 'center',
      key: '0',
      render: (_, record: DataType) => (
        <>
          {record.isChoose === IsChoose.False ? (
            <Button type='button'>
              <Tag color='volcano'> Không hiển thị </Tag>
            </Button>
          ) : (
            <Button type='button'>
              <Tag color='green'>Đang hiển thị</Tag>
            </Button>
          )}
        </>
      )
    },
    {
      title: 'Kích thước',
      width: 100,
      dataIndex: 'size',
      align: 'center',
      key: '0'
    },
    {
      title: 'Màu sắc',
      width: 100,
      dataIndex: 'color',
      align: 'center',
      key: '1'
    },
    {
      title: 'Giá nhập SP',
      width: 100,
      dataIndex: 'cost_price',
      align: 'center',
      key: '2',
      sorter: (a, b) => a.cost_price.localeCompare(b.cost_price)
    },
    {
      title: 'SL tồn kho',
      width: 100,
      dataIndex: 'stock',
      align: 'center',
      key: '3',
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: 'Đã bán',
      width: 100,
      dataIndex: 'sold',
      align: 'center',
      key: '4',
      sorter: (a, b) => a.sold - b.sold
    },
    {
      title: 'Người tạo',
      width: 150,
      dataIndex: 'created_by',
      align: 'center',
      key: '5'
    },
    {
      title: 'Thời gian nhập hàng',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '6'
    },
    {
      title: 'Thao tác',
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      width: 50,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Đẩy hàng'>
            {' '}
            <Button
              className='flex h-9 px-3   text-white bg-green-500/90 text-sm hover:bg-green-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                handleIsChoosePushInventory(record.key)
              }}
              disabled={record.isChoose === IsChoose.True}
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
                  d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
                />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]

  const dataSource = useMemo(() => {
    return (
      checkStockOptionProductData?.inventories.map((item) => ({
        key: item._id,
        size: item.size,
        color: item.color,
        stock: item.stock,
        cost_price: item.cost_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        sold: item.sold,
        isChoose: item.isChoose,
        created_by: item.created_by.name,
        created_at: new Date(item.created_at).toLocaleTimeString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        updated_at: new Date(item.created_at).toLocaleTimeString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      })) || []
    )
  }, [checkStockOptionProductData])

  return (
    <Modal
      // title='Kiểm tra tồn kho'
      closable={{ 'aria-label': 'Custom Close Button' }}
      width={1200}
      centered
      onCancel={handleCancel}
      onOk={handleCancel}
      open={isModalOpen}
    >
      <div className='rounded bg-gray-50 p-4 mt-5'>
        <div className='grid grid-cols-2'>
          <div className='flex text-lg capitalize mt-1'>Quản lý tồn kho</div>
          <div className='flex justify-end'>
            <Button
              className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold'
              onClick={() => setIsModalOpenCreateInventoryNew(true)}
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
                    d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>
                <span className=''>Nhập hàng mới</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className='mt-3'>
        <span className='col-span-1'>Tổng số lượng tồn hàng:</span>{' '}
        <span className='col-span-1 font-bold'>{checkStockOptionProductData?.totalStock}</span>
      </div>
      <div className='mt-1'>
        <span>Tổng số lượng đã bán:</span> <span className='font-bold'>{checkStockOptionProductData?.totalSold}</span>
      </div>
      <div className='mt-5'>
        <Table<DataType>
          rowKey={(record) => record.key}
          className={styles.customTable}
          columns={columns}
          dataSource={dataSource}
          bordered
          size='middle'
        
        />
      </div>
      <ModalCreateInventoryNew
        isModalOpen={isModalOpenCreateInventoryNew}
        setIsModalOpen={setIsModalOpenCreateInventoryNew}
        option_product_id={option_product_id}
        product_id={product_id}
        size={size}
        color={color}
      />
    </Modal>
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { Table, TableColumnsType, Tag, Tooltip } from 'antd'
import { JSX, useState } from 'react'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import ModalCreatetOptionProduct from '../components/ModalCreateOptionProduct'
import swalAlert from 'src/utils/SwalAlert'
import ModalUpdateOptionProduct from '../components/ModalUpdateOptionProduct/ModalUpdateOptionProduct'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { MESSAGE } from 'src/constants/messages'
import { StatusType } from 'src/constants/enum'
import ModalCheckStock from '../components/ModalCheckStock'
import { createStyles } from 'antd-style'
interface Props {
  product_id: string
}

interface DataType {
  key: string
  product_id: string
  image: JSX.Element
  size: number
  color: string
  stock: number
  sold: number
  status: StatusType
  created_by: string
  created_at: string
  updated_at: string
}
export default function ListOptionProduct({ product_id }: Props) {
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
  const [isModalOpenInsert, setIsModalOpenInsert] = useState(false)
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const [isModalOpenCheckStock, setIsModalOpenCheckStock] = useState(false)
  const [optionProductDetail, setOptionProductDetail] = useState<DataType>()
  const [optionProductId, setOptionProductId] = useState('')
  const [size, setSize] = useState<number>()
  const [color, setColor] = useState('')
  
  const { data: OptionProductList, refetch } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const optionProduct = OptionProductList?.data.result
  const deleteOptionProductMutation = useMutation({
    mutationFn: productApi.deleteOptionProduct
  })
  const handleDeleteteOptionProduct = (optionProduct_id: string) => () => {
    swalAlert.showConfirmDelete().then((result) => {
      if (result.isConfirmed) {
        deleteOptionProductMutation.mutate(
          { optionProduct_id },
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
  const changeStatusOptionProductMutation = useMutation({
    mutationFn: productApi.changeStatusOptionProduct
  })
  const handleChangeStatusOptionProduct = (option_product_id: string, status: StatusType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changeStatusOptionProductMutation.mutate(
          { option_product_id, status },
          {
            onSuccess: (res) => {
              swalAlert.notifySuccess('Thông báo', res.data.message)
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
      title: 'Hình ảnh',
      width: 100,
      dataIndex: 'image',
      align: 'center',
      key: '0'
    },

    {
      title: 'Kích thước',
      width: 120,
      dataIndex: 'size',
      align: 'center',
      key: '1',
      sorter: (a, b) => a.size - b.size
    },
    {
      title: 'Màu sắc',
      width: 100,
      dataIndex: 'color',
      align: 'center',
      key: '2'
    },

    {
      title: 'SL tồn kho',
      width: 120,
      dataIndex: 'stock',
      align: 'center',
      key: '3',
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: 'SL đã bán',
      width: 120,
      dataIndex: 'sold',
      align: 'center',
      key: '4',
      sorter: (a, b) => a.sold - b.sold
    },
    {
      title: 'Trạng thái',
      width: 100,
      dataIndex: '',
      align: 'center',
      key: '5',
      render: (_, record: DataType) => (
        <>
          {record.status === StatusType.Inactive ? (
            <Button type='button' onClick={() => handleChangeStatusOptionProduct(record.key, StatusType.Inactive)}>
              <Tag color='volcano'>Inactive</Tag>
            </Button>
          ) : (
            <Button type='button' onClick={() => handleChangeStatusOptionProduct(record.key, StatusType.Active)}>
              <Tag color='green'>Active</Tag>
            </Button>
          )}
        </>
      )
    },
    {
      title: 'Người tạo',
      width: 150,
      dataIndex: 'created_by',
      align: 'center',
      key: '6'
    },
    {
      title: 'Ngày tạo',
      width: 200,
      dataIndex: 'created_at',
      align: 'center',
      key: '7'
    },
    {
      title: 'Ngày cập nhật',
      width: 200,
      dataIndex: 'updated_at',
      align: 'center',
      key: '8'
    },

    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      dataIndex: 'key',
      align: 'center',
      width: 180,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Tooltip title='Kiểm tra tồn kho'>
            {' '}
            <Button
              className='flex h-9 px-3 text-white bg-blue-500/90 text-sm hover:bg-blue-400 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalOpenCheckStock(true)
                setOptionProductId(record.key)
                setSize(record.size)
                setColor(record.color)
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
          <Tooltip title='Cập nhật thuộc tính'>
            {' '}
            <Button
              className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-md'
              onClick={() => {
                setIsModalOpenUpdate(true)
                setOptionProductDetail(record)
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
                  d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip title='Xóa thuộc tính'>
            <Button
              className='flex h-9 px-3 text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-md'
              onClick={handleDeleteteOptionProduct(record.key as string)}
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
                  d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                />
              </svg>
            </Button>
          </Tooltip>
        </div>
      )
    }
  ]

  const dataSource =
    optionProduct?.map((item) => ({
      key: item._id,
      product_id: item.product_id,
      size: item.size,
      color: item.color,
      stock: item.stock,
      sold: item.sold,
      status: item.status,
      image:
        item.image_variant_color.length > 0 ? (
          <img src={item?.image_variant_color[0].url} alt={item.color} className='w-20 h-20' />
        ) : (
          <img src='' alt={item.color} className='w-20 h-20' />
        ),
      created_by: item.created_by[0].name as string,
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
      <div className='rounded bg-gray-50 p-4 mt-5'>
        <div className='grid grid-cols-2'>
          <div className='flex text-lg capitalize mt-1'>Quản lý kích thước - màu sắc</div>
          <div className='flex justify-end'>
            <Button
              className='bg-blue-200/90 text-blue-700 px-4 py-2 rounded-md font-bold'
              onClick={() => setIsModalOpenInsert(true)}
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
                <span className=''>Thêm thuộc tính</span>
              </div>
            </Button>
          </div>
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
        <ModalCreatetOptionProduct
          isModalOpen={isModalOpenInsert}
          setIsModalOpen={setIsModalOpenInsert}
          product_id={product_id}
        />
        <ModalUpdateOptionProduct
          isModalOpen={isModalOpenUpdate}
          setIsModalOpen={setIsModalOpenUpdate}
          optionProductDetail={optionProductDetail as DataType}
          product_id={product_id as string}
        />
        <ModalCheckStock
          isModalOpen={isModalOpenCheckStock}
          setIsModalOpen={setIsModalOpenCheckStock}
          option_product_id={optionProductId}
          product_id={product_id as string}
          size={size}
          color={color}
        />
      </div>
    </div>
  )
}

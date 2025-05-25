import { useMutation, useQuery } from '@tanstack/react-query'
import { Modal, Table, TableColumnsType } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { paths } from 'src/constants'
import ModalCreatetOptionProduct from '../components/ModalCreateOptionProduct'

import swalAlert from 'src/utils/SwalAlert'
import ModalUpdateOptionProduct from '../components/ModalUpdateOptionProduct/ModalUpdateOptionProduct'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { MESSAGE } from 'src/constants/messages'
interface Props {
  product_id: string
}

interface DataType {
  key: string
  product_id: string
  size: number
  color: string
  stock: number
  created_by: string
  created_at: string
  updated_at: string
}
export default function ListOptionProduct({ product_id }: Props) {
  const [isModalOpenInsert, setIsModalOpenInsert] = useState(false)
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const [optionProductDetail, setOptionProductDetail] = useState<DataType>()

  const { data: OptionProductList, refetch } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
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
  const optionProduct = OptionProductList?.data.result
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Kích thước',
      width: 100,
      dataIndex: 'size',
      align: 'center',
      key: '1'
    },
    {
      title: 'Màu sắc',
      width: 100,
      dataIndex: 'color',
      align: 'center',
      key: '2',
      sorter: true
    },
    {
      title: 'Số lượng',
      width: 100,
      dataIndex: 'stock',
      align: 'center',
      key: '3'
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
      key: 'operation',
      fixed: 'right',
      dataIndex: 'key',
      align: 'center',
      width: 250,
      render: (_, record: DataType) => (
        <div className='flex gap-2 justify-center'>
          <Button
            className='flex h-9 px-3   text-white bg-yellow-500/90 text-sm hover:bg-yellow-400 hover:text-white flex items-center justify-center rounded-sm'
            onClick={() => {
              setIsModalOpenUpdate(true)
              setOptionProductDetail(record)
            }}
          >
            Sửa
          </Button>
          <Button
            className='flex h-9 px-3   text-white bg-red-500/90 text-sm hover:bg-red-600 hover:text-white flex items-center justify-center rounded-sm'
            onClick={handleDeleteteOptionProduct(record.key as string)}
          >
            Xóa
          </Button>
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
      <div className='grid grid-cols-2 mt-5'>
        <div className='flex '>Cập nhật kích thước, màu sắc</div>
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
              <span className=''>Thêm Option</span>
            </div>
          </Button>
        </div>
      </div>
      <div className='mt-5'>
        <Table<DataType> columns={columns} dataSource={dataSource} />
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
      </div>
    </div>
  )
}

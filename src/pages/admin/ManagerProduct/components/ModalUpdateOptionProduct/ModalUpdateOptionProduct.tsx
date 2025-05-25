import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  size?: number
  color?: string
  stock?: number
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
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  optionProductDetail: DataType
  product_id: string
}

export default function ModalUpdateOptionProduct({
  isModalOpen,
  setIsModalOpen,
  optionProductDetail,
  product_id
}: Props) {
  const { refetch } = useQuery({
    queryKey: ['product_id', product_id as string],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const updateOptionProductMutation = useMutation({
    mutationFn: productApi.updateOptionProduct
  })
  const onFinish = async (values: any) => {
    updateOptionProductMutation.mutate(
      { ...values, optionProduct_id: optionProductDetail.key, product_id: optionProductDetail.product_id },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          form.resetFields()
          setIsModalOpen(false)
          refetch()
        },
        onError: (error: any) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message)
          } else {
            toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
          }
        }
      }
    )
  }
  useEffect(() => {
    form.setFieldsValue({
      size: optionProductDetail?.size,
      color: optionProductDetail?.color,
      stock: optionProductDetail?.stock
    })
  })
  return (
    <Modal
      title='Cập nhật kích thước - Màu sắc - Số lượng'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Kích thước'
          name='size'
          rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Màu sắc'
          name='color'
          rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Số lượng'
          name='stock'
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

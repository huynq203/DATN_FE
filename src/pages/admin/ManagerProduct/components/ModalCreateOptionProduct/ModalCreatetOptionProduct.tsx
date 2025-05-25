import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import React from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import { MESSAGE } from 'src/constants/messages'
import { OptionProductReq } from 'src/types/product.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  size?: number
  color?: string
  stock?: number
}

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  product_id?: string
}
export default function ModalCreatetOptionProduct({ isModalOpen, setIsModalOpen, product_id }: Props) {
  const { refetch } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const createOptionProductMutation = useMutation({
    mutationFn: productApi.createOptionProduct
  })

  const onFinish = async (values: OptionProductReq) => {
    createOptionProductMutation.mutate(
      { ...values, product_id: product_id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          form.resetFields()
          setIsModalOpen(false)
          refetch()
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message)
          } else {
            toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
          }
        }
      }
    )
  }
  return (
    <Modal
      title='Thêm kích thước - Màu sắc - Số lượng'
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

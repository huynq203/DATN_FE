import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import categoryApi from 'src/apis/category.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
type FieldType = {
  name?: string
  description?: string
}
interface DataType {
  key: string
  name: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  categoryDetail: DataType
}
export default function ModalUpdatetCategory({ isModalOpen, setIsModalOpen, categoryDetail }: Props) {
  const [form] = Form.useForm()
  const { refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const updateCategoryMutation = useMutation({
    mutationFn: categoryApi.updateCategory
  })
  const onFinish = (values: DataType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        updateCategoryMutation.mutate(
          {
            ...values,
            category_id: categoryDetail.key
          },
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
    })
  }
  useEffect(() => {
    form.setFieldsValue({
      name: categoryDetail?.name,
      description: categoryDetail?.description
    })
  })
  return (
    <Modal
      title='Cập nhật danh mục'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Tên danh mục'
          name='name'
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { max: 20, message: 'Tên danh mục không được quá 20 ký tự!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Mô tả danh mục'
          name='description'
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả danh mục!' },
            { max: 50, message: 'Mô tả không được quá 50 ký tự!' }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

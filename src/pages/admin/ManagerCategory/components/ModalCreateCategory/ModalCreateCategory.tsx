import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import React from 'react'
import { toast } from 'react-toastify'
import categoryApi from 'src/apis/category.api'
import { CategoryReqBody } from 'src/types/category.type'

type FieldType = {
  name?: string
  description?: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
export default function ModalCreateCategory({ isModalOpen, setIsModalOpen }: Props) {
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
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.createCategory
  })
  const onFinish = async (values: CategoryReqBody) => {
    createCategoryMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        form.resetFields()
        setIsModalOpen(false)
        refetch()
      },
      onError: (error) => {
        console.error('Error creating category:', error)
      }
    })
  }
  return (
    <Modal
      title='Thêm danh mục'
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

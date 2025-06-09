import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { toast } from 'react-toastify'
import categoryApi from 'src/apis/category.api'
import { MESSAGE } from 'src/constants/messages'
import { Category, CategoryReqBody } from 'src/types/category.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  name?: string
  description?: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  onUpdateSuccess: (ListCategories: Category[]) => void
}
export default function ModalCreateCategory({ isModalOpen, setIsModalOpen, onUpdateSuccess }: Props) {
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
      onSuccess: async (data) => {
        toast.success(data.data.message)
        form.resetFields()
        setIsModalOpen(false)
        const result = await refetch()
        onUpdateSuccess(result.data?.data.result as Category[])
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
          toast.error(error.response?.data.message)
        } else {
          toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
        }
      }
    })
  }
  return (
    <Modal
      title='Thêm danh mục'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
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

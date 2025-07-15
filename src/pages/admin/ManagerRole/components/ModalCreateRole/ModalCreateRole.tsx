import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { toast } from 'react-toastify'
import roleApi from 'src/apis/role.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  role_name: string
  description: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
export default function ModalCreateRole({ isModalOpen, setIsModalOpen }: Props) {
  const { refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      return roleApi.getAllRoleUser()
    }
  })
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  const createRoleMutation = useMutation({
    mutationFn: roleApi.createRole
  })
  const onFinish = (values: any) => {
    createRoleMutation.mutate(values, {
      onSuccess: (res) => {
        toast.success(res.data.message, { autoClose: 1000 })
        refetch()
        setIsModalOpen(false)
        form.resetFields()
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
          swalAlert.notifyError(error.response?.data.message as string)
        } else if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
          swalAlert.notifyError(error.response?.data.message as string)
        } else {
          toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
        }
      }
    })
  }
  return (
    <Modal
      title='Thêm vai trò'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Tên vai trò'
          name='role_name'
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Mô tả'
          name='description'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

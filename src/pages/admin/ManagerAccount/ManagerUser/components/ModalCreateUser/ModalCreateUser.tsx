import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal, Select } from 'antd'
import { toast } from 'react-toastify'
import roleApi from 'src/apis/role.api'
import userApi from 'src/apis/user.api'
import { MESSAGE } from 'src/constants/messages'
import { User } from 'src/types/user.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  role_id: string
}

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  onUpdateSuccess?: (ListUsers: User[]) => void
}
export default function ModalCreateUser({ isModalOpen, setIsModalOpen, onUpdateSuccess }: Props) {
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return userApi.getAllUsers({})
    }
  })
  const { data: listRole } = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      return roleApi.getAllRoleUser()
    }
  })
  const roleData = listRole?.data.result
  const createUserMutation = useMutation({
    mutationFn: userApi.createUser
  })
  const onFinish = (values: FieldType) => {
    createUserMutation.mutate(values, {
      onSuccess: async (data) => {
        toast.success(data.data.message, { autoClose: 1000 })
        setIsModalOpen(false)
        form.resetFields()
        const result = await refetch()
        onUpdateSuccess?.(result.data?.data.result as User[])
        // setIsModalOpen(false)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              toast.error(formError[key].msg, { autoClose: 1000 })
            })
          }
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
      title='Thêm tài khoản'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Họ và tên'
          name='name'
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Số điện thoại'
          name='phone'
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { min: 10, max: 10, message: 'Số điện thoại không hợp lệ' },
            { pattern: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, message: 'Số điện thoại chỉ chứa số' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Ngày sinh'
          name='date_of_birth'
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <Input type='date' />
        </Form.Item>
        <Form.Item<FieldType>
          label='Địa chỉ'
          name='address'
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <Input />
        </Form.Item>
        {roleData && (
          <Form.Item<FieldType>
            label='Phân quyền'
            name='role_id'
            rules={[{ required: true, message: 'Vui lòng chọn phân quyền!' }]}
          >
            <Select
              options={roleData.map((role) => ({
                label: role.role_name,
                value: role._id
              }))}
              placeholder='Chọn phân quyền'
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

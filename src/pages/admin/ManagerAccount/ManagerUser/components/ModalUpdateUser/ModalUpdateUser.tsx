import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import roleApi from 'src/apis/role.api'
import userApi from 'src/apis/user.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  key: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  role: {
    _id: string
    role_name: string
  }
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  userDetail: FieldType
}
export default function ModalUpdateUser({ isModalOpen, setIsModalOpen, userDetail }: Props) {
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const { data: listRole } = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      return roleApi.getAllRoleUser()
    }
  })
  const roleData = listRole?.data.result
  const { refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return userApi.getAllUsers()
    }
  })
  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser
  })

  const onFinish = (values: FieldType) => {


    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        updateUserMutation.mutate(
          {
            user_id_change: userDetail.key,
            name: values.name,
            email: values.email,
            phone: values.phone,
            date_of_birth: values.date_of_birth,
            address: values.address,
            role_id: values.role
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
      name: userDetail?.name,
      email: userDetail?.email,
      phone: userDetail?.phone,
      date_of_birth: userDetail?.date_of_birth,
      address: userDetail?.address,
      role: userDetail?.role._id
    })
  }, [userDetail])
  return (
    <Modal
      title='Thêm tài khoản'
      closable={{ 'aria-label': 'Custom Close Button' }}
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
            name='role'
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

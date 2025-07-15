import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import roleApi from 'src/apis/role.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  key: string
  role_name: string
  description: string
  created_at: string
  updated_at: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  roleDetail: FieldType
}
export default function ModalUpdateRole({ isModalOpen, setIsModalOpen, roleDetail }: Props) {
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
  }
  const updateRoleMutation = useMutation({
    mutationFn: roleApi.updateRole
  })
  const onFinish = (values: any) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        updateRoleMutation.mutate(
          { ...values, role_id: roleDetail.key },
          {
            onSuccess: (res) => {
              swalAlert.notifySuccess(res.data.message)
              setIsModalOpen(false)
              form.resetFields()
              refetch()
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
          }
        )
      }
    })
  }
  useEffect(() => {
    form.setFieldsValue({
      role_name: roleDetail?.role_name,
      description: roleDetail?.description
    })
  }, [roleDetail])
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

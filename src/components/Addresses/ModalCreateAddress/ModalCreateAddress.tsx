import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { toast } from 'react-toastify'
import addressApi from 'src/apis/address.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
type FieldType = {
  name: string
  phone: string
  address: string
}
export default function ModalCreateAddress({ isModalOpen, setIsModalOpen }: Props) {
  const [form] = Form.useForm()
  const { refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => {
      return addressApi.getAddressbyCustomer()
    }
  })
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const createAddressMutation = useMutation({
    mutationFn: addressApi.createAddress
  })
  const onFinish = (values: any) => {
    createAddressMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(data.data.message, { autoClose: 1000 })
        refetch()
        setIsModalOpen(false)
        form.resetFields()
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              toast.error(formError[key].msg, { autoClose: 1000 })
            })
          }
        } else {
          toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
        }
      }
    })
  }
  return (
    <Modal
      title='Thêm địa chỉ mới'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
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
          label='Địa chỉ'
          name='address'
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

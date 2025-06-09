import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import addressApi from 'src/apis/address.api'
import { isDefault } from 'src/constants/enum'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  _id: string
  customer_id: string
  name: string
  phone: string
  address: string
  isDefault: isDefault
  created_at: string
  updated_at: string
}

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  addressDetail?: FieldType
}
export default function ModalUpdateAddress({ isModalOpen, setIsModalOpen, addressDetail }: Props) {
  const { refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => {
      return addressApi.getAddressbyCustomer()
    }
  })

  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const updateAddressMutation = useMutation({
    mutationFn: addressApi.updateAddress
  })
  const onFinish = (values: FieldType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        if (addressDetail) {
          updateAddressMutation.mutate(
            {
              ...values,
              address_id: addressDetail?._id
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
      }
    })
  }
  useEffect(() => {
    if (addressDetail) {
      form.setFieldsValue({
        name: addressDetail.name,
        phone: addressDetail.phone,
        address: addressDetail.address
      })
    }
  }, [addressDetail])
  return (
    <Modal
      title='Cập nhật địa chỉ'
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

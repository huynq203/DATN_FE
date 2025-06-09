import { useMutation, useQuery } from '@tanstack/react-query'
import { DatePicker, Form, Input, Modal } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'

import { toast } from 'react-toastify'
import voucherApi from 'src/apis/voucher.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
type FieldType = {
  name: string
  code: string
  discount: number
  quantity: number
  time_start: string
  time_end: string
}
export default function ModalCreateVoucher({ isModalOpen, setIsModalOpen }: Props) {
  const [form] = Form.useForm()
  const { refetch } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => {
      return voucherApi.getAllVoucher()
    }
  })
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().endOf('day')
  }
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const createVoucherMutation = useMutation({
    mutationFn: voucherApi.createVoucher
  })
  const onFinish = (values: any) => {
    createVoucherMutation.mutate(
      {
        ...values,
        time_start: values.time_start.format('YYYY-MM-DD HH:mm:ss'),
        time_end: values.time_end.format('YYYY-MM-DD HH:mm:ss')
      },
      {
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
      }
    )
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
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Mã giảm giá'
          name='code'
          rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Giá giảm'
          name='discount'
          rules={[
            { required: true, message: 'Vui lòng nhập giá giảm!' }
            // { type: 'number', min: 0, message: 'Giá giảm phải là số dương' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Số lượng'
          name='quantity'
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex gap-2'>
          <Form.Item<FieldType>
            label='Thời gian bắt đầu'
            name='time_start'
            rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu!' }]}
          >
            <DatePicker
              format='YYYY-MM-DD HH:mm:ss'
              showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label='Thời gian kết thúc'
            name='time_end'
            rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc!' }]}
          >
            <DatePicker
              format='YYYY-MM-DD HH:mm:ss'
              showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { DatePicker, Form, Input, Modal } from 'antd'
// import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import voucherApi from 'src/apis/voucher.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
type FieldType = {
  key: string
  name: string
  code: string
  discount: number
  quantity: number
  time_start: string
  time_end: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  voucherDetail: FieldType
}
export default function ModalUpdateVoucher({ isModalOpen, setIsModalOpen, voucherDetail }: Props) {
  const [form] = Form.useForm()

  const { refetch } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => {
      return voucherApi.getAllVoucher()
    }
  })
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const updateVoucherMutation = useMutation({
    mutationFn: voucherApi.updateVoucher
  })
  const onFinish = (values: FieldType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        updateVoucherMutation.mutate(
          {
            voucher_id: voucherDetail.key,
            ...values,
            time_start: dayjs(values.time_start).format('YYYY-MM-DD HH:mm:ss'),
            time_end: dayjs(values.time_end).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            onSuccess: (data) => {
              swalAlert.notifySuccess(data.data.message)
              setIsModalOpen(false)
              form.resetFields()
              refetch()
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
    })
  }
  useEffect(() => {
    if (voucherDetail) {
      form.setFieldsValue({
        name: voucherDetail.name,
        code: voucherDetail.code,
        discount: voucherDetail.discount,
        quantity: voucherDetail.quantity,
        time_start: dayjs(voucherDetail.time_start, 'HH:mm:ss DD/MM/YYYY'),
        time_end: dayjs(voucherDetail.time_end, 'HH:mm:ss DD/MM/YYYY')
      })
    }
  }, [voucherDetail])
  return (
    <Modal
      title='Cập nhật voucher'
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
              // disabledDate={disabledDate}
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
              // disabledDate={disabledDate}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

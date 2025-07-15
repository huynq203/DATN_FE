import { DatePicker, Form, Input, Modal, Select } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import { PromotionPriceType, StatusScheduleProduct } from 'src/constants/enum'
import dayjs from 'dayjs'
import scheduleProductApi from 'src/apis/scheduleProduct.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  total_selected?: number
  rowSelectionIds?: string[] // Assuming this is used for selected rows, but not used in the current code
}
type FieldType = {
  price_value: number
  promotion_type: string
  name: string
  status: StatusScheduleProduct
  time_start: string
  time_end: string
}
export default function ModalAutoScheduleDiscount({
  isModalOpen,
  setIsModalOpen,
  rowSelectionIds,
  total_selected
}: Props) {
  const { refetch } = useQuery({
    queryKey: ['product', {}],
    queryFn: () => {
      return productApi.getProductManager({})
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
  const createScheduleProductMutation = useMutation({
    mutationFn: scheduleProductApi.createScheduleProduct
  })
  const onFinish = (values: any) => {
    createScheduleProductMutation.mutate(
      {
        ...values,
        product_ids: rowSelectionIds,
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
          }
          if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message, { autoClose: 1000 })
          }
        }
      }
    )
  }
  // const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  //   return current && current.valueOf() <= dayjs().endOf('day').valueOf() - 1
  // }
  const dataSourcePromotionType = [
    { value: PromotionPriceType.Percentage, label: 'Giảm giá theo phần trăm %' },
    { value: PromotionPriceType.Fixed, label: 'Giảm giá theo số tiền cố định' },
    { value: PromotionPriceType.Promotion, label: 'Giảm giá theo số tiền khuyến mãi' }
  ]
  return (
    <Modal
      title={`Đặt lịch tự động cho ${total_selected} sản phẩm đã chọn`}
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Kiểu khuyến mãi'
          name='promotion_type'
          rules={[{ required: true, message: 'Vui lòng tiền giảm giá!' }]}
        >
          <Select
            showSearch
            placeholder='Chọn kiểu giảm giá'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            className='w-full'
            options={dataSourcePromotionType}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label='Giá khuyến mãi'
          name='price_value'
          rules={[{ required: true, message: 'Vui lòng nhập giá khuyến mãi!' }]}
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item<FieldType>
          label='Tên chương trình khuyến mãi'
          name='name'
          rules={[{ required: true, message: 'Vui lòng nhập tên chương trình khuyến mãi!' }]}
        >
          <Input />
        </Form.Item>
        <div className='flex gap-14'>
          <Form.Item<FieldType>
            label='Thời gian bắt đầu'
            name='time_start'
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
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
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
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

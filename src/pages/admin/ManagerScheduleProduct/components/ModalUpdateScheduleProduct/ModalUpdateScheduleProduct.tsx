import { useMutation, useQuery } from '@tanstack/react-query'
import { DatePicker, Form, Input, Modal, Select, theme } from 'antd'

import scheduleProductApi from 'src/apis/scheduleProduct.api'
import { PromotionPriceType } from 'src/constants/enum'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  scheduleProduct_id?: string
}
type FieldType = {
  price_value: number
  promotion_type: string
  name: string
  time_start: string
  time_end: string
}
export default function ModalUpdateScheduleProduct({ isModalOpen, setIsModalOpen, scheduleProduct_id }: Props) {
  const [form] = Form.useForm()
  const {
    token: {}
  } = theme.useToken()




  const { data: ListScheduleProduct, refetch: refetchScheduleProduct } = useQuery({
    queryKey: ['scheduleProductDetail', { scheduleProductId: scheduleProduct_id as string }],
    queryFn: () => scheduleProductApi.getScheduleProductById({ scheduleProductId: scheduleProduct_id as string })
  })
  const scheduleProductDetail = ListScheduleProduct?.data.result
  const { refetch: refetchListScheduleProduct } = useQuery({
    queryKey: ['listScheduleProducts'],
    queryFn: () => {
      return scheduleProductApi.getAllScheduleProduct()
    }
  })

  const dataSourcePromotionType = [
    { value: PromotionPriceType.Percentage, label: 'Giảm giá theo phần trăm %' },
    { value: PromotionPriceType.Fixed, label: 'Giảm giá theo số tiền cố định' },
    { value: PromotionPriceType.Promotion, label: 'Giảm giá theo số tiền khuyến mãi' }
  ]

  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const updateScheduleProductMutation = useMutation({
    mutationFn: scheduleProductApi.updateScheduleProduct
  })
  const onFinish = (values: any) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        updateScheduleProductMutation.mutate(
          {
            schedule_product_id: scheduleProduct_id as string,
            name: values.name,
            promotion_type: values.promotion_type,
            price_value: values.price_value,
            time_start: values.time_start.format('YYYY-MM-DD HH:mm:ss'),
            time_end: values.time_end.format('YYYY-MM-DD HH:mm:ss')
          },
          {
            onSuccess: (res) => {
              swalAlert.notifySuccess(res.data.message)
              setIsModalOpen(false)
              form.resetFields()
              refetchListScheduleProduct()
              refetchScheduleProduct()
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
    })
  }
  useEffect(() => {
    if (scheduleProductDetail) {
      form.setFieldsValue({
        name: scheduleProductDetail.name,
        promotion_type: scheduleProductDetail.promotion_type,
        price_value: scheduleProductDetail.price_value,
        status: scheduleProductDetail.status,
        time_start: dayjs(
          new Date(scheduleProductDetail.time_start).toLocaleTimeString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          'HH:mm:ss DD/MM/YYYY'
        ),
        time_end: dayjs(
          new Date(scheduleProductDetail.time_end).toLocaleTimeString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          'HH:mm:ss DD/MM/YYYY'
        )
      })
    }
  }, [scheduleProductDetail])
  return (
    <Modal
      title={'Cập nhật chương trình khuyến mãi'}
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

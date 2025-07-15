import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Modal, Select } from 'antd'

import  { useState } from 'react'
import { toast } from 'react-toastify'
import orderApi from 'src/apis/order.api'
import { OrderStatus } from 'src/constants/enum'
import { OrderResponse } from 'src/types/order.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  order_id?: string
  order_status?: number
  onUpdateSuccess?: (listOrder: OrderResponse[]) => void
}
type FieldType = {
  order_status: number
}
export default function ModalChangeOrderStatus({
  isModalOpen,
  setIsModalOpen,
  order_id,
  order_status,
  onUpdateSuccess
}: Props) {
  const [ChangeOrderStatus, setChangeOrderStatus] = useState<number>()
  const { refetch } = useQuery({
    queryKey: ['orders', {}],
    queryFn: () => {
      return orderApi.getOrderManager({})
    }
  })
  const dataSourceOrderStatus = [
    {
      label: 'Chờ thanh toán',
      value: OrderStatus.WaitPayment
    },
    {
      label: 'Chờ xác nhận',
      value: OrderStatus.WaitConfirmed
    },
    {
      label: 'Chờ lấy hàng',
      value: OrderStatus.WaitForGetting
    },
    {
      label: 'Chờ giao hàng',
      value: OrderStatus.WaitDelivery
    },
    {
      label: 'Đang giao hàng',
      value: OrderStatus.OnDelevery
    },
    {
      label: 'Thành công',
      value: OrderStatus.Success
    },
    {
      label: 'Hủy đơn hàng',
      value: OrderStatus.Cancel
    }
  ]
  const handleChangeOrderStatus = (value: number) => {
    setChangeOrderStatus(value)
  }
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const changeOrderStatusMutation = useMutation({
    mutationFn: orderApi.changeOrderStatus
  })
  const onFinish = (values: FieldType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changeOrderStatusMutation.mutate(
          {
            order_id: order_id as string,
            order_status: values.order_status
          },
          {
            onSuccess: async (res) => {
              swalAlert.notifySuccess(res.data.message)
              setIsModalOpen(false)
              form.resetFields()
              const result = await refetch()
              onUpdateSuccess?.(result.data?.data.result as OrderResponse[])
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                const formError = error.response?.data.errors
                if (formError) {
                  Object.keys(formError).forEach((key) => {
                    toast.error(formError[key].msg, { autoClose: 1000 })
                  })
                }
                toast.error(error.response?.data.message, { autoClose: 1000 })
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
  return (
    <Modal
      title='Cập nhật trạng thái đơn hàng'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Trạng thái đơn hàng'
          name='order_status'
          initialValue={order_status}
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
        >
          <Select
            showSearch
            placeholder='Trạng thái đơn hàng'
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            className='w-full'
            options={dataSourceOrderStatus}
            onChange={handleChangeOrderStatus}
            value={ChangeOrderStatus !== null ? ChangeOrderStatus : null}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

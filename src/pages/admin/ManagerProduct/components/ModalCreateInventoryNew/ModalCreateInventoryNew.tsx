import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import purchaseOrderApi from 'src/apis/purchaseOrder.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FieldType = {
  size: number
  color: string
  cost_price: string
  stock: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  option_product_id?: string
  product_id?: string
  size?: number
  color?: string
}
export default function ModalCreateInventoryNew({
  isModalOpen,
  setIsModalOpen,
  option_product_id,
  product_id,
  size,
  color
}: Props) {
  const { refetch: refetchOptionProductDetail } = useQuery({
    queryKey: ['option_product_id', option_product_id],
    queryFn: () => productApi.getStockOptionProductById(option_product_id as string)
  })
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { refetch: refetchListOptionProduct } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const createPurchaseOrderMutation = useMutation({
    mutationFn: purchaseOrderApi.createPurchaseOrder
  })
  const onFinish = (values: FieldType) => {
    createPurchaseOrderMutation.mutate(
      [
        {
          cost_price: Number(values.cost_price),
          stock: Number(values.stock),
          option_product_id: option_product_id as string,
          product_id: product_id as string
        }
      ],
      {
        onSuccess: (res) => {
          toast.success(res.data.message, { autoClose: 1000 })
          setIsModalOpen(false)
          form.resetFields()
          refetchOptionProductDetail()
          refetchListOptionProduct()
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
  useEffect(() => {
    form.setFieldsValue({
      size: size || 0,
      color: color || '',
      cost_price: '',
      stock: ''
    })
  })
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
        <Form.Item<FieldType> label='Kích thước' name='size'>
          <Input disabled />
        </Form.Item>
        <Form.Item<FieldType> label='Màu sắc' name='color'>
          <Input disabled />
        </Form.Item>
        <Form.Item<FieldType>
          label='Giá nhập'
          name='cost_price'
          rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Số lượng'
          name='stock'
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Upload } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import { MESSAGE } from 'src/constants/messages'
import { OptionProductReq, ProductListConfig } from 'src/types/product.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import useQueryConfig from 'src/hooks/useQueryConfig'
type FieldType = {
  size?: number
  color?: string
  stock?: number
  cost_price?: number
  image_variant_color?: string
}

interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  product_id?: string
}
export default function ModalCreatetOptionProduct({ isModalOpen, setIsModalOpen, product_id }: Props) {
  const [file, setFile] = useState<File>()
  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file)
      return false // Prevent automatic upload
    },
    onRemove: () => {
      setFile(undefined)
    }
  }

  const { refetch: refreshOptionProduct } = useQuery({
    queryKey: ['product_id', product_id],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
  const { refetch: refreshListProduct } = useQuery({
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
  }
  const createOptionProductMutation = useMutation({
    mutationFn: productApi.createOptionProduct
  })

  const onFinish = async (values: OptionProductReq) => {
    try {
      if (file) {
        const formData = new FormData()
        formData.append('url_images', file)
        const uploadImageRes = await productApi.uploadImageVariantColor(formData)
        const image_variant_color = uploadImageRes.data.result
        await createOptionProductMutation.mutateAsync(
          { ...values, product_id: product_id as string, image_variant_color: image_variant_color },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              form.resetFields()
              setIsModalOpen(false)
              refreshOptionProduct()
              refreshListProduct()
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
    } catch (error) {
      // toast.error(MESSAGE.CREATE_OPTION_PRODUCT_FAILED)
    }
  }
  return (
    <Modal
      title='Thêm thuộc tính sản phẩm'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Kích thước'
          name='size'
          rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label='Màu sắc'
          name='color'
          rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
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
        <Form.Item<FieldType>
          label='Giá nhập'
          name='cost_price'
          rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label='Hình ảnh'
          name='image_variant_color'
          rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
        >
          <Upload accept='.jpg,.jpeg,.png' {...props} maxCount={1} showUploadList={true}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

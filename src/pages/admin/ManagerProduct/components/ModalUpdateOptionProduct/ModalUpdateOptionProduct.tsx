import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Upload, UploadProps } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { UploadOutlined } from '@ant-design/icons'
type FieldType = {
  size?: number
  color?: string
  image_variant_color?: string
}
interface DataType {
  key: string
  product_id: string
  size: number
  color: string
  created_by: string
  created_at: string
  updated_at: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  optionProductDetail: DataType
  product_id: string
}

export default function ModalUpdateOptionProduct({
  isModalOpen,
  setIsModalOpen,
  optionProductDetail,
  product_id
}: Props) {
  const { refetch } = useQuery({
    queryKey: ['product_id', product_id as string],
    queryFn: () => productApi.getOptionProduct(product_id as string)
  })
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
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const updateOptionProductMutation = useMutation({
    mutationFn: productApi.updateOptionProduct
  })
  const onFinish = async (values: any) => {
    swalAlert.showConfirm().then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (file && values) {
            const formData = new FormData()
            formData.append('url_images', file)
            const uploadImageRes = await productApi.uploadImageVariantColor(formData)
            const image_variant_color = uploadImageRes.data.result
            updateOptionProductMutation.mutateAsync(
              {
                ...values,
                image_variant_color,
                optionProduct_id: optionProductDetail.key,
                product_id: optionProductDetail.product_id
              },
              {
                onSuccess: (data) => {
                  toast.success(data.data.message)
                  form.resetFields()
                  setIsModalOpen(false)
                  refetch()
                },
                onError: (error: any) => {
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
          } else {
            updateOptionProductMutation.mutateAsync(
              {
                ...values,
                optionProduct_id: optionProductDetail.key,
                product_id: optionProductDetail.product_id
              },
              {
                onSuccess: (data) => {
                  toast.success(data.data.message)
                  form.resetFields()
                  setIsModalOpen(false)
                  refetch()
                },
                onError: (error: any) => {
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
          // toast.error(MESSAGE.UPDATE_OPTION_PRODUCT_FAILED)
        }
      }
    })
  }
  useEffect(() => {
    form.setFieldsValue({
      size: optionProductDetail?.size,
      color: optionProductDetail?.color
    })
  })
  return (
    <Modal
      title='Cập nhật kích thước - Màu sắc - Hình ảnh'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
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
        <Form.Item<FieldType> label='Hình ảnh' name='image_variant_color'>
          <Upload accept='.jpg,.jpeg,.png' {...props} maxCount={1} showUploadList={true}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

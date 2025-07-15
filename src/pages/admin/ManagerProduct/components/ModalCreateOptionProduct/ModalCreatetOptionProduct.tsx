import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Upload } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'

import { OptionProductReq } from 'src/types/product.type'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { UploadOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Spin } from 'antd'
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
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
export default function ModalCreatetOptionProduct({ isModalOpen, setIsModalOpen, product_id }: Props) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const props: UploadProps = {
    onRemove: (file) => {
      const index = files.indexOf(file)
      const newFileList = files.slice()
      newFileList.splice(index, 1)
      setFiles(newFileList)
    },
    beforeUpload: (file) => {
      setFiles([...files, file])
      return false
    },
    fileList: files
  }
  // const props: UploadProps = {
  //   onRemove: (file) => {
  //     const newFileList = files.filter((f) => f.uid !== file.uid)
  //     setFiles(newFileList)
  //   },
  //   beforeUpload: () => {
  //     return false // Ngăn AntD tự upload
  //   },
  //   onChange: (info) => {
  //     setFiles(info.fileList) // Lưu toàn bộ danh sách file được chọn
  //   },
  //   fileList: files,
  //   multiple: true,
  //   showUploadList: true
  // }

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
    form.resetFields()
  }
  const createOptionProductMutation = useMutation({
    mutationFn: productApi.createOptionProduct
  })

  const onFinish = async (values: OptionProductReq) => {
    setIsLoading(true)
    try {
      if (files) {
        const formData = new FormData()
        files.forEach((file) => {
          console.log('file', file)

          formData.append('url_images', file as FileType)
        })

        const uploadImageRes = await productApi.uploadImageVariantColor(formData)
        const image_variant_color = uploadImageRes.data.result
        console.log('image_variant_color', image_variant_color)

        await createOptionProductMutation.mutateAsync(
          { ...values, product_id: product_id as string, image_variant_color: image_variant_color },
          {
            onSuccess: (data) => {
              setIsLoading(false)
              toast.success(data.data.message)
              form.resetFields()
              setIsModalOpen(false)
              setFiles([])
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
    <Spin spinning={isLoading} tip='Đang xử lý...' size='large' style={{ minHeight: '100vh' }}>
      <Modal
        title='Thêm thuộc tính sản phẩm'
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off' encType='multipart/form-data'>
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
            <Upload accept='.jpg,.jpeg,.png' {...props} maxCount={10} showUploadList={true}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}

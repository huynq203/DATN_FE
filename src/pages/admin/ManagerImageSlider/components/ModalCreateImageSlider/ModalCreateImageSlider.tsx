import { Button, Form, GetProp, Input, Modal, Upload, UploadFile, UploadProps } from 'antd'
import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import imageSliderApi from 'src/apis/imageSlider.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
type FieldType = {
  link?: string
  urlImage?: string
}
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
export default function ModalCreateImageSlider({ isModalOpen, setIsModalOpen }: Props) {
  const { refetch } = useQuery({
    queryKey: ['imageSliders'],
    queryFn: () => {
      return imageSliderApi.getAllImageSlider()
    }
  })
  const [files, setFiles] = useState<UploadFile[]>([])
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
    }
  }
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  const createImageSliderMutation = useMutation({
    mutationFn: imageSliderApi.createImageSlider
  })
  const onFinish = async (values: any) => {
    try {
      if (files) {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append('url_images', file as FileType)
        })

        const uploadImageRes = await imageSliderApi.uploadImageSlider(formData)
        const urlImage = uploadImageRes.data.result

        await createImageSliderMutation.mutateAsync(
          { ...values, urlImage: urlImage },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              refetch()
              form.resetFields()
              setIsModalOpen(false)
              setFiles([])
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
      title='Thêm hình ảnh slider'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off' encType='multipart/form-data'>
        <Form.Item<FieldType>
          label='Liên kết'
          name='link'
          rules={[{ required: true, message: 'Vui lòng nhập đường dẫn liên kết!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label='Hình ảnh'
          name='urlImage'
          rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
        >
          <Upload accept='.jpg,.jpeg,.png' {...props} maxCount={10} showUploadList={true}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

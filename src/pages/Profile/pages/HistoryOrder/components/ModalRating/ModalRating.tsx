import { useMutation } from '@tanstack/react-query'
import { Form, Input, Modal, Rate } from 'antd'
import { toast } from 'react-toastify'
import rateApi from 'src/apis/ratings.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  productId?: string
  orderId?: string
}
type FieldType = {
  star: number
  comment: string
}
export default function ModalRating({ isModalOpen, setIsModalOpen, orderId, productId }: Props) {
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const ratingProductMutation = useMutation({
    mutationFn: rateApi.createRating
  })
  const onFinish = (values: any) => {
    ratingProductMutation.mutate(
      {
        order_id: orderId as string,
        product_id: productId as string,
        star: values.star as number,
        comment: values.comment
      },
      {
        onSuccess: (res) => {
          swalAlert.notifySuccess(res.data.message)
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
          } else if (isAxiosForbiddenError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message, { autoClose: 1000 })
            setIsModalOpen(false)
            form.resetFields()
          } else {
            toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
          }
        }
      }
    )
  }
  return (
    <Modal
      title='Đánh giá sản phẩm'
      closable={{ 'aria-label': 'Custom Close Button' }}
      centered
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType> label='Số sao' name='star'>
          <Rate tooltips={desc} />
        </Form.Item>
        <Form.Item<FieldType> label='Bình luận' name='comment'>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

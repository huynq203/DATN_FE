import { useMutation } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'
import customerApi from 'src/apis/customer.api'
import { MESSAGE } from 'src/constants/messages'
import { ErrorResponseApi } from 'src/types/utils.type'
import swalAlert from 'src/utils/SwalAlert'
import { isAxiosForbiddenError, isAxiosUnprocessableEntityError } from 'src/utils/utils'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
type FieldType = {
  old_password: string
  new_password: string
  confirm_new_password: string
}
export default function ChangePassword({ isModalOpen, setIsModalOpen }: Props) {
  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const changePasswordMutation = useMutation({
    mutationFn: customerApi.changePassword
  })
  const onFinish = (values: FieldType) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        changePasswordMutation.mutateAsync(values, {
          onSuccess: (res) => {
            toast.success(res.data.message, { autoClose: 1000 })
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
        })
      }
    })
  }
  return (
    <Modal
      title='Thay đổi mật khẩu'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item<FieldType>
          label='Nhập mật khẩu cũ'
          name='old_password'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { required: true, min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            {
              required: true,
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
              message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
            }
          ]}
        >
          <Input.Password type='password' />
        </Form.Item>
        <Form.Item<FieldType>
          label='Nhập mật khẩu mới'
          name='new_password'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { required: true, min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            {
              required: true,
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
              message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
            }
          ]}
        >
          <Input.Password type='password' />
        </Form.Item>
        <Form.Item<FieldType>
          label='Nhập lại mật khẩu mới'
          name='confirm_new_password'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { required: true, min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            {
              required: true,
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
              message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số!'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
              }
            })
          ]}
        >
          <Input.Password type='password' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

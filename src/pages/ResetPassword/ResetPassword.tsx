import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { pick, set } from 'lodash'
import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { paths } from 'src/constants'
import { ErrorResponseApi } from 'src/types/utils.type'
import { schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormDataForgotPassword = Pick<Schema, 'password' | 'confirm_password' | 'forgot_password_token'>
const forgotPasswordSchema = schema.pick(['password', 'confirm_password', 'forgot_password_token'])

export default function ResetPassword() {
  const location = useLocation()
  const { forgot_password_token } = location.state

  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormDataForgotPassword>({
    resolver: yupResolver(forgotPasswordSchema) as any
  })
  //Bên trang reset password nó cần cái forgot-password-token này để gửi lên API
  //Ở đây có 2 cách để trang reset password nhận được cái token này
  //1. Lưu vào localStorage và trang reset password lấy ra
  //2. Truyền qua state của useNavigate
  const resetPasswordMuTation = useMutation({
    mutationFn: (body: FormDataForgotPassword) =>
      authApi.resetPasswordCustomer({
        new_password: body.password,
        confirm_new_password: body.confirm_password,
        forgot_password_token: forgot_password_token as string
      })
  })

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true)
    setTimeout(() => {
      resetPasswordMuTation.mutate(
        { ...data, forgot_password_token },
        {
          onSuccess: (res) => {
            setIsLoading(false)
            toast.success(res.data.message)
          },
          onError: (error) => {
            setIsLoading(false)
            if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
              const formError = error.response?.data.errors
              if (formError) {
                Object.keys(formError).forEach((key) => {
                  setError(key as keyof FormDataForgotPassword, {
                    message: formError[key].msg,
                    type: 'Server'
                  })
                })
              }
            }
          }
        }
      )
    }, 3000)
  })
  return (
    <>
      <Helmet>
        <title>Reset Password - YOYO Store</title>
        <meta name='description' content='Reset password YOYO Store' />
        <link rel='canonical' href={paths.Screens.AUTH_RESET_PASSWORD} />
      </Helmet>
      <div className='container'>
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl  text-gray-900'>Cập nhật mật khẩu</h2>
          </div>

          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
              <form className='space-y-6' onSubmit={onSubmit}>
                <div>
                  <label htmlFor='password' className='block text-sm  text-gray-700'>
                    Mật khẩu
                  </label>
                  <div className='mt-1'>
                    <Input
                      type='password'
                      name='password'
                      placeholder='Mật khẩu'
                      register={register}
                      errorMessage={errors.password?.message}
                    />
                    <label htmlFor='confirm_password' className='block text-sm  text-gray-700'>
                      Xác nhận mật khẩu
                    </label>
                    <Input
                      type='password'
                      name='confirm_password'
                      placeholder='Xác nhận mật khẩu'
                      register={register}
                      errorMessage={errors.confirm_password?.message}
                    />
                  </div>
                  <div>
                    <Button
                      type='submit'
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Gửi yêu cầu
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import useQueryParams from 'src/components/useQueryParams'
import { paths, resources } from 'src/constants'
import { ErrorResponseApi } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import * as yup from 'yup'

type FormData = Pick<Schema, 'email'>
const fogotPasswordSchema = schema.pick(['email'])
export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(fogotPasswordSchema)
  })
  const forgotPasswordCustomerMuTation = useMutation({
    mutationFn: (body: FormData) => authApi.forgotPasswordCustomer(body)
  })
  const onSubmit = handleSubmit((res) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      forgotPasswordCustomerMuTation.mutate(res, {
        onSuccess: (res) => {
          toast.success(res.data.message)
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
            const formError = error.response?.data.errors
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key as keyof FormData, {
                  message: formError[key].msg,
                  type: 'Server'
                })
              })
            }
          }
        }
      })
    }, 3000)
  })

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu - YOYO Store</title>
        <meta name='description' content='Đăng ký tài khoản mới tại YOYO Store' />
        <link rel='canonical' href={paths.Screens.AUTH_REGISTER} />
      </Helmet>
      <div className='container'>
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-5 sm:px- lg:px-5'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className=' text-center text-3xl font-sans font-bold text-gray-900'>Quên mật khẩu</h2>
          </div>
          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
              <form className='space-y-6' onSubmit={onSubmit}>
                <div>
                  <label htmlFor='email' className='block text-sm font-sans text-gray-700'>
                    Email
                  </label>
                  <div className='mt-1'>
                    <Input
                      type='email'
                      name='email'
                      placeholder='Nhập địa chỉ email của bạn'
                      register={register}
                      errorMessage={errors.email?.message}
                    />
                  </div>
                  <div>
                    <Button
                      type='submit'
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-sans text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
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

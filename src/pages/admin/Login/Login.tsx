import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Spin } from 'antd'
import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { resources } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/types/utils.type'
import { schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  // Example usage to avoid unused variables error
  // setIsAuthenticated(false);
  // setProfile(null);
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginUserMuTation = useMutation({
    mutationFn: (body: FormData) => userApi.loginUser(body),
    onMutate: () => {
      setIsLoading(true)
    }
  })

  const onSubmit = handleSubmit((res) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      loginUserMuTation.mutate(res, {
        onSuccess: (res) => {
          setIsAuthenticated(true)
          setProfile(res.data.result.user)
          toast.success(res.data.message, { autoClose: 1000 })
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
          setIsLoading(false)
        }
      })
    }, 2000)
  })

  return (
    <Spin tip='Loading' size='large' spinning={isLoading} style={{ minHeight: '100vh' }}>
      <div className='flex h-screen items-center justify-center bg-gray-100'>
        <Helmet>
          <title>Đăng nhập quản trị - YOYO Store</title>
          <meta name='description' content='Đăng nhập tài khoản YOYO Store' />
          <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
        </Helmet>
        <div className='w-full max-w-md bg-white rounded-xl shadow-md p-8'>
          <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Admin Login</h2>

          {/* {error && <p className='text-red-500 mb-4 text-center'>{error}</p>} */}

          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor='email' className='block mb-1 font-medium text-gray-700'>
                Email
              </label>
              <Input
                classNameInput='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 outline-none'
                type='email'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
              />
            </div>

            <div>
              <label htmlFor='password' className='block mb-1 font-medium text-gray-700'>
                Mật khẩu
              </label>
              <Input
                classNameInput='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 outline-none'
                type='password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition flex items-center justify-center'
              loading={isLoading}
              disabled={isLoading}
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </Spin>
  )
}

import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'

import { paths, Resources } from 'src/constants'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
// Import chỉ mỗi function omit
import omit from 'lodash/omit'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { toast } from 'react-toastify'
import Button from 'src/components/Button'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'

// type FormData = Pick<Schema, 'name' | 'phone' | 'email' | 'password' | 'confirm_password'>
type FormData = Schema
const registerSchema = schema.pick(['name', 'phone', 'email', 'password', 'confirm_password'])
export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  // body: Omit<FormData,'confirm_password'>
  const registerCustomerMuTation = useMutation({
    mutationFn: (body: FormData) => authApi.registerCustomer(body)
  })
  const onSubmit = handleSubmit((res) => {
    registerCustomerMuTation.mutate(res, {
      onSuccess: (res) => {
        setIsAuthenticated(true)
        setProfile(res.data.result.customer)
        navigate(paths.Screens.HOME)
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
        } else {
          toast.error('Đăng ký thất bại')
        }
      }
    })
  })
  return (
    <div className='bg-amber-50'>
      <Helmet>
        <title>Đăng ký - YOYO Store</title>
        <meta name='description' content='Đăng ký tài khoản mới tại YOYO Store' />
        <link rel='canonical' href={paths.Screens.AUTH_REGISTER} />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 gap-4'>
          <div className='  lg:col-span-3 flex justify-center'>
            <img src={Resources.Images.THUMBNAIL} alt='Thumbnail' className='max-w-full h-auto object-contain' />
          </div>
          <div className='lg:col-span-2 lg:col-start-4 pt-10' onSubmit={onSubmit}>
            <form action='' className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-3xl text-center'>Đăng ký</div>
              <Input
                className='mt-8'
                type='text'
                placeholder='Họ tên'
                register={register}
                name='name'
                errorMessage={errors.name?.message}
              />
              <Input
                className='mt-1'
                type='text'
                placeholder='Số điện thoại'
                register={register}
                name='phone'
                errorMessage={errors.phone?.message}
              />
              <Input
                className='mt-1'
                type='email'
                placeholder='Email'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-1'
                type='password'
                placeholder='Mật khẩu'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Input
                className='mt-1'
                type='password'
                placeholder='Xác nhận mật khẩu'
                register={register}
                name='confirm_password'
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full py-4 px-3 uppercase text-white bg-red-500 text-sm hover:bg-red-600 border-radius-sm rounded-2xl flex justify-center items-center'
                  loading={registerCustomerMuTation.isPending}
                  disabled={registerCustomerMuTation.isPending}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-3 text-center border-b-2 text-gray-300'>Hoặc</div>
              <div className='mt-3'>
                <div className='flex text-center justify-center'>
                  <span className='text-sm text-gray-300'>Bạn đã có tài khoản?</span>
                  <Link to={paths.Screens.AUTH_LOGIN} className=' text-sm ml-2'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

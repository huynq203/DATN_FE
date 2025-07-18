import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { paths, resources } from 'src/constants'
import { ErrorResponseApi } from 'src/types/utils.type'
import { schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Spin } from 'antd'
import AOS from 'aos'
import 'aos/dist/aos.css'
type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)

  const getGoogleAuthUrl = () => {
    const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env
    const url = `https://accounts.google.com/o/oauth2/v2/auth`
    const query = {
      client_id: VITE_GOOGLE_CLIENT_ID, // Goole
      redirect_uri: VITE_GOOGLE_REDIRECT_URI, // Redirect URL BE
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      prompt: 'consent',
      access_type: 'offline' // to get refresh token
    }
    const queryString = new URLSearchParams(query).toString()
    return `${url}?${queryString}`
  }
  const googleOAuthUrl = getGoogleAuthUrl()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginCustomerMuTation = useMutation({
    mutationFn: (body: FormData) => authApi.loginCustomer(body),
    onMutate: () => {
      setIsLoading(true)
    }
  })
  const onSubmit = handleSubmit((res) => {
    setIsLoading(true)
    loginCustomerMuTation.mutate(res, {
      onSuccess: (res) => {
        setIsLoading(false)
        setIsAuthenticated(true)
        setProfile(res.data.result.customer)
        toast.success(res.data.message, { autoClose: 1000 })
      },
      onError: (error) => {
        setIsLoading(false)
        if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              toast.error(formError[key].msg, { autoClose: 1000 })
            })
          }
        }
      }
    })
  })
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])
  return (
    <Spin tip='Loading' size='large' spinning={isLoading} style={{ minHeight: '100vh' }}>
      <div className='container'>
        <Helmet>
          <title>Đăng nhập - YOYO Store</title>
          <meta name='description' content='Đăng nhập tài khoản YOYO Store' />
          <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
        </Helmet>

        <div className='container  min-h-screen flex items-center justify-center '>
          <div className='grid grid-cols-1 lg:grid-cols-5 lg:pr-10 gap-4'>
            {/* IMAGE */}
            <div className='lg:col-span-3 flex justify-center'>
              <img
                src={resources.Images.THUMBNAIL}
                alt='Login Thumbnail'
                className='w-full h-auto object-contain rounded-lg shadow-xl'
                data-aos='fade-right'
                data-aos-duration='800'
                data-aos-once='true'
                data-aos-easing='ease-in-out'
              />
            </div>

            {/* FORM */}
            <div
              className='lg:col-span-2 lg:col-start-4 lg:pt-20'
              data-aos='fade-left'
              data-aos-duration='800'
              data-aos-once='true'
              data-aos-easing='ease-in-out'
            >
              <form action='' className='p-6 sm:p-10 rounded-lg bg-gray-100 shadow-xl' onSubmit={onSubmit}>
                <div className='text-2xl text-center'>Đăng nhập</div>
                <Input
                  className='mt-8'
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

                <div className='mt-3'>
                  <Button
                    type='submit'
                    className='w-full py-4 px-3 uppercase text-white bg-red-500 text-sm hover:bg-red-600 rounded-2xl flex items-center justify-center'
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Đăng nhập
                  </Button>

                  <div className='text-sm text-right'>
                    <Link to={paths.Screens.AUTH_FORGOT_PASSWORD} className='text-red-500 hover:text-red-600'>
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <div className='mt-3 text-center border-b-2 text-gray-300'>Hoặc</div>
                <div className='mt-5'>
                  <Link to={googleOAuthUrl}>
                    <div className='border hover:border-gray-500 p-3 rounded-2xl flex justify-center items-center'>
                      {/* <FaGoogle className='mr-1' /> */}
                      <div className='min-w-[30px]'>
                        <svg className='h-6 w-6' viewBox='0 0 40 40'>
                          <path
                            d='M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z'
                            fill='#FFC107'
                          />
                          <path
                            d='M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z'
                            fill='#FF3D00'
                          />
                          <path
                            d='M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z'
                            fill='#4CAF50'
                          />
                          <path
                            d='M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z'
                            fill='#1976D2'
                          />
                        </svg>
                      </div>
                      <div className='ml-1'>Đăng nhập với google</div>
                    </div>
                  </Link>
                </div>
                <div className='mt-3'>
                  <div className='flex justify-center text-sm'>
                    <span className='text-gray-500'>Bạn chưa có tài khoản?</span>
                    <Link to={paths.Screens.AUTH_REGISTER} className='ml-2 text-red-500 hover:text-red-600'>
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

import { useMutation } from '@tanstack/react-query'
import { theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import Textarea from 'src/components/Textarea'
import { paths, resources } from 'src/constants'
import CategorySelect from '../components/CategorySelect'
import { productsSchema, ProductSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import productApi from 'src/apis/product.api'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import GenderSelect from '../components/GenderSelect'
import TargetSelect from '../components/TargetSelect'
import { Spin } from 'antd'
type FormData = Pick<ProductSchema, 'category_id' | 'name' | 'price' | 'gender' | 'target_person' | 'description'>

const productSchema = productsSchema.pick(['category_id', 'name', 'price', 'gender', 'target_person', 'description'])
export default function CreateProduct() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const previewImages = useMemo(() => {
    return files.map((file) => {
      return URL.createObjectURL(file)
    })
  }, [files])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createProductMutation = useMutation({
    mutationFn: productApi.createProduct
  })
  const uploadImageMutation = useMutation({
    mutationFn: productApi.uploadImage
  })
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      category_id: '',
      name: '',
      price: '',
      gender: '',
      target_person: '',
      description: ''
    },
    resolver: yupResolver(productSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    try {
      if (files) {
        const form = new FormData()
        files.forEach((file) => {
          form.append('url_images', file)
        })
        const uploadRes = await uploadImageMutation.mutateAsync(form)
        const url_images = uploadRes.data.result
        await createProductMutation.mutateAsync(
          {
            ...data,
            url_images: url_images,
            price: Number(data.price),
            gender: Number(data.gender),
            target_person: Number(data.target_person)
          },
          {
            onSuccess: () => {
              toast.success(MESSAGE.CREATE_PRODUCT_SUCCESS)
              setIsLoading(false)
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                toast.error(error.response?.data.message)
              } else {
                toast.error(MESSAGE.SERVER_ERROR, { autoClose: 1000 })
              }
            }
          }
        )
      }
    } catch (error) {
      // toast.error(MESSAGE.CREATE_PRODUCT_FAILED)
    }
  })

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files
    if (fileFromLocal) {
      setFiles(Array.from(fileFromLocal))
    }
  }
  const handleResetForm = () => {
    setValue('category_id', '')
    setValue('name', '')
    setValue('price', '')
    setValue('gender', '')
    setValue('target_person', '')
    setValue('description', '')
    setFiles([])
  }
  return (
    <Spin spinning={isLoading} tip='Đang thêm dữ liệu...' size='large' style={{ minHeight: '100vh' }}>
      <div>
        <Helmet>
          <title>Thêm sản phẩm - YOYO Store</title>
          <meta name='description' content='Thêm sản phẩm YOYO Store' />
          <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
        </Helmet>
        <div className='rounded bg-gray-50 p-2 m-2'>
          <div className='container'>
            <div className='grid grid-cols-2'>
              <div className='flex text-lg capitalize font-bold mt-1'>
                <Link
                  to={paths.Screens.ADMIN_MANAGER_PRODUCT}
                  className='flex items-center gap-2 text-gray-700 hover:text-blue-600'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path stroke-linecap='round' stroke-linejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
                  </svg>
                </Link>
                <span className='ml-1'>Thêm sản phẩm</span>
              </div>
            </div>
          </div>
        </div>
        <Content>
          <div
            style={{
              padding: 10,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <div className='container'>
              <form className='flex-grow md:mt-0' encType='multipart/form-data' onSubmit={onSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-5'>
                  <div className='flex'>
                    <label className='w-1/4 mt-2 font-medium text-right'>Danh mục</label>
                    <div className='w-3/4 pl-5'>
                      <Controller
                        name='category_id'
                        control={control}
                        render={({ field }) => (
                          <CategorySelect
                            errorMessage={errors.category_id?.message}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='flex'>
                    <label className='w-1/4 font-medium text-right mt-2'>Tên sản phẩm</label>
                    <div className='w-3/4 pl-5'>
                      <Input
                        classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                        register={register}
                        name='name'
                        errorMessage={errors.name?.message}
                      />
                    </div>
                  </div>
                  <div className='flex'>
                    <label className='w-1/4 mt-2 font-medium text-right'>Giới tính</label>
                    <div className='w-3/4 pl-5'>
                      <Controller
                        name='gender'
                        control={control}
                        render={({ field }) => (
                          <GenderSelect
                            errorMessage={errors.gender?.message}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='flex'>
                    <label className='w-1/4 mt-2 font-medium text-right'>Đối tượng</label>
                    <div className='w-3/4 pl-5'>
                      <Controller
                        name='target_person'
                        control={control}
                        render={({ field }) => (
                          <TargetSelect
                            errorMessage={errors.target_person?.message}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='flex '>
                    <label className='w-1/4 font-medium text-right mt-2'>Giá sản phẩm</label>
                    <div className='w-3/4 pl-5'>
                      <Input
                        classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                        register={register}
                        name='price'
                        errorMessage={errors.price?.message}
                      />
                    </div>
                  </div>
                  <div className='flex '>
                    <label className='w-1/4 font-medium text-right mt-2'>Mô tả sản phẩm</label>
                    <div className='w-3/4 pl-5'>
                      <Textarea
                        classNameInput='w-full h-52 rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                        register={register}
                        name='description'
                        errorMessage={errors.description?.message}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col -mt-44'>
                    <div className='flex'>
                      <label className='w-1/4 font-medium text-right'>Hình ảnh sản phẩm</label>
                      <div className='flex flex-col gap-2 ml-5'>
                        <input
                          className='hidden'
                          type='file'
                          accept='.jpg,.jpeg,.png'
                          multiple
                          ref={fileInputRef}
                          onChange={onFileChange}
                        />
                        <button
                          className='h-10 w-fit rounded-sm border bg-white px-6 text-sm text-gray-600 hover:border-black hover:text-black transition-colors duration-200 shadow-sm'
                          type='button'
                          onClick={handleUpload}
                        >
                          Chọn ảnh
                        </button>
                        <div className='text-xs text-gray-400 flex flex-col'>
                          <span>Dung lượng tối đa file là 1MB.</span>
                          <span> Định dạng: .JPEG, .PNG</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex'>
                      <label className='w-1/4 font-medium text-right mt-2'>Xem trước hình ảnh</label>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ml-5'>
                        {previewImages &&
                          previewImages.map((image, index) => (
                            <img
                              key={index}
                              className='h-24 w-24 object-cover rounded-xl shadow-md border'
                              src={image}
                              alt='preview'
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-between mt-10 gap-10 px-10'>
                  <div className='flex items-center space-x-4 ml-28'>
                    <Button
                      type='button'
                      className='h-9 px-5 uppercase text-white bg-blue-500/90 text-sm hover:bg-blue-400/90 flex items-center justify-center rounded-md'
                      onClick={handleResetForm}
                    >
                      Làm mới
                    </Button>
                    <Button
                      type='submit'
                      className='h-9 px-5 uppercase text-white bg-red-500 text-sm hover:bg-red-600 flex items-center justify-center rounded-md'
                    >
                      Thêm mới
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Content>
      </div>
    </Spin>
  )
}

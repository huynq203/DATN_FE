import { useMutation, useQuery } from '@tanstack/react-query'
import { Breadcrumb, message, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import categoryApi from 'src/apis/category.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import Select from 'src/components/Select'
import Textarea from 'src/components/Textarea'
import { paths, resources } from 'src/constants'
import CategorySelect from '../components/CategorySelect'
import { productsSchema, ProductSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import productApi from 'src/apis/product.api'
import { Helmet } from 'react-helmet-async'
import { Media } from 'src/types/product.type'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'

type FormData = ProductSchema
const productSchema = productsSchema
export default function CreateProduct() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const [files, setFiles] = useState<File[]>([])
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
    setValue,
    watch,
    setError
  } = useForm<FormData>({
    defaultValues: {
      category_id: '',
      name: '',
      stock: '',
      price: '',
      size: '',
      color: '',
      description: ''
    },
    resolver: yupResolver(productSchema)
  })
  const onSumit = handleSubmit(async (data) => {
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
            url_images: url_images
          },
          {
            onSuccess: () => {
              toast.success(MESSAGE.CREATE_PRODUCT_SUCCESS)
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
      toast.error(MESSAGE.CREATE_PRODUCT_FAILED)
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
    setValue('stock', '')
    setValue('price', '')
    setValue('size', '')
    setValue('color', '')
    setValue('description', '')
    setFiles([])
  }
  return (
    <div>
      {' '}
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0', paddingTop: 24 }}>
          <Breadcrumb.Item>
            <div className='flex items-center gap-2 text-gray-700'>
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
              {paths.Screens.ADMIN_CREATE_PRODUCT}
            </div>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <div className='container'>
            <Helmet>
              <title>Thêm sản phẩm - YOYO Store</title>
              <meta name='description' content='Thêm sản phẩm YOYO Store' />
              <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
            </Helmet>
            <form className='flex-grow md:mt-0' encType='multipart/form-data' onSubmit={onSumit}>
              <div className='flex flex-wrap mt-5 gap-y-5'>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Danh mục</label>
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
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Số lượng</label>
                  <div className='w-3/4 pl-5'>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='stock'
                      errorMessage={errors.stock?.message}
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-y-5'>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Tên sản phẩm</label>
                  <div className='w-3/4 pl-5'>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='name'
                      errorMessage={errors.name?.message}
                    />
                  </div>
                </div>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Giá sản phẩm</label>
                  <div className='w-3/4 pl-5'>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='price'
                      errorMessage={errors.price?.message}
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-y-5'>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Kích thước</label>
                  <div className='w-3/4 pl-5'>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='size'
                      errorMessage={errors.size?.message}
                    />
                  </div>
                </div>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Màu sắc</label>
                  <div className='w-3/4 pl-5'>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='color'
                      errorMessage={errors.color?.message}
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-y-5'>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Mô tả</label>
                  <div className='w-3/4 pl-5'>
                    <Textarea
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='description'
                      errorMessage={errors.description?.message}
                    />
                  </div>
                </div>
                <div className='flex w-full md:w-1/2'>
                  <label className='w-1/4 pt-3 text-right'>Hình ảnh</label>
                  <div className='w-3/4 pl-5 flex flex-col gap-2'>
                    <input
                      className='hidden'
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      multiple
                      ref={fileInputRef}
                      onChange={onFileChange}
                    />
                    <button
                      className='h-10 w-fit rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
                      type='button'
                      onClick={handleUpload}
                    >
                      Chọn ảnh
                    </button>
                    <div className='text-xs text-gray-400'>Dung lượng tối đa file là 1MB. Định dạng: .JPEG, .PNG</div>
                  </div>
                </div>
              </div>

              <div className='flex justify-between mt-10 gap-10 px-10'>
                <div className='flex items-center space-x-4 ml-28'>
                  <Button
                    type='button'
                    className='h-9 px-5 uppercase text-white bg-blue-500/90 text-sm hover:bg-blue-400/90 flex items-center justify-center rounded-sm'
                    onClick={handleResetForm}
                  >
                    Làm mới
                  </Button>
                  <Button
                    type='submit'
                    className='h-9 px-5 uppercase text-white bg-red-500 text-sm hover:bg-red-600 flex items-center justify-center rounded-sm'
                  >
                    Lưu
                  </Button>
                </div>

                {/* Cột 2: Hình ảnh preview */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
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
            </form>
          </div>
        </div>
      </Content>
    </div>
  )
}

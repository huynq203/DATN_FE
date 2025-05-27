import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Breadcrumb, Table, TableColumnsType, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { paths, resources } from 'src/constants'
import CategorySelect from '../components/CategorySelect'
import Textarea from 'src/components/Textarea'
import Button from 'src/components/Button'
import { toast } from 'react-toastify'
import { MESSAGE } from 'src/constants/messages'
import { yupResolver } from '@hookform/resolvers/yup'
import productApi from 'src/apis/product.api'
import { ProductSchema, productsSchema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { Media } from 'src/types/product.type'
import { isEqual } from 'lodash'
import { createStyles } from 'antd-style'
import ListOptionProduct from '../ListOptionProduct'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'

type FormData = Pick<ProductSchema, 'name' | 'price' | 'description'>
const productSchema = productsSchema.pick(['name', 'price', 'description'])
export default function UpdateProduct() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const { product_id } = useParams()
  const { data: ProductDetail, refetch } = useQuery({
    queryKey: ['product', product_id],
    queryFn: () => productApi.getProductDetail(product_id as string),
    staleTime: 3 * 60 * 1000
  })
  const product = ProductDetail?.data.result

  const [files, setFiles] = useState<File[]>([])
  const previewImages = useMemo(() => {
    return files.map((file) => {
      return URL.createObjectURL(file)
    })
  }, [files])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updatetProductMutation = useMutation({
    mutationFn: productApi.updateProduct
  })
  const uploadImageMutation = useMutation({
    mutationFn: productApi.uploadImage
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      price: '',
      description: ''
    },
    resolver: yupResolver(productSchema)
  })

  const onSubmit = handleSubmit(async (data) => {
    let url_images: Media[] = product?.url_images || []
    try {
      if (files.length > 0) {
        const form = new FormData()
        files.forEach((file) => {
          form.append('url_images', file)
        })
        const uploadRes = await uploadImageMutation.mutateAsync(form)
        url_images = uploadRes.data.result
      }
      await updatetProductMutation.mutateAsync(
        {
          product_id: product_id as string,
          ...data,
          url_images
        },
        {
          onSuccess: () => {
            toast.success(MESSAGE.UPDATE_PRODUCT_SUCCESS)
            refetch()
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
    } catch (error) {
      toast.error(MESSAGE.UPDATE_PRODUCT_FAILED)
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

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('price', String(product.price))
      setValue('description', product.description)
    }
  })
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
              {paths.Screens.ADMIN_EDIT_PRODUCT}
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
              <title>Cập nhật sản phẩm - YOYO Store</title>
              <meta name='description' content='Thêm sản phẩm YOYO Store' />
              <link rel='icon' type='image/svg+xml' href={resources.Images.THUMBNAIL} />
            </Helmet>
            <div>
              <div className='rounded bg-gray-50 p-4'>
                {' '}
                <div className='grid grid-cols-2'>
                  <div className='flex text-lg capitalize mt-1'>Cập nhật sản phẩm</div>
                </div>
              </div>

              <form className='flex-grow md:mt-0' encType='multipart/form-data' onSubmit={onSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-5'>
                  <div>
                    <label className='block mb-2 font-medium'>Danh mục</label>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm bg-gray-100'
                      name='category_id'
                      disabled
                      value={product?.category_id.name}
                    />
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>Tên sản phẩm</label>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='name'
                      errorMessage={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>Giá sản phẩm</label>
                    <Input
                      classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='price'
                      errorMessage={errors.price?.message}
                    />
                  </div>

                  <div className='flex'>
                    <div>
                      <label className='block mb-2 font-medium'>Hình ảnh</label>
                      <div className='flex flex-col gap-2'>
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
                        <div className='text-xs text-gray-400 flex flex-col'>
                          <span>Dung lượng tối đa file là 1MB.</span>
                          <span> Định dạng: .JPEG, .PNG</span>
                        </div>
                      </div>
                    </div>
                    <div className=' ml-2'>
                      <label className='block mb-2 font-medium'>Xem trước hình ảnh</label>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {(previewImages.length > 0 ? previewImages : product?.url_images)?.map((image, index) => (
                          <img
                            key={index}
                            className='h-24 w-24 object-cover rounded-xl shadow-md border'
                            src={typeof image === 'string' ? image : image.url}
                            alt='preview'
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='-mt-40'>
                    <label className='block mb-2 font-medium'>Mô tả</label>
                    <Textarea
                      classNameInput='w-full h-52 rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      register={register}
                      name='description'
                      errorMessage={errors.description?.message}
                    />
                  </div>
                </div>

                <div className='flex px-10 justify-end'>
                  <Link
                    to={paths.Screens.ADMIN_MANAGER_PRODUCT}
                    className='h-9 px-5 uppercase text-white bg-blue-500 text-sm hover:bg-blue-600 rounded-sm flex items-center justify-center mr-1'
                  >
                    Quay lại
                  </Link>

                  <Button
                    type='submit'
                    className='h-9 px-5 uppercase text-white bg-red-500 text-sm hover:bg-red-600 flex items-center justify-center rounded-sm'
                  >
                    Cập nhật
                  </Button>
                </div>
              </form>
            </div>
            <div className='border border-b-gray-300 mt-3' />
            <ListOptionProduct product_id={product_id as string} />
          </div>
        </div>
      </Content>
    </div>
  )
}

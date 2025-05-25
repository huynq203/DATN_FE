import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'

import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import customerApi from 'src/apis/customer.api'
import Button from 'src/components/Button'
import DateSelect from 'src/components/DateSelect'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { paths } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'
import { Customer } from 'src/types/customer.type'
import { saveProfileToLS } from 'src/utils/auth'
import { customerSchema, CustomerSchema } from 'src/utils/rules'

type FormData = Pick<CustomerSchema, 'name' | 'phone' | 'date_of_birth'>
const profileSchema = customerSchema.pick(['name', 'phone', 'date_of_birth'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      return customerApi.getProfile()
    }
  })
  const profile = profileData?.data.result

  const updateProfileMutation = useMutation({
    mutationFn: customerApi.updateProfile
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
      name: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date())
    }
  }, [profile])

  const onSubmit = handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(
      {
        ...data,
        date_of_birth: data.date_of_birth?.toISOString()
      },
      {
        onSuccess: (res) => {
          setProfile((prev) => ({ ...prev, ...res.data.result }))
          saveProfileToLS({ ...res.data.result })
          toast.success(res.data.message)
          refetch()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  })

  return (
    <div className='rounded-sm px-7 pb-20 shadow'>
      <Helmet>
        <title>Trang cá nhân - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.PROFILE} />
      </Helmet>
      <div className='border-b border-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ cá nhân</h1>
      </div>
      <form className=' flex-grow pr-12 md:mt-0' onSubmit={onSubmit}>
        <div className='flex flex-wrap mt-5'>
          <div className='w-[20%] truncate pt-3 text-right'>Email</div>
          <div className='w-[50%] pl-5 '>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm '
              value={profile?.email}
              disabled
            />
          </div>
          {profile?.verify === 0 ? (
            <div className='w-[20%]'>
              <Button type='button' className='pt-3 pl-3 text-xs text-red-500' >
                Verify tài khoản
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className='flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right'>Tên</div>
          <div className='w-[50%] pl-5'>
            <Input
              classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm '
              register={register}
              name='name'
              errorMessage={errors.name?.message}
            />
          </div>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right'>Số điện thoại</div>
          <div className='w-[50%] pl-5'>
            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <InputNumber
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  errorMessage={errors.phone?.message}
                  {...field}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className='flex flex-wrap'>
          <div className='w-[20%] truncate pt-3 text-right'>Địa chỉ</div>
          {profile && (
            <div className='w-[50%] pl-5'>
              {profile.addresses && profile.addresses.length > 0 ? (
                <div className='flex'>
                  <select className='h-10 w-full rounded-sm border border-black/10 px-3 py-2  cursor-pointer hover:border-red-500'>
                    <option disabled>Địa chỉ</option>
                    {profile.addresses.map((item) => (
                      <option key={item._id} value={item.address}>
                        {item.address}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className='flex items-center'>
                  <div className='pt-3 text-gray-700'>Chưa có địa chỉ nào</div>
                </div>
              )}
            </div>
          )}
          <div className='w-[10%]'>
            <Link to={paths.Screens.ADDRESS} className='pt-3 pl-3 text-xs text-red-500'>
              Thêm địa chỉ
            </Link>
          </div>
        </div>
        <Controller
          control={control}
          name='date_of_birth'
          render={({ field }) => (
            <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
          )}
        />

        <div className='flex flex-wrap mt-5'>
          <div className='w-[20%] truncate pt-3 text-right'></div>
          <div className='w-[50%] pl-5'>
            <Button
              type='submit'
              className='flex h-9 px-5  uppercase text-white bg-red-500 text-sm hover:bg-red-600 flex items-center justify-center'
            >
              Lưu
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

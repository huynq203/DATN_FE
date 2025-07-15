import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import addressApi from 'src/apis/address.api'
import Button from 'src/components/Button'
import ModalCreateAddress from 'src/components/Addresses/ModalCreateAddress'
import { paths } from 'src/constants'
import { Addresses } from 'src/types/address.type'
import ModalUpdateAddress from 'src/components/Addresses/ModalUpdateAddress'
import swalAlert from 'src/utils/SwalAlert'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponseApi } from 'src/types/utils.type'
import { MESSAGE } from 'src/constants/messages'

export default function Address() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [addressDetail, setAddressDetail] = useState<Addresses>()
  const { data: listAddresses, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => {
      return addressApi.getAddressbyCustomer()
    }
  })
  const addressesData = listAddresses?.data.result

  const addressDefault = addressesData?.find((item) => item.isDefault)

  const setAddressDefaultMutation = useMutation({
    mutationFn: addressApi.setDefaultAddress
  })
  const handleSetAddressDefault = (address_id: string) => {
    setAddressDefaultMutation.mutate(
      { address_id },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          refetch()
        }
      }
    )
  }
  const deleteAddressMutation = useMutation({
    mutationFn: addressApi.deleteAddress
  })
  const handleDeleteAddress = (address_id: string) => {
    swalAlert.showConfirm().then((result) => {
      if (result.isConfirmed) {
        deleteAddressMutation.mutate(
          { address_id },
          {
            onSuccess: (data) => {
              toast.success(data.data.message)
              refetch()
            },
            onError: (error) => {
              if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
                toast.error(error.response?.data.message)
              } else {
                toast.error(MESSAGE.SERVER_ERROR + ' - ' + error, { autoClose: 1000 })
              }
            }
          }
        )
      }
    })
  }
  return (
    <div className='rounded-sm  px-7 pb-20 shadow'>
      <Helmet>
        <title>Địa chỉ - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.ADDRESS} />
      </Helmet>
      <div className='border-b border-gray-200 py-6 flex justify-between'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Địa chỉ</h1>
        <Button
          className='bg-blue-200/90 text-blue-700 hover:bg-blue-300/90 px-4 py-2 rounded-md font-bold'
          onClick={() => setIsModalOpen(true)}
        >
          <div className='flex'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
            <span>Thêm địa chỉ</span>
          </div>
        </Button>
      </div>
      {addressesData && addressesData.length > 0 ? (
        <div className='p-4 max-w-5xl mx-auto  '>
          <div key={addressDefault?._id} className='grid grid-cols-2 border-b py-2 flex justify-between gap-1'>
            <div className='col-span-1'>
              <div className='font-semibold'>
                {addressDefault?.name} | {addressDefault?.phone}
                <span className='ml-2 text-red-500 border border-red-500 text-xs px-2 py-0.5 rounded'>Mặc định</span>
              </div>
              <div className='text-sm text-gray-700'>{addressDefault?.address}</div>
            </div>
            <div className='mt-2 space-x-2 col-span-1 flex justify-end items-center'>
              <Button
                className='px-3 py-1 bg-blue-600/90 hover:bg-blue-700/90 text-white rounded-md'
                onClick={() => {
                  setAddressDetail(addressDefault)
                  setIsModalUpdateOpen(true)
                }}
              >
                Cập nhật
              </Button>
            </div>
          </div>
          {addressesData &&
            addressesData.map((item) => (
              <>
                {!item.isDefault && (
                  <div key={item._id} className='grid grid-cols-2 border-b py-2 flex justify-between gap-1'>
                    <div className='col-span-1'>
                      <div className='font-semibold'>
                        {item.name} | {item.phone}
                        {item.isDefault && (
                          <span className='ml-2 text-red-500 border border-red-500 text-xs px-2 py-0.5 rounded'>
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className='text-sm text-gray-700'>{item.address}</div>
                    </div>
                    <div className='mt-2 space-x-2 col-span-1 flex justify-end items-center'>
                      <Button
                        className='px-3 py-1 bg-blue-600/90 hover:bg-blue-700/90 text-white rounded-md'
                        onClick={() => {
                          setAddressDetail(item)
                          setIsModalUpdateOpen(true)
                        }}
                      >
                        Cập nhật
                      </Button>
                      <Button
                        className='px-3 py-1 bg-red-600/90 hover:bg-red-700/90 text-white rounded-md'
                        onClick={() => handleDeleteAddress(item._id)}
                      >
                        Xóa
                      </Button>
                      <Button
                        className='px-3 py-1 border text-sm rounded-md hover:bg-gray-100'
                        onClick={() => handleSetAddressDefault(item._id)}
                      >
                        Thiết lập mặc định
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
      ) : (
        <div className='text-center mt-10 text-gray-500 font-semibold text-lg'>
          Bạn chưa có địa chỉ nào, hãy thêm địa chỉ để nhận hàng
        </div>
      )}

      <ModalCreateAddress isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ModalUpdateAddress
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        addressDetail={addressDetail as Addresses}
      />
    </div>
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import addressApi from 'src/apis/address.api'
import { Addresses } from 'src/types/address.type'
import ModalCreateAddress from '../ModalCreateAddress'
import ModalUpdateAddress from '../ModalUpdateAddress'
interface Props {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}
export default function ModalGetAllAdresses({ isModalOpen, setIsModalOpen }: Props) {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false)
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
          refetch()
        }
      }
    )
  }

  const handleOk = () => {
    setIsModalOpen(false)
    refetch()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <Modal
      title='Địa chỉ của bạn'
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      width={700}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className='flex justify-between items-center mb-4'>
        <div></div>
        <Button onClick={() => setIsModalCreateOpen(true)}>Thêm địa chỉ</Button>
      </div>
      <div className='p-4 max-w-5xl mx-auto  '>
        <div key={addressDefault?._id} className='grid grid-cols-5 border-b py-2 flex justify-between gap-1'>
          <div className='col-span-4'>
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
                <div key={item._id} className='grid grid-cols-5 border-b py-2 flex justify-between gap-1'>
                  <div className='col-span-3'>
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
                  <div className='mt-2 space-x-2 col-span-2 flex justify-end items-center'>
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
                      className='px-3 py-1 border text-sm rounded-md hover:bg-gray-100'
                      onClick={() => {
                        handleSetAddressDefault(item._id)
                        setIsModalOpen(false)
                      }}
                    >
                      Chọn
                    </Button>
                  </div>
                </div>
              )}
            </>
          ))}
      </div>
      <ModalCreateAddress isModalOpen={isModalCreateOpen} setIsModalOpen={setIsModalCreateOpen} />
      <ModalUpdateAddress
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        addressDetail={addressDetail as Addresses}
      />
    </Modal>
  )
}

import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Button from 'src/components/Button'
import { formatCurrency, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { Cart as Carts } from 'src/types/cart.type'
import { paths, resources } from 'src/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import orderApi from 'src/apis/order.api'
import { toast } from 'react-toastify'
import { PaymentMethod } from 'src/constants/enum'
import { ErrorResponseApi } from 'src/types/utils.type'
import addressApi from 'src/apis/address.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import ModalGetAllAdresses from 'src/components/Addresses/ModalGetAllAdresses'

interface CheckoutState {
  buyProducts: Carts[]
  totalAfterDiscountPrice: number
  TotalDiscount: number
  codeVoucher?: string
}

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false)
  const [isModelOpen, setIsModalOpen] = useState(false)
  const location = useLocation()
  const { buyProducts, totalAfterDiscountPrice, TotalDiscount, codeVoucher } = location.state as CheckoutState

  const [selectedPayment, setSelectedPayment] = useState(0)

  const navigate = useNavigate()

  const handleChangePayment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSelectedPayment(Number(value))
  }

  const { data: listAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => {
      return addressApi.getAddressbyCustomer()
    }
  })
  const addressesData = listAddresses?.data.result

  const addressDefault = addressesData?.find((item) => item.isDefault)

  const createOrderCodeMutation = useMutation({
    mutationFn: orderApi.createCodOrder
  })
  const createOrderMomoMutation = useMutation({
    mutationFn: orderApi.createMomoOrder
  })
  const createOrderVNPayMutation = useMutation({
    mutationFn: orderApi.createVnpayOrder
  })
  const handleOrder = () => {
    setIsLoading(true)
    const orderData = {
      order_details: buyProducts.map((item) => ({
        cart_id: item._id,
        product_id: item.product_id._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        cost_price: item.cost_price
      })),
      total_price: totalAfterDiscountPrice,
      payment_method: selectedPayment,
      address: addressDefault?._id as string,
      discount_price: TotalDiscount ? TotalDiscount : 0,
      code_voucher: codeVoucher ? codeVoucher : ''
    }
    if (selectedPayment === PaymentMethod.COD) {
      createOrderCodeMutation.mutate(orderData, {
        onSuccess: (res) => {
          setTimeout(() => {
            setIsLoading(false)
            toast.success(res.data.message)
            history.replaceState(null, '')
            navigate(paths.Screens.CHECK_ORDER, {
              state: {
                payment_method: PaymentMethod.COD
              }
            })
          }, 3000)
        },
        onError: (error) => {
          setIsLoading(false)
          if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
            toast.error(error.response?.data.message)
          } else {
            const axiosError = error as import('axios').AxiosError<ErrorResponseApi>
            toast.error(axiosError.response?.data.message, { autoClose: 1000 })
          }
        }
      })
    } else if (selectedPayment === PaymentMethod.MOMO) {
      createOrderMomoMutation.mutate(orderData, {
        onSuccess: (res) => {
          // window.location.href = res.data.result
          // navigate(paths.Screens.CHECK_ORDER)
        }
      })
    } else if (selectedPayment === PaymentMethod.VNPAY) {
      setIsLoading(true)
      createOrderVNPayMutation.mutate(orderData, {
        onSuccess: (res) => {
          setTimeout(() => {
            setIsLoading(false)
            window.location.href = res.data.paymentUrl
          }, 3000)
        }
      })
    }
  }

  return (
    <div className='bg-white '>
      <Helmet>
        <title>Thanh toán</title>
        <meta name='description' content='Thanh toán Yoyo' />
      </Helmet>
      {buyProducts && (
        <div className='container'>
          {/* {isLoading && (
            <div className='fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50'>
              <div className='text-xl font-semibold animate-pulse text-black-700'>Đang tải dữ liệu</div>
              <div className='ml-48 mt-2'>
                <Loading loading={isLoading} color='black' top='50%' />
              </div>
            </div>
          )} */}
          <div className='bg-white pt-10 pb-5 flex justify-center items-center'>
            <div className='container mx-auto flex flex-col md:flex-row bg-gray-100 rounded-lg shadow-lg p-6'>
              <div className='flex-1 md:mr-6'>
                {/* Product Information */}
                <div className='mb-6'>
                  <h3 className='text-lg font-bold mb-3'>Thông tin sản phẩm</h3>
                  {buyProducts.map((item) => (
                    <div className='bg-white p-4 rounded-lg flex' key={item._id}>
                      <img
                        src={item.product_id.url_images?.[0]?.url}
                        alt='Product'
                        className='w-20 h-20 mr-4 rounded-md'
                      />
                      <div className=' text-sm'>
                        <div></div>
                        <p>{item.product_id.name}</p>
                        <p className='text-xs'>Kích thước: {item.size}</p>
                        <p className='text-xs'>Màu sắc: {item.color}</p>
                        <div className='flex justify-between items-center'>
                          {' '}
                          <p className='text-xs items-start'>Số lượng: x{item.quantity}</p>
                          {item.product_id.promotion_price > 0 ? (
                            <p className='text-red-400 items-end'>đ{formatCurrency(item.product_id.promotion_price)}</p>
                          ) : (
                            <p className='text-red-400 items-end'>đ{formatCurrency(item.product_id.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex-1 bg-white p-6 rounded-lg'>
                <div>
                  <h3 className='text-lg font-bold mb-3'>Chọn hình thức thanh toán</h3>
                  <div className='flex flex-row'>
                    <label className=' flex items-center'>
                      <input
                        type='radio'
                        name='payment'
                        value={0}
                        className='mr-2'
                        defaultChecked
                        onChange={handleChangePayment}
                      />
                      <img src={resources.Images.COD} alt='' className='h-4 w-4 mr-1' />
                      Cod
                    </label>
                    {/* <label className=' ml-5 flex items-center'>
                      <input type='radio' name='payment' value={1} className='mr-2' onChange={handleChangePayment} />
                      <img src={resources.Images.MOMO} alt='' className='h-4 w-4 mr-1' />
                      Momo
                    </label> */}

                    <label className='flex ml-5 items-center'>
                      <input type='radio' name='payment' value={2} className='mr-2' onChange={handleChangePayment} />
                      <img src={resources.Images.VN_PAY} alt='' className='h-4 w-4 mr-1' />
                      VNPay
                    </label>
                  </div>
                </div>

                <div key={addressDefault?._id} className='grid grid-cols-4 border-b py-2 flex flex-row gap-1'>
                  <div className='col-span-3'>
                    <div className='font-semibold'>
                      {addressDefault?.name} | {addressDefault?.phone}
                      <span className='ml-2 text-red-500 border border-red-500 text-xs px-2 py-0.5 rounded'>
                        Mặc định
                      </span>
                    </div>
                    <div className='text-sm text-gray-700'>{addressDefault?.address}</div>
                  </div>
                  <div className='mt-2 space-x-2 col-span-1 flex items-center'>
                    <Button
                      type='button'
                      className='px-3 py-1 bg-blue-600/90 hover:bg-blue-700/90 text-white rounded-md'
                      onClick={() => {
                        setIsModalOpen(true)
                      }}
                    >
                      Thay đổi
                    </Button>
                    <ModalGetAllAdresses isModalOpen={isModelOpen} setIsModalOpen={setIsModalOpen} />
                  </div>
                </div>
                <div className='bg-gray-100 p-4 rounded-lg mt-4'>
                  <p>
                    Tổng tiền hàng: <span className='font-bold'>{formatCurrency(totalAfterDiscountPrice)} đ</span>
                  </p>
                  <p>
                    Phí vận chuyển: <span className='font-bold'>Miễn phí</span>
                  </p>
                  <p>
                    Giảm giá: <span className='font-bold'>{formatCurrency(TotalDiscount)} đ</span>
                  </p>
                  <p className='mt-3 font-bold text-xl text-red-400'>
                    Tổng tiền thanh toán: {formatCurrency(totalAfterDiscountPrice)} đ
                  </p>
                  <p className='text-sm mt-2'>
                    (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát sinh khác)
                  </p>
                </div>
                <Button
                  className='w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg mt-6 flex justify-center items-center'
                  onClick={handleOrder}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, message, Result } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import orderApi from 'src/apis/order.api'
import { paths } from 'src/constants'
import { MESSAGE } from 'src/constants/messages'
import Loading from '../Loading'
import { Helmet } from 'react-helmet-async'
import { CartStatus, PaymentMethod, VnPayStatus } from 'src/constants/enum'
import cartApi from 'src/apis/cart.api'

export default function NotifyOrder() {
  const location = useLocation()
  const searchParams = new URLSearchParams(useLocation().search)
  const [status, setStatus] = useState<'success' | 'error' | 'info'>('info')
  const [title, setTitle] = useState('Đang xử lý đơn hàng')
  const [subtitle, setSubTitle] = useState('Đang xử lý đơn hàng của bạn, vui lòng chờ trong giây lát')
  const [isLoading, setIsLoading] = useState(true)
  const { payment_method } = location.state || ''

  const { refetch } = useQuery({
    queryKey: ['cart', { status: CartStatus.InCart }],
    queryFn: () => cartApi.getCart({ status: CartStatus.InCart })
  })

  const { data: checkOrderVnpay } = useQuery({
    queryKey: ['', searchParams.toString()],
    queryFn: () => orderApi.checkVnpayOrder(Object.fromEntries(searchParams.entries()))
  })
  const checkOrderVnp = checkOrderVnpay?.data.result
  console.log(checkOrderVnp)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)

      if (checkOrderVnp?.payment_method === PaymentMethod.VNPAY) {
        if (checkOrderVnp?.vnp_ResponseCode === VnPayStatus.Success) {
          setStatus('success')
          setTitle('Thanh toán thành công')
          setSubTitle('Đơn hàng của bạn đã được thanh toán thành công')
          refetch()
        } else if (checkOrderVnp?.vnp_ResponseCode === VnPayStatus.Cancel) {
          setStatus('error')
          setTitle('Thanh toán thất bại')
          setSubTitle('Đơn hàng của bạn đã bị hủy')
          refetch()
        }
      } else if (payment_method === PaymentMethod.COD) {
        setStatus('success')
        setTitle('Thanh toán thành công')
        setSubTitle('Đơn hàng của bạn đã được thanh toán thành công')
        refetch()
      }
    }, 3000)
  }, [searchParams])

  return (
    <div className='bg-white'>
      <Helmet>
        <title>Kiểm tra thanh toán</title>
        <meta name='description' content='Thanh toán Yoyo' />
      </Helmet>
      <div className='container'>
        <Loading loading={isLoading} color='black' top='50%' />
        <Result
          status={status}
          title={title}
          subTitle={subtitle}
          extra={[
            <Link
              to={paths.Screens.PRODUCT}
              className=' bg-red-500 text-white rounded-md p-3 hover:bg-red-500/90 hover:text-white/90 transition-all duration-300 '
            >
              Mua hàng
            </Link>
          ]}
        />
      </div>
    </div>
  )
}

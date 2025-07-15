import { useQuery } from '@tanstack/react-query'
import { Result } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import orderApi from 'src/apis/order.api'
import { paths } from 'src/constants'
import Loading from '../Loading'
import { Helmet } from 'react-helmet-async'
import { CartStatus, PaymentMethod, VnPayStatus } from 'src/constants/enum'
import cartApi from 'src/apis/cart.api'
import productApi from 'src/apis/product.api'

export default function NotifyOrder() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const partnerCode = searchParams.get('partnerCode')
  const { payment_method_cod } = location.state || {}
  const vnpayResponseCode = searchParams.get('vnp_ResponseCode')
  const [status, setStatus] = useState<'success' | 'error' | 'info'>('info')
  const [title, setTitle] = useState('Đang xử lý đơn hàng')
  const [subtitle, setSubTitle] = useState('Đang xử lý đơn hàng của bạn, vui lòng chờ trong giây lát')
  const [isLoading, setIsLoading] = useState(true)

  const { refetch: refetchCart } = useQuery({
    queryKey: ['cart', { status: CartStatus.InCart }],
    queryFn: () => cartApi.getCart({ status: CartStatus.InCart })
  })

  const { refetch: refetchProduct } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts({})
  })

  const { data: checkOrderVnpay } = useQuery({
    queryKey: ['check-order-vnpay', searchParams.toString()],
    queryFn: () => orderApi.checkVnpayOrder(Object.fromEntries(searchParams.entries())),
    enabled: vnpayResponseCode !== null
  })
  const { data: checkOrderMomo } = useQuery({
    queryKey: ['check-order-momo', searchParams.toString()],
    queryFn: () => orderApi.checkMomoOrder(Object.fromEntries(searchParams.entries())),
    enabled: partnerCode === 'MOMO'
  })

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)

      if (partnerCode === 'MOMO') {
        if (searchParams.get('resultCode') === '0') {
          setStatus('success')
          setTitle('Thanh toán MOMO thành công')
          setSubTitle('Đơn hàng của bạn đã được thanh toán thành công và sẽ được giao trong thời gian sớm nhất')
        } else {
          setStatus('error')
          setTitle('Thanh toán MOMO thất bại')
          setSubTitle('Đơn hàng của bạn thanh toán qua MOMO không thành công hoặc đã bị hủy')
        }
        refetchCart()
        refetchProduct()
      } else if (vnpayResponseCode !== null) {
        if (searchParams.get('vnp_ResponseCode') === VnPayStatus.Success) {
          setStatus('success')
          setTitle('Thanh toán VNPAY thành công')
          setSubTitle('Đơn hàng của bạn đã được thanh toán thành công và sẽ được giao trong thời gian sớm nhất')
          refetchCart()
          refetchProduct()
        } else if (searchParams.get('vnp_ResponseCode') === VnPayStatus.Cancel) {
          setStatus('error')
          setTitle('Thanh toán VNPAY thất bại')
          setSubTitle('Đơn hàng của bạn đã bị hủy hoặc thanh toán không thành công')
        }
      } else {
        setStatus('success')
        setTitle('Đặt hàng thành công')
        setSubTitle('Đơn hàng của bạn đã được đặt thành công và sẽ được giao trong thời gian sớm nhất')
        refetchCart()
        refetchProduct()
      }
    }, 3000)
  }, [searchParams, partnerCode, checkOrderMomo, checkOrderVnpay, payment_method_cod])

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
              to={paths.Screens.HISTORY_ORDER}
              className=' bg-red-500 text-white rounded-md p-3 hover:bg-red-500/90 hover:text-white/90 transition-all duration-300 '
              key='check-order'
            >
              Kiểm tra đơn hàng
            </Link>
          ]}
        />
      </div>
    </div>
  )
}

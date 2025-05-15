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

export default function NotifyOrder() {
  const navigator = useNavigate()
  const searchParams = new URLSearchParams(useLocation().search)
  const [status, setStatus] = useState<'success' | 'error' | 'info'>('info')
  const [title, setTitle] = useState('Đang xử lý đơn hàng')
  const [subtitle, setSubTitle] = useState('Đang xử lý đơn hàng của bạn, vui lòng chờ trong giây lát')
  const [isLoading, setIsLoading] = useState(true)

  const { data: checkOrderVnpay } = useQuery({
    queryKey: ['', searchParams.toString()],
    queryFn: () => orderApi.checkVnpayOrder(Object.fromEntries(searchParams.entries()))
  })

  const checkOrder = checkOrderVnpay?.data.result

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      if (checkOrder?.vnp_ResponseCode == '00') {
        setStatus('success')
        setTitle('Thanh toán thành công')
        setSubTitle('Đơn hàng của bạn đã được thanh toán thành công')
      } else if (checkOrder?.vnp_ResponseCode == '24') {
        setStatus('error')
        setTitle('Thanh toán thất bại')
        setSubTitle('Đơn hàng của bạn đã bị hủy')
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

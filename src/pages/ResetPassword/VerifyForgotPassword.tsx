import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import useQueryParams from 'src/components/useQueryParams'
import { paths } from 'src/constants'
import { ErrorResponseApi } from 'src/types/utils.type'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

export default function VerifyForgotPassword() {
  const query = useQueryParams()
  const navigate = useNavigate()
  const { token } = query
  const verifyForgotPasswordMutation = useMutation({
    mutationFn: () => authApi.verifyForgotPasswordCustomer({ forgot_password_token: token }),
    onSuccess: (res) => {
      toast.success(res.data.message)
      navigate(paths.Screens.AUTH_RESET_PASSWORD, {
        state: { forgot_password_token: token }
      })
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
        toast.error(error.response?.data.message)
      }
      navigate(paths.Screens.AUTH_FORGOT_PASSWORD)
    }
  })
  //C1
  const isMounted = useRef(false)
  useEffect(() => {
    if (token && !isMounted.current) {
      isMounted.current = true
      verifyForgotPasswordMutation.mutate()
    }
    return () => {
      isMounted.current = true
    }
  }, [])
  //C2
  // useEffect(() => {
  //   let isMounted = false
  //   if (token) {
  //     authApi
  //       .verifyForgotPasswordCustomer({ forgot_password_token })
  //       .then((res) => {
  //         if (!isMounted) {
  //           toast.success(res.data.message)
  //           navigate(paths.Screens.AUTH_RESET_PASSWORD)
  //         }
  //       })
  //       .catch((error) => {
  //         if (isAxiosUnprocessableEntityError<ErrorResponseApi>(error)) {
  //           toast.error(error.response?.data.message)
  //           navigate(paths.Screens.AUTH_FORGOT_PASSWORD)
  //         } else {
  //           toast.error('Có lỗi xảy ra, vui lòng thử lại')
  //         }
  //       })
  //   }

  //   return () => {
  //     isMounted = true
  //   }
  // }, [])

  return <div></div>
}

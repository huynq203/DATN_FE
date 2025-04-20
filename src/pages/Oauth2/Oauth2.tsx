import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Screens } from 'src/constants'
export default function Oauth2() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  useEffect(() => {
    document.title = 'Đăng nhập - YOYO'
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = params.get('newUser')
    //Test UI cho trường hợp login
    localStorage.setItem('access_token', access_token as string)
    localStorage.setItem('refresh_token', refresh_token as string)

    navigate(Screens.HOME)
  }, [params])
  return <div>Oauth2</div>
}

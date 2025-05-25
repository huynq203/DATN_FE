import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { paths } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'
import { saveAccessToken, saveProfileToLS, saveRefreshToken } from 'src/utils/auth'
export default function Oauth2() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setIsAuthenticated } = useContext(AppContext)
  useEffect(() => {
    const access_token = params.get('access_token') as string
    const refresh_token = params.get('refresh_token') as string
    const profile = JSON.parse(params.get('customer') as string)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = params.get('newUser')
    //Test UI cho trường hợp login
    saveAccessToken(access_token)
    saveRefreshToken(refresh_token)
    saveProfileToLS(profile)
    setIsAuthenticated(true)
    navigate(paths.Screens.HOME)
  }, [params])
  return <div>Oauth2</div>
}

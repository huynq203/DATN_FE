import { Login, ForgotPassword } from '../pages/Login'
import Register from '../pages/Register'
import Oauth2 from '../pages/Oauth2'
import { Screens } from 'src/constants'
import RegisterLayout from 'src/layouts/RegisterLayout'
export default function AuthRoutes() {
  const authRoutes = [
    {
      path: Screens.AUTH_LOGIN,
      element: (
        <>
          <RegisterLayout>
            <Login />
          </RegisterLayout>
        </>
      )
    },
    {
      path: Screens.AUTH_OAUTH,
      element: (
        <>
          <RegisterLayout>
            <Oauth2 />
          </RegisterLayout>
        </>
      )
    },
    {
      path: Screens.AUTH_REGISTER,
      element: (
        <>
          <RegisterLayout>
            <Register />
          </RegisterLayout>
        </>
      )
    },
    {
      path: Screens.AUTH_FORGOT_PASSWORD,
      element: (
        <>
          <RegisterLayout>
            <ForgotPassword />
          </RegisterLayout>
        </>
      )
    }
  ]
  return authRoutes
}

import { Login, ForgotPassword } from '../pages/Login'
import Register from '../pages/Register'
import Oauth2 from '../pages/Oauth2'
import { Constants } from 'src/constants'
import RegisterLayout from 'src/layouts/RegisterLayout'
import { RejectedRoute } from 'src/pages/Login/isAuthenticated'

export default function AuthRoutes() {
  const authRoutes = [
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: Constants.Screens.AUTH_LOGIN,
          element: (
            <>
              <RegisterLayout>
                <Login />
              </RegisterLayout>
            </>
          )
        },
        {
          path: Constants.Screens.AUTH_OAUTH,
          element: (
            <>
              <RegisterLayout>
                <Oauth2 />
              </RegisterLayout>
            </>
          )
        },
        {
          path: Constants.Screens.AUTH_REGISTER,
          element: (
            <>
              <RegisterLayout>
                <Register />
              </RegisterLayout>
            </>
          )
        },
        {
          path: Constants.Screens.AUTH_FORGOT_PASSWORD,
          element: (
            <>
              <RegisterLayout>
                <ForgotPassword />
              </RegisterLayout>
            </>
          )
        }
      ]
    }
  ]
  return authRoutes
}

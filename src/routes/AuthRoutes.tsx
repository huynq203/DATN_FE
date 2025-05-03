import { Login, ForgotPassword } from '../pages/Login'
import Register from '../pages/Register'
import Oauth2 from '../pages/Oauth2'
import { paths } from 'src/constants'
import RegisterLayout from 'src/layouts/RegisterLayout'
import { RejectedRoute } from 'src/pages/Login/isAuthenticated'
import { ResetPassword, VerifyForgotPassword } from 'src/pages/ResetPassword'

export default function AuthRoutes() {
  const authRoutes = [
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: paths.Screens.AUTH_LOGIN,
          element: (
            <>
              <RegisterLayout>
                <Login />
              </RegisterLayout>
            </>
          )
        },
        {
          path: paths.Screens.AUTH_OAUTH,
          element: (
            <>
              <RegisterLayout>
                <Oauth2 />
              </RegisterLayout>
            </>
          )
        },
        {
          path: paths.Screens.AUTH_REGISTER,
          element: (
            <>
              <RegisterLayout>
                <Register />
              </RegisterLayout>
            </>
          )
        },
        {
          path: paths.Screens.AUTH_FORGOT_PASSWORD,
          element: (
            <>
              <RegisterLayout>
                <ForgotPassword />
              </RegisterLayout>
            </>
          )
        },
        {
          path: paths.Screens.AUTH_VERIFY_FORGOT_PASSWORD,
          element: (
            <>
              <RegisterLayout>
                <VerifyForgotPassword />
              </RegisterLayout>
            </>
          )
        },
        {
          path: paths.Screens.AUTH_RESET_PASSWORD,
          element: (
            <>
              <RegisterLayout>
                <ResetPassword />
              </RegisterLayout>
            </>
          )
        }
      ]
    }
  ]
  return authRoutes
}

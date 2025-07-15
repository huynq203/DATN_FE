import { Login } from '../pages/Login'
import Register from '../pages/Register'
import Oauth2 from '../pages/Oauth2'
import { paths } from 'src/constants'
import { RejectedRoute } from 'src/pages/Login/isAuthenticated'
import { ResetPassword, VerifyForgotPassword } from 'src/pages/ResetPassword'
import { Suspense } from 'react'
import ForgotPassword from 'src/pages/Login/ForgotPassword'
import VerifyEmail from 'src/pages/VerifyEmail'
export default function AuthRoutes() {
  const authRoutes = [
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: paths.Screens.AUTH_LOGIN,
          element: (
            <Suspense>
              <Login />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_OAUTH,
          element: (
            <Suspense>
              <Oauth2 />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_REGISTER,
          element: (
            <Suspense>
              <Register />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_FORGOT_PASSWORD,
          element: (
            <Suspense>
              <ForgotPassword />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_VERIFY_FORGOT_PASSWORD,
          element: (
            <Suspense>
              <VerifyForgotPassword />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_VERIFY_EMAIL,
          element: (
            <Suspense>
              <VerifyEmail />
            </Suspense>
          )
        },
        {
          path: paths.Screens.AUTH_RESET_PASSWORD,
          element: (
            <Suspense>
              <ResetPassword />
            </Suspense>
          )
        }
      ]
    }
    // children: [
    //   {
    //     path: paths.Screens.AUTH_LOGIN,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <Login />
    //         </RegisterLayout>
    //       </>
    //     )
    //   },
    //   {
    //     path: paths.Screens.AUTH_OAUTH,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <Oauth2 />
    //         </RegisterLayout>
    //       </>
    //     )
    //   },
    //   {
    //     path: paths.Screens.AUTH_REGISTER,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <Register />
    //         </RegisterLayout>
    //       </>
    //     )
    //   },
    //   {
    //     path: paths.Screens.AUTH_FORGOT_PASSWORD,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <ForgotPassword />
    //         </RegisterLayout>
    //       </>
    //     )
    //   },
    //   {
    //     path: paths.Screens.AUTH_VERIFY_FORGOT_PASSWORD,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <VerifyForgotPassword />
    //         </RegisterLayout>
    //       </>
    //     )
    //   },
    //   {
    //     path: paths.Screens.AUTH_RESET_PASSWORD,
    //     element: (
    //       <>
    //         <RegisterLayout>
    //           <ResetPassword />
    //         </RegisterLayout>
    //       </>
    //     )
    //   }
    // ]
  ]
  return authRoutes
}

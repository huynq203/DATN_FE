import { paths } from 'src/constants'
import MainLayout from 'src/layouts/MainLayout'
import Home from 'src/pages/Home'
import { ProtectedRoute } from 'src/pages/Login/isAuthenticated'
import Profile from 'src/pages/Profile'

export default function MainRoutes() {
  const mainRoutes = [
    {
      path: paths.Screens.HOME,
      index: true,
      element: (
        <>
          <MainLayout>
            <Home />
          </MainLayout>
        </>
      )
    },
    {
      path: paths.Screens.HOME,
      index: true,
      element: (
        <>
          <MainLayout>
            <Home />
          </MainLayout>
        </>
      )
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: paths.Screens.PROFILE,
          element: (
            <>
              <MainLayout>
                <Profile />
              </MainLayout>
            </>
          )
        }
      ]
    }
  ]
  return mainRoutes
}

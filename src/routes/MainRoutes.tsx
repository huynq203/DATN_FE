import { Constants } from 'src/constants'
import MainLayout from 'src/layouts/MainLayout'
import Home from 'src/pages/Home'
import { ProtectedRoute } from 'src/pages/Login/isAuthenticated'
import Profile from 'src/pages/Profile'

export default function MainRoutes() {
  const mainRoutes = [
    {
      path: Constants.Screens.HOME,
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
          path: Constants.Screens.PROFILE,
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

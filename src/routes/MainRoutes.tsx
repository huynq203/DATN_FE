import { Suspense } from 'react'
import { paths } from 'src/constants'
import MainLayout from 'src/layouts/MainLayout'
import Blog from 'src/pages/Blog'
import Home from 'src/pages/Home'
import { ProtectedRoute } from 'src/pages/Login/isAuthenticated'
import ProductDetail from 'src/pages/ProductDetail'
import ProductList from 'src/pages/ProductList'
import Profile from 'src/pages/Profile'

export default function MainRoutes() {
  const mainRoutes = [
    {
      path: paths.Screens.HOME,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <Home />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: paths.Screens.PRODUCT,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: paths.Screens.PRODUCT_DETAIL,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: paths.Screens.BLOG,
      element: (
        <MainLayout>
          <Suspense>
            <Blog />
          </Suspense>
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: paths.Screens.PROFILE,
          element: (
            <MainLayout>
              <Suspense>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    }
  ]
  return mainRoutes
}

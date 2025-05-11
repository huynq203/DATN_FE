import { Suspense } from 'react'
import { paths } from 'src/constants'
import MainLayout from 'src/layouts/MainLayout'
import Blog from 'src/pages/Blog'
import Cart from 'src/pages/Cart'
import ChangePassword from 'src/pages/ChangePassword'
import Checkout from 'src/pages/Checkout'
import Contact from 'src/pages/Contact'
import Home from 'src/pages/Home'
import Introduce from 'src/pages/Introduce'
import { ProtectedRoute } from 'src/pages/Login/isAuthenticated'
import MyOrder from 'src/pages/MyOrder'
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
      path: paths.Screens.INTRODUCE,
      element: (
        <MainLayout>
          <Suspense>
            <Introduce />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: paths.Screens.CONTACT,
      element: (
        <MainLayout>
          <Suspense>
            <Contact />
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
        },
        {
          path: paths.Screens.MY_ORDER,
          element: (
            <MainLayout>
              <Suspense>
                <MyOrder />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: paths.Screens.CHANGE_PASSWORD,
          element: (
            <MainLayout>
              <Suspense>
                <ChangePassword />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: paths.Screens.CART,
          element: (
            <MainLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: paths.Screens.CHECKOUT,
          element: (
            <MainLayout>
              <Suspense>
                <Checkout />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    }
  ]
  return mainRoutes
}

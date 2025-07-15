import { Suspense } from 'react'
import { paths } from 'src/constants'
import MainLayout from 'src/layouts/MainLayout'

import Cart from 'src/pages/Cart'

import Checkout from 'src/pages/Checkout'
import Contact from 'src/pages/Menu/Contact'
import Home from 'src/pages/Menu/Home'
import Introduce from 'src/pages/Menu/Introduce'
import { ProtectedRoute } from 'src/pages/Login/isAuthenticated'
import NotifyOrder from 'src/pages/NotifyOrder'
import ProductDetail from 'src/pages/ProductDetail'
import ProductList from 'src/pages/ProductList'
import Profile from 'src/pages/Profile/pages/Profile'
import HistoryOrder from 'src/pages/Profile/pages/HistoryOrder'

import CustomerLayout from 'src/pages/Profile/layouts/CustomerLayout'

import Address from 'src/pages/Profile/pages/Address'
import WishList from 'src/pages/Profile/pages/WishList'

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
        },
        {
          path: paths.Screens.CHECK_ORDER,
          element: (
            <MainLayout>
              <Suspense>
                <NotifyOrder />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: paths.Screens.CUSTOMER,
          element: (
            <MainLayout>
              <CustomerLayout />
            </MainLayout>
          ),
          children: [
            {
              path: paths.Screens.PROFILE,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: paths.Screens.ADDRESS,
              element: (
                <Suspense>
                  <Address />
                </Suspense>
              )
            },
            {
              path: paths.Screens.HISTORY_ORDER,
              element: (
                <Suspense>
                  <HistoryOrder />
                </Suspense>
              )
            },
            {
              path: paths.Screens.WISH_LIST,
              element: (
                <Suspense>
                  <WishList />
                </Suspense>
              )
            }
          ]
        }
      ]
    }
  ]
  return mainRoutes
}

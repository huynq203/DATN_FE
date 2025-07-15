import { paths } from 'src/constants'
import MainLayout from 'src/layouts/admin/MainLayout'

import Dashboard from 'src/pages/admin/Dashboard'
import Login from 'src/pages/admin/Login'
import { ProtectedRouteAdmin, RejectedRouteAdmin } from 'src/pages/admin/Login/isAuthenticated'
import CustomerDetail from 'src/pages/admin/ManagerAccount/ManagerCustomer/CustomerDetail'
import ListCustomer from 'src/pages/admin/ManagerAccount/ManagerCustomer/ListCustomers'
import ListUsers from 'src/pages/admin/ManagerAccount/ManagerUser/ListUsers'
import ListCategories from 'src/pages/admin/ManagerCategory/ListCategories'
import ManagerImageSlider from 'src/pages/admin/ManagerImageSlider'
import ManagerOrder from 'src/pages/admin/ManagerOrder'
import CreateProduct from 'src/pages/admin/ManagerProduct/CreateProduct'
import ListProducts from 'src/pages/admin/ManagerProduct/ListProducts'
import UpdateProduct from 'src/pages/admin/ManagerProduct/UpdateProduct/UpdateProduct'
import ManagerRole from 'src/pages/admin/ManagerRole'

import ManagerScheduleProduct from 'src/pages/admin/ManagerScheduleProduct'
import ManagerVouchers from 'src/pages/admin/ManagerVouchers'

export default function AdminRoutes() {
  const adminRoutes = [
    {
      path: '',
      element: <RejectedRouteAdmin />,
      children: [
        {
          path: paths.Screens.ADMIN_LOGIN,
          element: <Login />
        }
      ]
    },

    {
      path: '',
      element: <ProtectedRouteAdmin />,
      children: [
        {
          path: paths.Screens.ADMIN_DASHBOARD,
          element: (
            <>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_CUSTOMER,
          element: (
            <>
              <MainLayout>
                <ListCustomer />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_CUSTOMER_DETAIL,
          element: (
            <>
              <MainLayout>
                <CustomerDetail />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_USER,
          element: (
            <>
              <MainLayout>
                <ListUsers />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_ORDER,
          element: (
            <>
              <MainLayout>
                <ManagerOrder />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_ROLE,
          element: (
            <>
              <MainLayout>
                <ManagerRole />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_PRODUCT,
          element: (
            <>
              <MainLayout>
                <ListProducts />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_CREATE_PRODUCT,
          element: (
            <>
              <MainLayout>
                <CreateProduct />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_UPDATE_PRODUCT,
          element: (
            <>
              <MainLayout>
                <UpdateProduct />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_CATEGORY,
          element: (
            <>
              <MainLayout>
                <ListCategories />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_VOUCHER,
          element: (
            <>
              <MainLayout>
                <ManagerVouchers />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_SCHEDULE_PRODUCT,
          element: (
            <>
              <MainLayout>
                <ManagerScheduleProduct />
              </MainLayout>
            </>
          )
        },
        {
          path: paths.Screens.ADMIN_MANAGER_IMAGE_SLIDER,
          element: (
            <>
              <MainLayout>
                <ManagerImageSlider />
              </MainLayout>
            </>
          )
        }
      ]
    }
  ]
  return adminRoutes
}

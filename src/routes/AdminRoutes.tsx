import { paths } from 'src/constants'
import MainLayout from 'src/layouts/admin/MainLayout'
import ChangePassword from 'src/pages/admin/ChangePassword'
import Dashboard from 'src/pages/admin/Dashboard'

export default function AdminRoutes() {
  const adminRoutes = [
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
      path: paths.Screens.ADMIN_CHANGE_PASSWORD,
      element: (
        <>
          <MainLayout>
            <ChangePassword />
          </MainLayout>
        </>
      )
    }
  ]
  return adminRoutes
}

import { Screens } from 'src/constants'

export default function AdminRoutes() {
  const adminRoutes = [
    {
      path: Screens.ADMIN_DASHBOARD,
      element: (
        <>
          <div>Hello</div>
        </>
      )
    }
  ]
  return adminRoutes
}

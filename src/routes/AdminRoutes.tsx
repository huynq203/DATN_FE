import { Constants } from 'src/constants'

export default function AdminRoutes() {
  const adminRoutes = [
    {
      path: Constants.Screens.ADMIN_DASHBOARD,
      element: (
        <>
          <div>Hello</div>
        </>
      )
    }
  ]
  return adminRoutes
}

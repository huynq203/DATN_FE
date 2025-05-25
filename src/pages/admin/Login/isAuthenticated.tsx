import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { paths } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'
import { clearLS } from 'src/utils/auth'

// nếu đã đăng nhập thì vào trang home còn không thì vào trang login
export function ProtectedRouteAdmin() {
  const { isAuthenticated, profile, role } = useContext(AppContext)

  if (role === 'customer') {
    clearLS()
    return <Navigate to={paths.Screens.ADMIN_LOGIN} />
  }
  return isAuthenticated ? <Outlet /> : <Navigate to={paths.Screens.ADMIN_LOGIN} />
}

//nếu chưa đăng nhập thì vào trang đăng nhập còn đăng nhập ròi thì vào trang home
export function RejectedRouteAdmin() {
  const { isAuthenticated } = useContext(AppContext)
  // Replace with your authentication logic
  return !isAuthenticated ? <Outlet /> : <Navigate to={paths.Screens.ADMIN_DASHBOARD} />
}

// export function RejectNotAdmin() {
//   const { isAuthenticated, role } = useContext(AppContext)
//   return isAuthenticated && role === 'customer' ? <Outlet /> : <Navigate to={paths.Screens.ADMIN_LOGIN} />
// }

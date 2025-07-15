import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { paths } from 'src/constants'
import { AppContext } from 'src/contexts/app.context'

// nếu đã đăng nhập thì vào trang home còn không thì vào trang login
export function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return isAuthenticated ? <Outlet /> : <Navigate to={paths.Screens.AUTH_LOGIN} />
}

//nếu chưa đăng nhập thì vào trang đăng nhập còn đăng nhập ròi thì vào trang home
export function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // Replace with your authentication logic
  return !isAuthenticated ? <Outlet /> : <Navigate to={paths.Screens.HOME} />
}

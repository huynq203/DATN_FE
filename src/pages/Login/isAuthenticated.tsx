import { Navigate, Outlet } from 'react-router-dom'
import { Constants } from 'src/constants'
const isAuthenticated = false
// nếu đã đăng nhập thì vào trang home còn không thì vào trang login
export function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to={Constants.Screens.AUTH_LOGIN} />
}

//nếu chưa đăng nhập thì vào trang đăng nhập còn đăng nhập ròi thì vào trang home
export function RejectedRoute() {
  // Replace with your authentication logic
  return !isAuthenticated ? <Outlet /> : <Navigate to={Constants.Screens.HOME} />
}

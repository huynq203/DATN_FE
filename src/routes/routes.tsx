import { useRoutes } from 'react-router-dom'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
import AdminRoutes from './AdminRoutes'

export default function Routes() {
  const authRoutes = AuthRoutes()
  const mainRoutes = MainRoutes()
  const adminRoutes = AdminRoutes()
  const routes = useRoutes([...authRoutes, ...mainRoutes, ...adminRoutes])
  return routes
}

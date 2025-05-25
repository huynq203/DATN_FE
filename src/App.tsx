import { HelmetProvider } from 'react-helmet-async'
import Routes from './routes/routes'
import { ToastContainer } from 'react-toastify'
import { useContext, useEffect } from 'react'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
function App() {
  // const authRoutes = AuthRoutes() // Gọi là customer hook
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <>
      <HelmetProvider>
        <Routes />
        <ToastContainer />
      </HelmetProvider>
    </>
  )
}

export default App

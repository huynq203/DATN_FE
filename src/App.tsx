import { HelmetProvider } from 'react-helmet-async'
import Routes from './routes/routes'
import { ToastContainer } from 'react-toastify'
function App() {
  // const authRoutes = AuthRoutes() // Gọi là customer hook
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

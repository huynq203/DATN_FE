import React, { useEffect } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import Loading from 'src/pages/Loading'

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  const [isLoading, setIsLoading] = React.useState(true)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])
  return (
    <div className={`${isLoading ? 'filter brightness-50 pointer-events-none' : ''}`}>
      <Header />
      <Loading loading={isLoading} color='black' top='30%' />
      <div className='pt-[142px]'>{children}</div>
      <Footer />
    </div>
  )
}

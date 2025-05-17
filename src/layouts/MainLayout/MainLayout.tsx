import React, { useEffect } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import Loading from 'src/pages/Loading'

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <div className='pt-[142px]'>{children}</div>
      <Footer />
    </>
  )
}

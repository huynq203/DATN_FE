import  { ReactNode } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children?: ReactNode
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

import { ReactNode } from 'react'
import Footer from 'src/components/Footer'

import RegisterHeader from 'src/components/RegisterHeader'
interface Props {
  children?: ReactNode
}
export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}

import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'

import RecommendedSection from 'src/components/Home/RecommendedSection'
import { AppContext } from 'src/contexts/app.context'
import Men from 'src/components/Home/Men'
import Kid from 'src/components/Home/Kid'
import BestSaler from 'src/components/Home/BestSaler'
import CarouselDefault from 'src/components/Home/CarouselDefault'

export default function Home() {
  const { isAuthenticated, profile } = useContext(AppContext)
  if (isAuthenticated && !profile) {
    window.location.reload()
  }

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ | Yoyo Store' />
        <link rel='canonical' href={paths.Screens.HOME} />
      </Helmet>

      <div className='container'>
        {/* <SideBar /> */}
        <CarouselDefault />
        <BestSaler />
        <Men />
        <Kid />
        <RecommendedSection />
      </div>
    </>
  )
}

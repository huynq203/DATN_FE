import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { paths, resources } from 'src/constants'
import Loading from '../../Loading'
import { Link } from 'react-router-dom'
import SideBar from 'src/components/Home/SideBar'
import SeasonShopSection from 'src/components/Home/SeasonShopSection'
import DiscoverFootwearSection from 'src/components/Home/DiscoverFootwearSection/DiscoverFootwearSection'
import RecommendedSection from 'src/components/Home/RecommendedSection'

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ | Yoyo Store' />
        <link rel='canonical' href={paths.Screens.HOME} />
      </Helmet>

      <div className='container'>
        <SideBar />
        <SeasonShopSection />
        <DiscoverFootwearSection />
        <RecommendedSection />
      </div>
    </>
  )
}

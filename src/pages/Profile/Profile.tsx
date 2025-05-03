import React from 'react'
import { Helmet } from 'react-helmet-async'
import { paths } from 'src/constants'

export default function Profile() {
  const getProfile = localStorage.getItem('profile')
  const profile = getProfile ? JSON.parse(getProfile) : null
  return (
    <>
      <Helmet>
        <title>Profile - YOYO Store</title>
        <meta name='description' content='Profile - Yoyo' />
        <link rel='canonical' href={paths.Screens.PROFILE} />
      </Helmet>
    </>
  )
}

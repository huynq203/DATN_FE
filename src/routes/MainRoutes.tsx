import React from 'react'

import { Screens } from 'src/constants'
import Header from 'src/components/Header'
import Footer from 'src/components/Footer'
import Home from 'src/pages/Home'
import MainLayout from 'src/layouts/MainLayout'

export default function MainRoutes() {
  const mainRoutes = [
    {
      path: Screens.HOME,
      element: (
        <>
          <MainLayout>
            <Home />
          </MainLayout>
        </>
      )
    }
  ]
  return mainRoutes
}

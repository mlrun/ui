import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'

import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
import Notification from '../../common/Notification/Notification'

import localStorageService from '../../utils/localStorageService'
import { useDemoMode } from '../../hooks/demoMode.hook'

import './PageView.scss'

export default function PageView({ children }) {
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic')
  )

  const match = useRouteMatch('/projects/:projectName')
  const isDemoMode = useDemoMode()

  const mainClasses = classNames(isPinned && match && isDemoMode && 'pinned')

  const headerShown =
    window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'

  return (
    <div className="App">
      {headerShown && <Header />}
      <div className="page-view__container">
        {isDemoMode && match && (
          <Navbar match={match} isPinned={isPinned} setIsPinned={setIsPinned} />
        )}
        <main id="main" className={mainClasses}>
          {children}
        </main>
      </div>
      <Notification />
    </div>
  )
}

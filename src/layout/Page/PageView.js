import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'

import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
import Notification from '../../common/Notification/Notification'

import localStorageService from '../../utils/localStorageService'

import './PageView.scss'

export default function PageView({ children }) {
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  )

  const match = useRouteMatch('/projects/:projectName')

  const headerShown =
    window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'

  const pinnedClasses = classNames(
    isPinned && match ? 'pinned' : 'unpinned',
    headerShown && 'has-header'
  )

  return (
    <div className="app">
      {headerShown && <Header />}
      {match && (
        <Navbar
          match={match}
          isPinned={isPinned}
          headerShown={headerShown}
          setIsPinned={setIsPinned}
        />
      )}
      <main id="main" className={pinnedClasses}>
        {children}
      </main>

      <Notification />
    </div>
  )
}

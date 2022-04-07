import React, { useState } from 'react'
import classNames from 'classnames'
import { useParams, Outlet } from 'react-router-dom'

import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
import Notification from '../../common/Notification/Notification'

import localStorageService from '../../utils/localStorageService'

import './PageView.scss'

export default function PageView() {
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  )
  const params = useParams()
  const projectName = params.projectName
  const headerShown = window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'

  const pinnedClasses = classNames(
    isPinned && projectName ? 'pinned' : 'unpinned',
    headerShown && 'has-header'
  )

  return (
    <div className="app">
      {headerShown && <Header />}
      {projectName && (
        <Navbar
          isPinned={isPinned}
          headerShown={headerShown}
          projectName={projectName}
          setIsPinned={setIsPinned}
        />
      )}
      <main id="main" className={pinnedClasses}>
        <Outlet />
      </main>
      <Notification />
    </div>
  )
}

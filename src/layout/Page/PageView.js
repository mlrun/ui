import React, { useEffect, useRef, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'

import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
import Notification from '../../common/Notification/Notification'

import localStorageService from '../../utils/localStorageService'
import { getTransitionEndEventName } from '../../utils/getTransitionEndEventName'

import './PageView.scss'

export default function PageView({ children }) {
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  )
  const mainRef = useRef()
  const transitionEndEventName = getTransitionEndEventName()

  const projectName = useRouteMatch('/projects/:projectName')?.params
    .projectName

  const headerShown =
    window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'

  const pinnedClasses = classNames(
    isPinned && projectName ? 'pinned' : 'unpinned',
    headerShown && 'has-header'
  )

  useEffect(() => {
    if (mainRef) {
      mainRef.current.addEventListener(transitionEndEventName, () => {
        window.dispatchEvent(new CustomEvent('mainResize'))
      })
    }
  }, [isPinned, transitionEndEventName])

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
      <main id="main" className={pinnedClasses} ref={mainRef}>
        <div id="main-wrapper">{children}</div>
      </main>

      <Notification />
    </div>
  )
}

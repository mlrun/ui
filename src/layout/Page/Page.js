import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, Outlet } from 'react-router-dom'
import classNames from 'classnames'

import Notification from '../../common/Notification/Notification'

import { getTransitionEndEventName } from '../../utils/getTransitionEndEventName'

import { fetchFrontendSpec } from '../../reducers/appReducer'

import './Page.scss'

const Page = ({ isHeaderShown, isNavbarPinned }) => {
  const params = useParams()
  const mainRef = useRef()
  const dispatch = useDispatch()

  const projectName = params.projectName
  const transitionEndEventName = getTransitionEndEventName()

  const pinnedClasses = classNames(
    isNavbarPinned && projectName ? 'pinned' : 'unpinned',
    isHeaderShown && 'has-header'
  )

  useEffect(() => {
    if (mainRef) {
      mainRef.current.addEventListener(transitionEndEventName, event => {
        if (event.target !== mainRef.current) return
        window.dispatchEvent(new CustomEvent('mainResize'))
      })
    }
  }, [isNavbarPinned, transitionEndEventName])

  useEffect(() => {
    dispatch(fetchFrontendSpec())

    const interval = setInterval(() => dispatch(fetchFrontendSpec()), 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <>
      <main id="main" className={pinnedClasses} ref={mainRef}>
        <div id="main-wrapper">
          <Outlet />
        </div>
      </main>
      <Notification />
    </>
  )
}

export default Page

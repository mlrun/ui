/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, Outlet } from 'react-router-dom'
import classNames from 'classnames'

import Notification from '../../common/Notification/Notification'

import { getTransitionEndEventName } from '../../utils/getTransitionEndEventName'

import { fetchFrontendSpec } from '../../reducers/appReducer'

import { NAVBAR_WIDTH } from '../../constants'

import './Page.scss'

const Page = ({ isHeaderShown, isNavbarPinned, setProjectName }) => {
  const params = useParams()
  const mainRef = useRef()
  const dispatch = useDispatch()

  const projectName = params.projectName

  const transitionEndEventName = getTransitionEndEventName()

  const pinnedClasses = classNames(
    !(isNavbarPinned && projectName) && 'unpinned',
    isHeaderShown && 'has-header'
  )

  const pinnedStyles = isNavbarPinned && projectName ? {marginLeft: `${NAVBAR_WIDTH}px`} : {}

  useEffect(() => {
    setProjectName(projectName)
  }, [projectName, setProjectName])

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
      <main id="main" className={pinnedClasses} ref={mainRef} style={pinnedStyles}>
        <div id="main-wrapper">
          <Outlet />
        </div>
      </main>
      <Notification />
    </>
  )
}

export default Page

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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Outlet, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import { createPortal } from 'react-dom'
import ModalContainer from 'react-modal-promise'

import Notification from '../../common/Notification/Notification'
import DownloadContainer from '../../common/Download/DownloadContainer'
import Navbar from '../Navbar/Navbar'

import { getTransitionEndEventName } from 'igz-controls/utils/common.util'
import { fetchFrontendSpec } from '../../reducers/appReducer'
import { NAVBAR_WIDTH_CLOSED, NAVBAR_WIDTH_OPENED } from '../../constants'
import { isProjectValid } from '../../utils/handleRedirect'

import './Page.scss'

const Page = () => {
  const [isNavbarPinned, setIsNavbarPinned] = useState(false)
  const { projectName } = useParams()
  const mainRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const transitionEndEventName = useMemo(() => getTransitionEndEventName(), [])
  const pinnedClasses = classNames(!(isNavbarPinned && projectName) && 'unpinned')
  const mainStyles = {
    marginLeft: !projectName
      ? 0
      : isNavbarPinned
      ? `${NAVBAR_WIDTH_OPENED}px`
      : `${NAVBAR_WIDTH_CLOSED}px`
  }
  const { frontendSpec, frontendSpecPopupIsOpened } = useSelector(store => store.appStore)
  const { projectsNames } = useSelector(store => store.projectStore)

  useEffect(() => {
    isProjectValid(navigate, projectsNames.data, projectName)
  }, [navigate, projectName, projectsNames.data])

  useEffect(() => {
    if (mainRef) {
      mainRef.current.addEventListener(transitionEndEventName, event => {
        if (event.target !== mainRef.current) return
        window.dispatchEvent(new CustomEvent('mainResize'))
      })
    }
  }, [isNavbarPinned, transitionEndEventName])

  useEffect(() => {
    if (isEmpty(frontendSpec)) {
      dispatch(fetchFrontendSpec({ frontendSpec, frontendSpecPopupIsOpened }))
    }
  }, [dispatch, frontendSpec, frontendSpecPopupIsOpened])

  useEffect(() => {
    const interval = setInterval(
      () => dispatch(fetchFrontendSpec({ frontendSpec, frontendSpecPopupIsOpened })),
      60000
    )

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, frontendSpec, frontendSpecPopupIsOpened])

  return (
    <>
      {projectName && <Navbar projectName={projectName} setIsNavbarPinned={setIsNavbarPinned} />}
      <main id="main" className={pinnedClasses} ref={mainRef} style={mainStyles}>
        <div id="main-wrapper">
          <Outlet />
        </div>
      </main>
      <Notification />
      <DownloadContainer />
      {createPortal(<ModalContainer />, document.getElementById('overlay_container'))}
    </>
  )
}

export default Page

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
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router'
import { isEmpty } from 'lodash-es'
import { createPortal } from 'react-dom'
import ModalContainer from 'react-modal-promise'

import Sidebar from '../../nextGenComponents/shared/Sidebar'
import { SidebarInset, SidebarProvider } from 'igz-controls/nextGenComponents'
import YamlModal from '../../common/YamlModal/YamlModal'
import { Loader } from 'igz-controls/components'

import { getTransitionEndEventName } from 'igz-controls/utils/common.util'
import { fetchFrontendSpec, toggleYaml } from '../../reducers/appReducer'
import { isProjectValid } from '../../utils/link-helper.util'
import { generateProjectsList } from '../../utils/projects'
import { fetchProjects } from '../../reducers/projectReducer'

import './Page.scss'

const Page = () => {
  const [isProjectsFetched, setProjectFetched] = useState(false)
  const { projectName } = useParams()
  const mainRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const transitionEndEventName = useMemo(() => getTransitionEndEventName(), [])
  const { frontendSpec, frontendSpecPopupIsOpened, convertedYaml } = useSelector(
    store => store.appStore
  )
  const { projectsNames } = useSelector(store => store.projectStore)

  const projectsList = useMemo(() => {
    return generateProjectsList(projectsNames.data)
  }, [projectsNames.data])

  const shouldFetchProjects = projectsList.length === 0 && location.pathname !== '/projects'

  useEffect(() => {
    if (shouldFetchProjects) {
      dispatch(fetchProjects({ params: { format: 'minimal' }, showNotification: false }))
        .unwrap()
        .then(projects => {
          isProjectValid(navigate, projects, projectName, dispatch)
          setProjectFetched(true)
        })
        .catch(() => {
          setProjectFetched(true)
          navigate('/projects')
        })
    }
  }, [dispatch, navigate, projectName, shouldFetchProjects])

  if (!isProjectsFetched && !shouldFetchProjects) {
    setProjectFetched(true)
  }

  useEffect(() => {
    const node = mainRef?.current

    if (!node) return

    const handleTransitionEnd = event => {
      if (event.target !== node) return
      window.dispatchEvent(new CustomEvent('mainResize'))
    }

    node.addEventListener(transitionEndEventName, handleTransitionEnd)

    return () => node.removeEventListener(transitionEndEventName, handleTransitionEnd)
  }, [transitionEndEventName])

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
    <SidebarProvider defaultOpen={false}>
      {projectName && <Sidebar projectName={projectName} />}
      <SidebarInset>
        <>
          <Suspense fallback={<Loader />}>
            <main id="main" ref={mainRef}>
              <div id="main-wrapper">{isProjectsFetched ? <Outlet /> : <Loader />}</div>
            </main>
          </Suspense>
          {createPortal(<ModalContainer />, document.getElementById('overlay_container'))}
          {convertedYaml.length > 0 && (
            <YamlModal
              convertedYaml={convertedYaml}
              toggleConvertToYaml={() => dispatch(toggleYaml())}
            />
          )}
        </>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page

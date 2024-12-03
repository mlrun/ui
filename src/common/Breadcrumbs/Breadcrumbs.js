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
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import BreadcrumbsStep from './BreadcrumbsStep/BreadcrumbsStep'

import { useMode } from '../../hooks/mode.hook'
import { generateMlrunScreens, generateTabsList } from './breadcrumbs.util'
import { PROJECTS_PAGE_PATH } from '../../constants'
import projectsAction from '../../actions/projects'
import { generateProjectsList } from '../../utils/projects'

import './breadcrumbs.scss'

const Breadcrumbs = ({ onClick = () => {} }) => {
  const [searchValue, setSearchValue] = useState('')
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const { isDemoMode } = useMode()
  const breadcrumbsRef = useRef()
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()

  const projectStore = useSelector(state => state.projectStore)

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const mlrunScreens = useMemo(() => {
    return generateMlrunScreens(params, isDemoMode)
  }, [isDemoMode, params])
  const projectTabs = useMemo(() => {
    return generateTabsList()
  }, [])

  const urlParts = useMemo(() => {
    if (params.projectName) {
      const [projects, projectName, screenName] = location.pathname.split('/').slice(1, 4)
      const screen = mlrunScreens.find(screen => screen.id === screenName)
      const tab = projectTabs.find(tab =>
        location.pathname
          .split('/')
          .slice(3)
          .find(pathItem => pathItem === tab.id)
      )

      return {
        pathItems: [projects, projectName, screen?.label || screenName],
        screen,
        tab
      }
    } else {
      const [page] = location.pathname.split('/').slice(3, 4)
      const screen = mlrunScreens.find(screen => screen.id === page)

      return {
        pathItems: [PROJECTS_PAGE_PATH, screen?.label || page],
        screen
      }
    }
  }, [location.pathname, params.projectName, mlrunScreens, projectTabs])

  useEffect(() => {
    if (
      projectsList.length === 0 &&
      location.pathname !== '/projects' &&
      !location.pathname.startsWith('/projects/*')
    ) {
      dispatch(projectsAction.fetchProjects({ format: 'minimal' }))
    }
  }, [dispatch, location.pathname, projectsList.length])

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {urlParts.pathItems.map((urlPart, index) => {
          return (
            <BreadcrumbsStep
              key={index}
              index={index}
              mlrunScreens={mlrunScreens}
              onClick={onClick}
              params={params}
              projectsList={projectsList}
              ref={breadcrumbsRef}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setShowProjectsList={setShowProjectsList}
              setShowScreensList={setShowScreensList}
              showProjectsList={showProjectsList}
              showScreensList={showScreensList}
              urlPart={urlPart}
              urlParts={urlParts}
            />
          )
        })}
      </ul>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  onClick: PropTypes.func
}

export default Breadcrumbs

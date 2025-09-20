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
import React, { useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { startCase } from 'lodash'

import BreadcrumbsStep from './BreadcrumbsStep/BreadcrumbsStep'

import { generateMlrunScreens, generateTabsList } from './breadcrumbs.util'
import { MONITORING_APP_PAGE, PROJECTS_PAGE_PATH } from '../../constants'
import { generateProjectsList } from '../../utils/projects'
import { useMode } from '../../hooks/mode.hook'

import './breadcrumbs.scss'

const Breadcrumbs = ({ onClick = () => { } }) => {
  const [searchValue, setSearchValue] = useState('')
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const breadcrumbsRef = useRef()
  const params = useParams()
  const location = useLocation()
  const { isDemoMode } = useMode()

  const projectStore = useSelector(state => state.projectStore)

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const mlrunScreens = useMemo(() => {
    return generateMlrunScreens(params?.projectName ?? '', isDemoMode).filter(screen => !screen.hidden)
  }, [isDemoMode, params?.projectName])
  const projectTabs = useMemo(() => {
    return generateTabsList()
  }, [])
  const urlParts = useMemo(() => {
    if (params.projectName) {
      const [projects, projectName, screenName, innerScreenName] = location.pathname.split('/').slice(1, 5)
      const screen = mlrunScreens.find(screen => screen.id === (innerScreenName)) ?? mlrunScreens.find(screen => screen.id === (screenName))
      let tab = projectTabs.find(tab =>
        location.pathname
          .split('/')
          .slice(3)
          .find(pathItem => pathItem === tab.id)
      )

      if (screen?.id === MONITORING_APP_PAGE) {
        tab = {}
      }

      return {
        pathItems: [projects, projectName, screen?.label],
        screen,
        tab: { ...tab, label: startCase(tab?.label?.replace('-', ' ')) || '' },
        itemName: params.artifactName || params.funcName || params.jobName || params.workflowProjectName || params.appName || params.name || null,
      }
    } else {
      const [page] = location.pathname.split('/').slice(3, 4)
      const screen = mlrunScreens.find(screen => screen.id === page)

      return {
        pathItems: [PROJECTS_PAGE_PATH, screen?.label || page],
        screen,
        itemName: params.artifactName || params.name || params.jobName || params.workflowProjectName || null,
      }
    }
  }, [location.pathname, params, mlrunScreens, projectTabs])

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
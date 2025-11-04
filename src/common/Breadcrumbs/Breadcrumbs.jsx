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
import { capitalize } from 'lodash'

import BreadcrumbsStep from './BreadcrumbsStep/BreadcrumbsStep'

import { generateMlrunScreens } from './breadcrumbs.util'
import { PROJECTS_PAGE_PATH } from '../../constants'
import { generateProjectsList } from '../../utils/projects'
import { useMode } from '../../hooks/mode.hook'

import { BREADCRUMBS_STEP_ITEM_TYPE, BREADCRUMBS_STEP_PROJECT_TYPE, BREADCRUMBS_STEP_SCREEN_TYPE } from '../../constants'

import './breadcrumbs.scss'

const Breadcrumbs = ({ itemName = '', onClick = () => { } }) => {
  const [searchValue, setSearchValue] = useState('')
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const breadcrumbsRef = useRef()
  const params = useParams()
  const location = useLocation()
  const { isDemoMode } = useMode()

  const projectStore = useSelector(state => state.projectStore)

  const projectsList = useMemo(() => {
    const projectsList = generateProjectsList(projectStore.projectsNames.data, params.projectName,)
    return projectsList.map(project => ({
      ...project,
      link: location.pathname.replace(params.projectName, project.id)
    }))
  }, [projectStore.projectsNames.data, location.pathname, params.projectName])

  const mlrunScreens = useMemo(() => {
    return generateMlrunScreens(params?.projectName ?? '', isDemoMode).filter(screen => !screen.hidden)
  }, [isDemoMode, params?.projectName])


  const urlParts = useMemo(() => {
    const [projects, projectName, page, innerScreenName] = location.pathname.split('/').slice(1, 5)
    const screen = mlrunScreens.find(screen => screen.id === (page)) || mlrunScreens.find(screen => screen.id === (innerScreenName))

    const pathItems = [
      { id: projects, label: capitalize(projects), link: `/${PROJECTS_PAGE_PATH}` },
      { id: projectName, label: projectName, link: `/projects/${projectName}`, type: BREADCRUMBS_STEP_PROJECT_TYPE },
      { id: screen?.id, label: screen?.label, link: screen?.link, type: BREADCRUMBS_STEP_SCREEN_TYPE }
    ]

    itemName && pathItems.push({ id: itemName, label: itemName, type: BREADCRUMBS_STEP_ITEM_TYPE })


    if (params.projectName) {
      return {
        pathItems,
        screen,
      }
    } else {
      return {
        pathItems: pathItems.filter(item => item.type !== BREADCRUMBS_STEP_PROJECT_TYPE),
        screen,
      }
    }


  }, [itemName, location.pathname, params, mlrunScreens])

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {urlParts.pathItems.map((urlPart, index) => {
          return (
            <BreadcrumbsStep
              key={index}
              index={index}
              itemName={itemName}
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
              pathItem={urlPart}
              urlParts={urlParts}
            />
          )
        })}
      </ul>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  itemName: PropTypes.string,
  onClick: PropTypes.func
}

export default Breadcrumbs
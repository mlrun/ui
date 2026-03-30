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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import BreadcrumbsStep from './BreadcrumbsStep/BreadcrumbsStep'

import { generateMlrunScreens, generateTabsList } from './breadcrumbs.util'
import { MONITORING_APP_PAGE, PROJECTS_PAGE_PATH } from '../../constants'
import { generateProjectsList } from '../../utils/projects'
import { fetchNuclioFunctions } from '../../reducers/nuclioReducer'

import './breadcrumbs.scss'

const Breadcrumbs = ({ onClick = () => {} }) => {
  const [dropdownState, setDropdownState] = useState({ active: null, search: '' })
  const breadcrumbsRef = useRef()
  const currentFunctionsProjectRef = useRef('')
  const params = useParams()
  const location = useLocation()
  const dispatch = useDispatch()

  const projectStore = useSelector(state => state.projectStore)
  const nuclioStore = useSelector(state => state.nuclioStore)

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const currentProjectFunctions = nuclioStore.currentProjectFunctions || []
  const nuclioFunctionsLoading = nuclioStore.loading

  const loadProjectFunctions = useCallback(() => {
    if (!params.projectName || nuclioFunctionsLoading) {
      return
    }

    if (
      currentFunctionsProjectRef.current !== params.projectName ||
      !currentProjectFunctions.length
    ) {
      dispatch(fetchNuclioFunctions({ project: params.projectName }))
      currentFunctionsProjectRef.current = params.projectName
    }
  }, [currentProjectFunctions.length, dispatch, nuclioFunctionsLoading, params.projectName])

  const mlrunScreens = useMemo(() => {
    return generateMlrunScreens(params)
  }, [params])

  const projectTabs = useMemo(() => {
    return generateTabsList()
  }, [])

  const urlParts = useMemo(() => {
    if (params.projectName) {
      const pathParts = location.pathname.split('/').slice(1)
      const [projects, projectName, screenName, functionName, ...functionPath] = pathParts

      const screen = mlrunScreens.find(screen => screen.id === screenName)
      let tab = projectTabs.find(tab => pathParts[2] === tab.id)

      if (screen?.id === MONITORING_APP_PAGE) {
        tab = {}
      }

      const pathItems = [projects, projectName, screenName]

      if (screen?.id === 'real-time-functions' && functionName) {
        pathItems.push(functionName)
      }

      return {
        pathItems,
        screen,
        tab,
        functionName,
        functionPath
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

  const handleDropdownClose = useCallback(() => {
    setDropdownState({ active: null, search: '' })
  }, [])

  const handleDropdownToggle = useCallback(dropdown => {
    setDropdownState(prev => ({
      active: prev.active === dropdown ? null : dropdown,
      search: ''
    }))
  }, [])

  const setSearchValue = useCallback(search => {
    setDropdownState(prev => ({ ...prev, search }))
  }, [])

  useEffect(() => {
    if (params.projectName && urlParts.screen?.id === 'real-time-functions') {
      loadProjectFunctions()
    }
  }, [loadProjectFunctions, params.projectName, urlParts.screen?.id])

  useEffect(() => {
    const handleClickOutside = event => {
      if (breadcrumbsRef.current && !breadcrumbsRef.current.contains(event.target)) {
        handleDropdownClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleDropdownClose])

  useEffect(() => {
    handleDropdownClose()
  }, [location.pathname, handleDropdownClose])

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {urlParts.pathItems.map((urlPart, index) => {
          return (
            <BreadcrumbsStep
              key={`${index}-${urlPart}`}
              index={index}
              urlPart={urlPart}
              urlParts={urlParts}
              params={params}
              dropdownState={dropdownState}
              onDropdownToggle={handleDropdownToggle}
              onDropdownClose={handleDropdownClose}
              setSearchValue={setSearchValue}
              options={{
                screens: mlrunScreens,
                projects: projectsList,
                functions: currentProjectFunctions
              }}
              onClick={onClick}
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

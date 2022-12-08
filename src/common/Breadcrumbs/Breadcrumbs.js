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
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams, Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'

import BreadcrumbsDropdown from '../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import { RoundedIcon } from 'igz-controls/components'

import { useMode } from '../../hooks/mode.hook'
import { generateProjectScreens, generateTabsList } from './breadcrumbs.util'
import { generateProjectsList } from '../../utils/projects'
import projectsAction from '../../actions/projects'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/arrow.svg'

import './breadcrums.scss'

const Breadcrumbs = ({ onClick, projectStore, fetchProjectsNames }) => {
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const { isDemoMode } = useMode()
  const breadcrumbsRef = useRef()
  const params = useParams()
  const location = useLocation()

  const projectScreens = useMemo(() => {
    return generateProjectScreens(params, isDemoMode)
  }, [isDemoMode, params])
  const projectTabs = useMemo(() => {
    return generateTabsList()
  }, [])

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const urlItems = useMemo(() => {
    const pathItems = location.pathname.split('/').slice(1, 4)
    const screen = projectScreens.find(screen => pathItems.find(pathItem => pathItem === screen.id))
    const tab = projectTabs.find(tab =>
      location.pathname.split('/').find(pathItem => pathItem === tab.id)
    )

    return {
      pathItems: pathItems.map(pathItem => (pathItem === screen?.id ? screen.label : pathItem)),
      screen,
      tab
    }
  }, [location.pathname, projectScreens, projectTabs])

  const handleCloseDropdown = useCallback(
    event => {
      if (breadcrumbsRef.current && !breadcrumbsRef.current.contains(event.target)) {
        const [activeSeparator] = document.getElementsByClassName('breadcrumbs__separator_active')

        if (activeSeparator) {
          activeSeparator.classList.remove('breadcrumbs__separator_active')
        }

        if (showScreensList) setShowScreensList(false)

        if (showProjectsList) setShowProjectsList(false)
      }
    },
    [breadcrumbsRef, showProjectsList, showScreensList]
  )

  useEffect(() => {
    window.addEventListener('click', handleCloseDropdown)

    return () => {
      window.removeEventListener('click', handleCloseDropdown)
    }
  }, [handleCloseDropdown])

  useEffect(() => {
    if (projectsList.length === 0 && location.pathname !== '/projects') {
      fetchProjectsNames()
    }
  }, [fetchProjectsNames, location.pathname, projectsList.length])

  const handleSeparatorClick = (nextItem, separatorRef) => {
    const nextItemIsScreen = Boolean(projectScreens.find(screen => screen.label === nextItem))

    if (nextItemIsScreen || nextItem === params.projectName) {
      const [activeSeparator] = document.getElementsByClassName('breadcrumbs__separator_active')

      if (
        activeSeparator &&
        !separatorRef.current.classList.contains('breadcrumbs__separator_active')
      ) {
        activeSeparator.classList.remove('breadcrumbs__separator_active')
      }

      if (nextItemIsScreen) {
        setShowScreensList(state => !state)

        if (showProjectsList) {
          setShowProjectsList(false)
        }
      }

      if (nextItem === params.projectName) {
        setShowProjectsList(state => !state)

        if (showScreensList) {
          setShowScreensList(false)
        }
      }

      separatorRef.current.classList.toggle('breadcrumbs__separator_active')
    }
  }

  const handleSelectDropdownItem = separatorRef => {
    if (showProjectsList) setShowProjectsList(false)

    if (showScreensList) setShowScreensList(false)

    separatorRef.current.classList.remove('breadcrumbs__separator_active')
  }

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {urlItems.pathItems.map((item, i) => {
          const param = Object.values(params ?? {}).includes(item)
          const label = param ? item : item.charAt(0).toUpperCase() + item.slice(1)
          const to = `/${urlItems.pathItems.slice(0, i + 1).join('/')}`
          const last = i === urlItems.pathItems.length - 1
          const separatorClassNames = classnames(
            'breadcrumbs__separator',
            ((urlItems.pathItems[i + 1] === urlItems.screen?.id && !param) ||
              urlItems.pathItems[i + 1] === params.projectName) &&
              'breadcrumbs__separator_tumbler'
          )
          const separatorRef = React.createRef()

          if (last) {
            return (
              <li
                data-testid="breadcrumbs-last-item"
                className="breadcrumbs__item"
                key={`${i}${item}`}
              >
                {label}
              </li>
            )
          } else {
            return [
              <li key={`${i}${item}`} className="breadcrumbs__item">
                <Link to={to} onClick={onClick}>
                  {label}
                </Link>
              </li>,
              <li key={i} className="breadcrumbs__item">
                <RoundedIcon
                  className={separatorClassNames}
                  data-testid="separator"
                  ref={separatorRef}
                  onClick={() => handleSeparatorClick(urlItems.pathItems[i + 1], separatorRef)}
                >
                  <ArrowIcon />
                </RoundedIcon>
                {showScreensList && urlItems.pathItems[i + 1] === urlItems.screen?.label && (
                  <BreadcrumbsDropdown
                    link={to}
                    list={projectScreens}
                    onClick={() => handleSelectDropdownItem(separatorRef)}
                    selectedItem={urlItems.screen?.id}
                  />
                )}
                {showProjectsList && urlItems.pathItems[i + 1] === params.projectName && (
                  <>
                    <BreadcrumbsDropdown
                      link={to}
                      list={projectsList}
                      onClick={() => handleSelectDropdownItem(separatorRef)}
                      screen={urlItems.screen?.id}
                      selectedItem={params.projectName}
                      tab={urlItems.tab?.id}
                      withSearch
                    />
                  </>
                )}
              </li>
            ]
          }
        })}
      </ul>
    </nav>
  )
}

Breadcrumbs.defaultProps = {
  onClick: () => {}
}

Breadcrumbs.propTypes = {
  onClick: PropTypes.func
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  { ...projectsAction }
)(Breadcrumbs)

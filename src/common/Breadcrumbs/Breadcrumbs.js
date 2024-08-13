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
import { generateMlrunScreens, generateTabsList } from './breadcrumbs.util'
import { generateProjectsList } from '../../utils/projects'
import { scrollToElement } from '../../utils/scroll.util'
import projectsAction from '../../actions/projects'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/arrow.svg'

import './breadcrums.scss'

const Breadcrumbs = ({ onClick = () => {}, projectStore, fetchProjectsNames }) => {
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { isDemoMode } = useMode()
  const breadcrumbsRef = useRef()
  const projectListRef = useRef()
  const params = useParams()
  const location = useLocation()

  const mlrunScreens = useMemo(() => {
    return generateMlrunScreens(params, isDemoMode)
  }, [isDemoMode, params])
  const projectTabs = useMemo(() => {
    return generateTabsList()
  }, [])

  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const urlItems = useMemo(() => {
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
      const [projects, page] = location.pathname.split('/').slice(1, 3)
      const screen = mlrunScreens.find(screen => screen.id === page)

      return {
        pathItems: [projects, screen?.label || page],
        screen
      }
    }
  }, [location.pathname, params.projectName, mlrunScreens, projectTabs])

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

      setSearchValue('')
    },
    [breadcrumbsRef, showProjectsList, showScreensList]
  )

  const scrollProjectOptionToView = useCallback(() => {
    scrollToElement(projectListRef, `#${params.projectName}`, searchValue)
  }, [params.projectName, searchValue])

  useEffect(() => {
    if (showProjectsList && projectListRef.current) {
      scrollProjectOptionToView()
    }
  }, [showProjectsList, scrollProjectOptionToView])

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
    const nextItemIsScreen = Boolean(mlrunScreens.find(screen => screen.label === nextItem))

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
                  id="separator"
                  ref={separatorRef}
                  onClick={() => handleSeparatorClick(urlItems.pathItems[i + 1], separatorRef)}
                >
                  <ArrowIcon />
                </RoundedIcon>
                {showScreensList && urlItems.pathItems[i + 1] === urlItems.screen?.label && (
                  <BreadcrumbsDropdown
                    link={to}
                    list={mlrunScreens}
                    onClick={() => handleSelectDropdownItem(separatorRef)}
                    selectedItem={urlItems.screen?.id}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                  />
                )}
                {showProjectsList && urlItems.pathItems[i + 1] === params.projectName && (
                  <>
                    <BreadcrumbsDropdown
                      link={to}
                      list={projectsList}
                      onClick={() => handleSelectDropdownItem(separatorRef)}
                      ref={projectListRef}
                      screen={urlItems.screen?.id}
                      selectedItem={params.projectName}
                      searchValue={searchValue}
                      setSearchValue={setSearchValue}
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

Breadcrumbs.propTypes = {
  onClick: PropTypes.func
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  { ...projectsAction }
)(Breadcrumbs)

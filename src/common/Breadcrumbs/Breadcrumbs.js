import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams, Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'

import BreadcrumbsDropdown from '../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { ReactComponent as ArrowIcon } from '../../images/arrow.svg'

import { useMode } from '../../hooks/mode.hook'
import { generateProjectScreens } from './breadcrumbs.util'
import { generateProjectsList } from '../../utils/projects'
import projectsAction from '../../actions/projects'

import './breadcrums.scss'

const Breadcrumbs = ({ onClick, projectStore, fetchProjectsNames }) => {
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const isDemoMode = useMode()
  const breadcrumbsRef = useRef()
  const params = useParams()
  const location = useLocation()

  //ok
  const projectScreens = useMemo(() => {
    return generateProjectScreens(params, isDemoMode)
  }, [isDemoMode, params])
  //ok
  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])

  const pathItems = useMemo(() => {
    return location.pathname.split('/').slice(1, 4)
    // const screen = pathItems.find(pathItem => projectScreens.find(screen => screen.id === pathItem))
    // console.log(screen)
    //
    // return {
    //   pathItems,
    //   screen
    // }
  }, [location.pathname])

  //ok
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
  //ok
  useEffect(() => {
    window.addEventListener('click', handleCloseDropdown)

    return () => {
      window.removeEventListener('click', handleCloseDropdown)
    }
  }, [handleCloseDropdown])
  //ok
  useEffect(() => {
    if (projectsList.length === 0 && location.pathname !== '/projects') {
      fetchProjectsNames()
    }
  }, [fetchProjectsNames, location.pathname, projectsList.length])

  const handleSeparatorClick = (nextItem, separatorRef, param) => {
    const nextItemIsScreen = Boolean(projectScreens.find(screen => screen.label === nextItem))

    if ((nextItemIsScreen && !param) || nextItem === params.projectName) {
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
        {pathItems.map((item, i) => {
          const param = Object.values(params ?? {}).includes(item)
          const label = param ? item : item.charAt(0).toUpperCase() + item.slice(1)
          const to = `/${pathItems.slice(0, i + 1).join('/')}`
          const last = i === pathItems.length - 1
          const screen = projectScreens.find(screen => screen.label === item)
          const separatorClassNames = classnames(
            'breadcrumbs__separator',
            ((pathItems[i + 1] === screen?.id && !param) ||
              pathItems[i + 1] === params.projectName) &&
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
                  onClick={() => handleSeparatorClick(pathItems[i + 1], separatorRef, param)}
                >
                  <ArrowIcon />
                </RoundedIcon>
                {showScreensList && pathItems[i + 1] === screen.label && !param && (
                  <BreadcrumbsDropdown
                    link={to}
                    list={projectScreens}
                    onClick={() => handleSelectDropdownItem(separatorRef)}
                    selectedItem={screen.id}
                  />
                )}
                {showProjectsList && pathItems[i + 1] === params.projectName && (
                  <BreadcrumbsDropdown
                    link={to}
                    list={projectsList}
                    onClick={() => handleSelectDropdownItem(separatorRef)}
                    screen={screen?.id}
                    selectedItem={params.projectName}
                    tab={params.pageTab || 'monitor'}
                    withSearch
                  />
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

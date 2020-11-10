import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'

import BreadcrumbsDropdown from '../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import { PROJECTS_PAGE } from '../../constants'
import {
  generateProjectScreens,
  generateProjectsList
} from './breadcrumbs.util'
import projectsAction from '../../actions/projects'

import './breadcrums.scss'

const Breadcrumbs = ({
  enableNavigation,
  match,
  onClick,
  projectStore,
  fetchProjects
}) => {
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const [projectsList, setProjectsList] = useState(
    generateProjectsList(projectStore.projects)
  )
  const [searchValue, setSearchValue] = useState('')

  const projectScreens = generateProjectScreens(match)
  const pathItems = match.path.slice(1).split('/')
  const urlItems = match.url.slice(1).split('/')
  const screen = pathItems.find(
    pathItem =>
      !pathItem.startsWith(':') && pathItem !== PROJECTS_PAGE.toLowerCase()
  )
  const breadcrumbsRef = React.createRef()

  const handleCloseDropdown = useCallback(
    event => {
      if (
        breadcrumbsRef.current &&
        !breadcrumbsRef.current.contains(event.target)
      ) {
        const activeSeparator = document.getElementsByClassName(
          'breadcrumbs__separator_active'
        )[0]

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
    if (enableNavigation) {
      window.addEventListener('click', handleCloseDropdown)

      return () => {
        window.removeEventListener('click', handleCloseDropdown)
      }
    }
  }, [enableNavigation, handleCloseDropdown])

  useEffect(() => {
    if (enableNavigation) {
      if (projectStore.projects.length === 0) {
        fetchProjects().then(projects =>
          setProjectsList(generateProjectsList(projects))
        )
      }
    }
  }, [
    enableNavigation,
    fetchProjects,
    projectStore.projects.length,
    projectsList.length
  ])

  useEffect(() => {
    if (searchValue.length > 0) {
      setProjectsList(state =>
        state.filter(project => project.id.startsWith(searchValue))
      )
    } else if (searchValue.length === 0 && projectsList.length === 0) {
      setProjectsList(generateProjectsList(projectStore.projects))
    }
  }, [projectStore.projects, projectsList.length, searchValue])

  const handleSeparatorClick = (nextItem, separatorRef) => {
    if (nextItem === screen || nextItem === match.params.projectName) {
      const activeSeparator = document.getElementsByClassName(
        'breadcrumbs__separator_active'
      )[0]

      if (
        activeSeparator &&
        !separatorRef.current.classList.contains(
          'breadcrumbs__separator_active'
        )
      ) {
        activeSeparator.classList.toggle('breadcrumbs__separator_active')
      }

      if (nextItem === screen) {
        setShowScreensList(state => !state)

        if (showProjectsList) {
          setShowProjectsList(false)
        }
      }

      if (nextItem === match.params.projectName) {
        setShowProjectsList(state => !state)

        if (showScreensList) {
          setShowScreensList(false)
        }
      }

      separatorRef.current.classList.toggle('breadcrumbs__separator_active')
    }
  }

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {urlItems.map((item, i) => {
          const param = pathItems[i]?.startsWith(':')
          const label = param
            ? match.params.tab === item || match.params.jobTab === item
              ? startCase(item)
              : item
            : startCase(item)
          const to = `/${urlItems.slice(0, i + 1).join('/')}`
          const last = i === urlItems.length - 1
          const id = item === match.params.jobId || item === match.params.name
          const separatorClassNames = classnames(
            'breadcrumbs__separator',
            (urlItems[i + 1] === screen ||
              urlItems[i + 1] === match.params.projectName) &&
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
          } else if (id) {
            return [
              <li
                data-testid="breadcrumbs-id"
                key={`${i}${item}`}
                className="breadcrumbs__item"
              >
                {label}
              </li>,
              <li key={i} className={separatorClassNames}>
                <Arrow />
              </li>
            ]
          } else {
            return [
              <li key={`${i}${item}`} className="breadcrumbs__item">
                <Link to={to} onClick={onClick}>
                  {label}
                </Link>
                {showScreensList && urlItems[i + 1] === screen && (
                  <BreadcrumbsDropdown link={to} list={projectScreens} />
                )}
                {showProjectsList &&
                  urlItems[i + 1] === match.params.projectName && (
                    <BreadcrumbsDropdown
                      link={to}
                      list={projectsList}
                      screen={screen}
                      searchOnChange={setSearchValue}
                      withSearch
                    />
                  )}
              </li>,
              <li
                key={i}
                className={separatorClassNames}
                ref={separatorRef}
                onClick={() =>
                  enableNavigation &&
                  handleSeparatorClick(urlItems[i + 1], separatorRef)
                }
              >
                <Arrow />
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
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  { ...projectsAction }
)(Breadcrumbs)

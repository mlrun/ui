import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'

import BreadcrumbsDropdown from '../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { ReactComponent as ArrowIcon } from '../../images/arrow.svg'

import { useDemoMode } from '../../hooks/demoMode.hook'
import { betaBreadcrumbs, generateProjectScreens } from './breadcrumbs.util'
import { generateProjectsList } from '../../utils/projects'
import projectsAction from '../../actions/projects'
import { PROJECTS_PAGE } from '../../constants'

import './breadcrums.scss'

const Breadcrumbs = ({ match, onClick, projectStore, fetchProjectsNames }) => {
  const [showScreensList, setShowScreensList] = useState(false)
  const [showProjectsList, setShowProjectsList] = useState(false)
  const isDemoMode = useDemoMode()
  const breadcrumbsRef = useRef()

  const projectScreens = useMemo(() => {
    return generateProjectScreens(match, isDemoMode)
  }, [isDemoMode, match])
  const projectsList = useMemo(() => {
    return generateProjectsList(projectStore.projectsNames.data)
  }, [projectStore.projectsNames.data])
  const matchItems = useMemo(() => {
    const pathItems = match.path.split('/').slice(1, 4)

    return {
      pathItems: pathItems,
      urlItems: match.url.split('/').slice(1, 4),
      screen: pathItems.find(
        pathItem =>
          !pathItem.startsWith(':') && pathItem !== PROJECTS_PAGE.toLowerCase()
      )
    }
  }, [match.path, match.url])

  const handleCloseDropdown = useCallback(
    event => {
      if (
        breadcrumbsRef.current &&
        !breadcrumbsRef.current.contains(event.target)
      ) {
        const [activeSeparator] = document.getElementsByClassName(
          'breadcrumbs__separator_active'
        )

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
    if (projectsList.length === 0 && match.path !== '/projects') {
      fetchProjectsNames()
    }
  }, [fetchProjectsNames, match.path, projectsList.length])

  const handleSeparatorClick = (nextItem, separatorRef, param) => {
    if (
      (nextItem === matchItems.screen && !param) ||
      nextItem === match.params.projectName
    ) {
      const [activeSeparator] = document.getElementsByClassName(
        'breadcrumbs__separator_active'
      )

      if (
        activeSeparator &&
        !separatorRef.current.classList.contains(
          'breadcrumbs__separator_active'
        )
      ) {
        activeSeparator.classList.remove('breadcrumbs__separator_active')
      }

      if (nextItem === matchItems.screen) {
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

  const handleSelectDropdownItem = separatorRef => {
    if (showProjectsList) setShowProjectsList(false)

    if (showScreensList) setShowScreensList(false)

    separatorRef.current.classList.remove('breadcrumbs__separator_active')
  }

  return (
    <nav data-testid="breadcrumbs" className="breadcrumbs" ref={breadcrumbsRef}>
      <ul className="breadcrumbs__list">
        {matchItems.urlItems.map((item, i) => {
          const param = matchItems.pathItems[i]?.startsWith(':')
          const label = `${
            param
              ? match.params.tab === item || match.params.pageTab === item
                ? startCase(item)
                : item
              : startCase(item)
          }${
            window.mlrunConfig.betaMode === 'enabled' &&
            betaBreadcrumbs.includes(item)
              ? ' (Beta)'
              : ''
          }`
          const to = `/${matchItems.urlItems.slice(0, i + 1).join('/')}`
          const last = i === matchItems.urlItems.length - 1
          const separatorClassNames = classnames(
            'breadcrumbs__separator',
            ((matchItems.urlItems[i + 1] === matchItems.screen &&
              !matchItems.pathItems[i + 1]?.startsWith(':')) ||
              matchItems.urlItems[i + 1] === match.params.projectName) &&
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
                  onClick={() =>
                    handleSeparatorClick(
                      matchItems.urlItems[i + 1],
                      separatorRef,
                      matchItems.pathItems[i + 1]?.startsWith(':')
                    )
                  }
                >
                  <ArrowIcon />
                </RoundedIcon>

                {showScreensList &&
                  matchItems.urlItems[i + 1] === matchItems.screen &&
                  !matchItems.pathItems[i + 1]?.startsWith(':') && (
                    <BreadcrumbsDropdown
                      link={to}
                      list={projectScreens}
                      onClick={() => handleSelectDropdownItem(separatorRef)}
                      selectedItem={matchItems.screen}
                    />
                  )}
                {showProjectsList &&
                  matchItems.urlItems[i + 1] === match.params.projectName && (
                    <BreadcrumbsDropdown
                      link={to}
                      list={projectsList}
                      onClick={() => handleSelectDropdownItem(separatorRef)}
                      screen={matchItems.screen}
                      selectedItem={match.params.projectName}
                      tab={match.params.pageTab}
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
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  { ...projectsAction }
)(Breadcrumbs)

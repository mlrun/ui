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
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import BreadcrumbsDropdown from '../../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import { RoundedIcon } from 'igz-controls/components'

import { scrollToElement } from '../../../utils/scroll.util'

import ArrowIcon from 'igz-controls/images/arrow.svg?react'

import './breadcrumbsStep.scss'

const BreadcrumbsStep = React.forwardRef(
  (
    {
      index,
      mlrunScreens,
      onClick,
      params,
      projectsList,
      searchValue,
      setSearchValue,
      setShowProjectsList,
      setShowScreensList,
      showProjectsList,
      showScreensList,
      urlPart,
      urlParts
    },
    ref
  ) => {
    const projectListRef = useRef()
    const separatorRef = useRef()

    const isParam = useMemo(() => Object.values(params ?? {}).includes(urlPart), [urlPart, params])
    const label = useMemo(
      () => (isParam ? urlPart : urlPart.charAt(0).toUpperCase() + urlPart.slice(1)),
      [urlPart, isParam]
    )
    const to = useMemo(
      () => `/${urlParts.pathItems.slice(0, index + 1).join('/')}`,
      [index, urlParts.pathItems]
    )
    const isLastStep = useMemo(
      () => index === urlParts.pathItems.length - 1,
      [index, urlParts.pathItems.length]
    )

    const separatorClassNames = classnames(
      'breadcrumbs__separator',
      ((urlParts.pathItems[index + 1] === urlParts.screen?.id && !isParam) ||
        urlParts.pathItems[index + 1] === params.projectName) &&
        'breadcrumbs__separator_tumbler'
    )

    const handleSelectDropdownItem = separatorRef => {
      if (showProjectsList) setShowProjectsList(false)

      if (showScreensList) setShowScreensList(false)

      separatorRef.current.classList.remove('breadcrumbs__separator_active')
    }

    const handleCloseDropdown = useCallback(
      event => {
        if (ref.current && !ref.current.contains(event.target)) {
          const [activeSeparator] = document.getElementsByClassName('breadcrumbs__separator_active')

          if (activeSeparator) {
            activeSeparator.classList.remove('breadcrumbs__separator_active')
          }

          if (showScreensList) setShowScreensList(false)

          if (showProjectsList) setShowProjectsList(false)
        }

        setSearchValue('')
      },
      [
        ref,
        setSearchValue,
        setShowProjectsList,
        setShowScreensList,
        showProjectsList,
        showScreensList
      ]
    )

    const scrollProjectOptionToView = useCallback(() => {
      scrollToElement(projectListRef, `#${params.projectName}`, searchValue)
    }, [params.projectName, projectListRef, searchValue])

    useEffect(() => {
      if (showProjectsList && projectListRef.current) {
        scrollProjectOptionToView()
      }
    }, [showProjectsList, scrollProjectOptionToView, projectListRef])

    useEffect(() => {
      window.addEventListener('click', handleCloseDropdown)

      return () => {
        window.removeEventListener('click', handleCloseDropdown)
      }
    }, [handleCloseDropdown])

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

    return isLastStep ? (
      <>
        <li
          data-testid="breadcrumbs-last-item"
          className="breadcrumbs__item"
          key={`${index}${urlPart}`}
        >
          <span>{label}</span>
        </li>
        {urlParts.tab?.label && (
          <>
            <li className="breadcrumbs__separator">
              <ArrowIcon />
            </li>
            <li data-testid="breadcrumbs-tab" className="breadcrumbs__item">
              <span>{urlParts.tab.label}</span>
            </li>
          </>
        )}
      </>
    ) : (
      <>
        <li key={`${index}${urlPart}`} className="breadcrumbs__item">
          <Link to={to} onClick={onClick}>
            {label}
          </Link>
        </li>
        <li key={index} className="breadcrumbs__item">
          <RoundedIcon
            className={separatorClassNames}
            id={`separator-${index}`}
            ref={separatorRef}
            onClick={() => handleSeparatorClick(urlParts.pathItems[index + 1], separatorRef)}
          >
            <ArrowIcon />
          </RoundedIcon>
          {showScreensList && urlParts.pathItems[index + 1] === urlParts.screen?.label && (
            <BreadcrumbsDropdown
              id="breadcrumbs-screens-dropdown"
              link={to}
              list={mlrunScreens}
              onClick={() => handleSelectDropdownItem(separatorRef)}
              selectedItem={urlParts.screen?.id}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          )}
          {showProjectsList && urlParts.pathItems[index + 1] === params.projectName && (
            <>
              <BreadcrumbsDropdown
                id="breadcrumbs-projects-dropdown"
                link={to}
                list={projectsList}
                onClick={() => handleSelectDropdownItem(separatorRef)}
                ref={projectListRef}
                screen={urlParts.screen?.id}
                selectedItem={params.projectName}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tab={urlParts.tab?.id}
                withSearch
                withAllProjects
              />
            </>
          )}
        </li>
      </>
    )
  }
)

BreadcrumbsStep.displayName = 'BreadcrumbsStep'

BreadcrumbsStep.propTypes = {
  index: PropTypes.number.isRequired,
  mlrunScreens: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  params: PropTypes.object.isRequired,
  projectsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  setShowProjectsList: PropTypes.func.isRequired,
  setShowScreensList: PropTypes.func.isRequired,
  showProjectsList: PropTypes.bool.isRequired,
  showScreensList: PropTypes.bool.isRequired,
  urlPart: PropTypes.string.isRequired,
  urlParts: PropTypes.shape({
    pathItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    screen: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }),
    tab: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string

    })
  }).isRequired
}

export default BreadcrumbsStep

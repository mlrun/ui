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

import { BREADCRUMBS_STEP_ITEM_TYPE, BREADCRUMBS_STEP_PROJECT_TYPE, BREADCRUMBS_STEP_SCREEN_TYPE } from '../../../constants'
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
      pathItem,
      urlParts
    },
    ref
  ) => {
    const projectListRef = useRef()
    const screenListRef = useRef()
    const separatorRef = useRef()

    const isLastStep = useMemo(
      () => index === urlParts.pathItems.length - 1,
      [index, urlParts.pathItems.length]
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
    }, [params.projectName, searchValue])

    const scrollScreenOptionToView = useCallback(() => {
      scrollToElement(screenListRef, `#${urlParts.screen.id}`, searchValue)
    }, [searchValue, urlParts.screen.id])

    useEffect(() => {
      if (showProjectsList && projectListRef.current) {
        scrollProjectOptionToView()
      }
      if (showScreensList && screenListRef.current) {
        scrollScreenOptionToView()
      }
    }, [showProjectsList, projectListRef, screenListRef, showScreensList, scrollProjectOptionToView, scrollScreenOptionToView])

    useEffect(() => {
      window.addEventListener('click', handleCloseDropdown)

      return () => {
        window.removeEventListener('click', handleCloseDropdown)
      }
    }, [handleCloseDropdown])

    const handleSeparatorClick = (nextItem, separatorRef) => {
      if (nextItem.type === 'screen' || nextItem.type === 'project') {

        const [activeSeparator] = document.getElementsByClassName('breadcrumbs__separator_active')

        if (nextItem.type === BREADCRUMBS_STEP_PROJECT_TYPE) {
          setShowProjectsList(state => !state)

          if (showScreensList) {
            setShowScreensList(false)
          }
        }

        if (nextItem.type === BREADCRUMBS_STEP_SCREEN_TYPE) {
          setShowScreensList(state => !state)

          if (showProjectsList) {
            setShowProjectsList(false)
          }
        }

        if (
          activeSeparator &&
          !separatorRef.current.classList.contains('breadcrumbs__separator_active')
        ) {
          activeSeparator.classList.remove('breadcrumbs__separator_active')
        }

        separatorRef.current.classList.toggle('breadcrumbs__separator_active')
      }
    }

    return isLastStep ? (
      <li
        data-testid="breadcrumbs-last-item"
        className="breadcrumbs__item"
        key={pathItem.id}
      >
        {pathItem.label}
      </li>
    )
      : (
        <>
          <li key={pathItem.id} className="breadcrumbs__item">
            <Link to={pathItem.link} onClick={onClick}>
              {pathItem.label}
            </Link>
          </li>
          <li key={index} className="breadcrumbs__item">
            {urlParts.pathItems[index + 1]?.type === BREADCRUMBS_STEP_ITEM_TYPE ? (<div className='breadcrumbs__separator'><ArrowIcon /></div >) : <RoundedIcon
              className='breadcrumbs__separator'
              id={`separator-${index}`}
              ref={separatorRef}
              onClick={() => handleSeparatorClick(urlParts.pathItems[index + 1], separatorRef)}
            >
              <ArrowIcon />
            </RoundedIcon>}
            {showScreensList && urlParts.pathItems[index + 1].type === BREADCRUMBS_STEP_SCREEN_TYPE && (
              <BreadcrumbsDropdown
                id="breadcrumbs-screens-dropdown"
                link={pathItem.link}
                list={mlrunScreens}
                onClick={() => handleSelectDropdownItem(separatorRef)}
                ref={screenListRef}
                selectedItem={urlParts.screen?.id}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            )}
            {showProjectsList && urlParts.pathItems[index + 1].type === BREADCRUMBS_STEP_PROJECT_TYPE && (
              <>
                <BreadcrumbsDropdown
                  id="breadcrumbs-projects-dropdown"
                  link={pathItem.link}
                  list={projectsList}
                  onClick={() => handleSelectDropdownItem(separatorRef)}
                  ref={projectListRef}
                  selectedItem={params.projectName}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  urlParts={urlParts}
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
  pathItem: PropTypes.object.isRequired,
  projectsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  setShowProjectsList: PropTypes.func.isRequired,
  setShowScreensList: PropTypes.func.isRequired,
  showProjectsList: PropTypes.bool.isRequired,
  showScreensList: PropTypes.bool.isRequired,
  urlParts: PropTypes.shape({
    pathItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    screen: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      link: PropTypes.string
    }),
  }).isRequired
}

export default BreadcrumbsStep

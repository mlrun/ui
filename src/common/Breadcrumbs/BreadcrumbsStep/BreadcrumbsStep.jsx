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
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import BreadcrumbsDropdown from '../../../elements/BreadcrumbsDropdown/BreadcrumbsDropdown'
import { RoundedIcon } from 'igz-controls/components'

import ArrowIcon from 'igz-controls/images/arrow.svg?react'

import { useBreadcrumbsStep } from '../../../hooks/useBreadcrumbsStep.hook'
import { DROPDOWN_TYPES } from '../../../constants'

import './breadcrumbsStep.scss'

const BreadcrumbsStep = ({
  index,
  urlPart,
  urlParts,
  params,
  dropdownState,
  onDropdownToggle,
  onDropdownClose,
  setSearchValue,
  options,
  onClick
}) => {
  const {
    projectListRef,
    isLastStep,
    to,
    label,
    dropdownType,
    isSeparatorActive,
    separatorClassNames,
    functionsList
  } = useBreadcrumbsStep({
    index,
    urlPart,
    urlParts,
    params,
    dropdownState,
    options
  })

  const renderDropdown = () => {
    if (!dropdownType || !isSeparatorActive) return null

    const commonProps = {
      link: to,
      onClick: onDropdownClose,
      searchValue: dropdownState.search,
      setSearchValue
    }

    switch (dropdownType) {
      case DROPDOWN_TYPES.SCREENS:
        return (
          <BreadcrumbsDropdown
            {...commonProps}
            list={options.screens}
            selectedItem={urlParts.screen?.id}
          />
        )
      case DROPDOWN_TYPES.FUNCTIONS:
        return (
          <BreadcrumbsDropdown
            {...commonProps}
            list={functionsList}
            selectedItem={urlParts.functionName}
            withSearch
          />
        )
      case DROPDOWN_TYPES.PROJECTS:
        return (
          <BreadcrumbsDropdown
            {...commonProps}
            list={options.projects}
            ref={projectListRef}
            screen={urlParts.screen?.id}
            selectedItem={params.projectName}
            tab={urlParts.tab?.id}
            withSearch
          />
        )
      default:
        return null
    }
  }

  if (isLastStep) {
    return (
      <li data-testid="breadcrumbs-last-item" className="breadcrumbs__item">
        {label}
      </li>
    )
  }

  return (
    <>
      <li className="breadcrumbs__item">
        <Link to={to} onClick={onClick}>
          {label}
        </Link>
      </li>
      <li className="breadcrumbs__item">
        <RoundedIcon
          className={separatorClassNames}
          id="separator"
          onClick={() => dropdownType && onDropdownToggle(dropdownType)}
        >
          <ArrowIcon />
        </RoundedIcon>
        {renderDropdown()}
      </li>
    </>
  )
}

BreadcrumbsStep.displayName = 'BreadcrumbsStep'

BreadcrumbsStep.propTypes = {
  index: PropTypes.number.isRequired,
  urlPart: PropTypes.string.isRequired,
  urlParts: PropTypes.shape({
    pathItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    screen: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }),
    tab: PropTypes.shape({
      id: PropTypes.string
    }),
    functionName: PropTypes.string,
    functionPath: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  params: PropTypes.object.isRequired,
  dropdownState: PropTypes.shape({
    active: PropTypes.string,
    search: PropTypes.string.isRequired
  }).isRequired,
  onDropdownToggle: PropTypes.func.isRequired,
  onDropdownClose: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  options: PropTypes.shape({
    screens: PropTypes.arrayOf(PropTypes.object).isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    functions: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  onClick: PropTypes.func
}

export default BreadcrumbsStep

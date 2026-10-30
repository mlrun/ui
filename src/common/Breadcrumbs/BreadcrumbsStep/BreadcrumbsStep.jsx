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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import ArrowIcon from 'igz-controls/images/arrow.svg?react'

import './breadcrumbsStep.scss'

const BreadcrumbsStep = ({ index, onClick, pathItem, urlParts }) => {
  const isLastStep = useMemo(
    () => index === urlParts.pathItems.length - 1,
    [index, urlParts.pathItems.length]
  )

  return isLastStep ? (
    <li data-testid="breadcrumbs-last-item" className="breadcrumbs__item" key={pathItem.id + index}>
      {pathItem.label}
    </li>
  ) : (
    <>
      <li key={pathItem.id} className="breadcrumbs__item">
        <Link to={pathItem.link} onClick={onClick}>
          {pathItem.label}
        </Link>
      </li>
      <li key={index} className="breadcrumbs__item">
        <div className="breadcrumbs__separator">
          <ArrowIcon />
        </div>
      </li>
    </>
  )
}

BreadcrumbsStep.propTypes = {
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  pathItem: PropTypes.object.isRequired,
  urlParts: PropTypes.shape({
    pathItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        link: PropTypes.string,
        type: PropTypes.string
      })
    ).isRequired,
    screen: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      link: PropTypes.string
    })
  }).isRequired
}

export default BreadcrumbsStep

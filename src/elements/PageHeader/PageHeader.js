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

import { RoundedIcon } from 'igz-controls/components'

import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'

import './pageHeader.scss'

const PageHeader = ({ title, description = '', backLink = '' }) => {
  return (
    <div className="page-header">
      {backLink && (
        <div className="page-header__back-btn">
          <RoundedIcon>
            <Link to={backLink} className="page-header__back-btn">
              <Back />
            </Link>
          </RoundedIcon>
        </div>
      )}
      <div className="page-header__title-wrapper">
        <div className="page-header__title">{title}</div>
        <div className="page-header__description">{description}</div>
      </div>
    </div>
  )
}

PageHeader.propTypes = {
  backLink: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default PageHeader

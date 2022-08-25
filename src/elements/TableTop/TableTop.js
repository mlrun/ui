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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'

import './tableTop.scss'

const TableTop = ({ children, link, text }) => {
  return (
    <div className="table-top">
      <div className="link-back">
        <Link to={link} className="link-back__icon">
          <Tooltip template={<TextTooltipTemplate text="Back" />}>
            <Back />
          </Tooltip>
        </Link>
        {text && (
          <div className="link-back__title">
            <Tooltip template={<TextTooltipTemplate text={text} />}>
              {text}
            </Tooltip>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

TableTop.defaultProps = {
  text: ''
}

TableTop.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string
}

export default TableTop

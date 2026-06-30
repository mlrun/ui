/*
Copyright 2022 Iguazio Systems Ltd.
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
import classnames from 'classnames'

import Checkmark from '../../images/success_done.svg?react'
import Close from '../../images/close.svg?react'

import './ValidationTemplate.scss'

const ValidationTemplate = ({ valid, validationMessage }) => {
  const validationClasses = classnames('validation-option', valid && 'text-muted')

  return (
    <li className={validationClasses}>
      <i className="validation-option__icon">
        {valid ? (
          <Checkmark className="validation-option__icon_valid" />
        ) : (
          <Close className="validation-option__icon_invalid" />
        )}
      </i>
      <span>{validationMessage}</span>
    </li>
  )
}

ValidationTemplate.propTypes = {
  valid: PropTypes.bool.isRequired,
  validationMessage: PropTypes.string.isRequired
}

export default ValidationTemplate

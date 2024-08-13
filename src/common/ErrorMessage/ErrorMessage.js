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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as UnsuccessAlert } from 'igz-controls/images/unsuccess_alert.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'

import './errorMessage.scss'

const ErrorMessage = ({ closeError = null, message }) => {
  return (
    <div data-testid="error-message" className="error">
      <div className="error__data">
        <div>
          <UnsuccessAlert className="error__icon" />
        </div>
        <div className="error__message"> {message}</div>
      </div>
      {closeError && (
        <button data-testid="close" onClick={closeError}>
          <Tooltip template={<TextTooltipTemplate text="Close" />}>
            <Close />
          </Tooltip>
        </button>
      )}
    </div>
  )
}

ErrorMessage.propTypes = {
  closeError: PropTypes.func,
  message: PropTypes.string.isRequired
}

export default ErrorMessage

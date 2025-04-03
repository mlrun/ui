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
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tip } from 'igz-controls/components'

import { RADIO_BUTTONS_ELEMENTS } from '../../types'

import './radioButtons.scss'

const RadioButtons = ({
  className = '',
  disabled = false,
  elements = [],
  onChangeCallback = () => {},
  selectedValue = null
}) => {
  const [checked, setChecked] = useState('')

  const radioButtonsClassNames = classnames('radio-buttons', disabled && 'disabled', className)

  const onChange = event => {
    setChecked(event.currentTarget.value)
    onChangeCallback(event.currentTarget.value)
  }

  useEffect(() => {
    setChecked(selectedValue)
  }, [selectedValue])

  return (
    <div className={radioButtonsClassNames}>
      {elements.map(
        (element, index) =>
          !element.hidden && (
            <div key={index} className="radio-buttons__content">
              <label className="radio-button">
                <input
                  type="radio"
                  value={element.value}
                  disabled={disabled}
                  checked={checked === element.value}
                  onChange={onChange}
                />
                <span className="checkmark" />
                <span className="radio-button__label">
                  {element.label}
                  {element.tip && <Tip text={element.tip} />}
                </span>
              </label>

              {element.info && <span className="radio-button__info">{element.info}</span>}
            </div>
          )
      )}
    </div>
  )
}

RadioButtons.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  elements: RADIO_BUTTONS_ELEMENTS.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  selectedValue: PropTypes.string
}

export default React.memo(RadioButtons)

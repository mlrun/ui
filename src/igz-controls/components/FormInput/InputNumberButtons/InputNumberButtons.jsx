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
import { isNil } from 'lodash'

import { performFloatOperation } from '../../../utils/math.util'

import Arrow from '../../../images/range-arrow-small.svg?react'

import './InputNumberButtons.scss'

let InputNumberButtons = ({
  disabled = false,
  min = null,
  max = null,
  onChange,
  step = 1,
  value
}) => {
  const handleIncrease = event => {
    event.preventDefault()
    if (max && value >= max) return

    let newValue = isCurrentValueEmpty() ? step : performFloatOperation(value, step, '+')
    newValue = max && newValue > max ? max : newValue

    onChange(newValue)
  }

  const handleDecrease = event => {
    event.preventDefault()

    if (min && value <= min) return

    let newValue = isCurrentValueEmpty() ? -step : performFloatOperation(value, step, '-')
    newValue = min && newValue < min ? min : newValue

    onChange(newValue)
  }

  const isCurrentValueEmpty = () => {
    return isNil(value) || value === ''
  }

  return (
    <div data-testid="range-input-container" className="form-field-range">
      <div className="range__buttons">
        <button
          data-testid="btn-increase"
          className="range__button range__button-increase"
          disabled={disabled}
          onClick={handleIncrease}
        >
          <Arrow className="increase" />
        </button>
        <button
          data-testid="btn-decrease"
          className="range__button range__button-decrease"
          disabled={disabled}
          onClick={handleDecrease}
        >
          <Arrow className="decrease" />
        </button>
      </div>
    </div>
  )
}

InputNumberButtons.propTypes = {
  disabled: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

InputNumberButtons = React.memo(InputNumberButtons)

export default InputNumberButtons

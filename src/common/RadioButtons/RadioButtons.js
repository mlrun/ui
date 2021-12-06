import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tip from '../Tip/Tip'

import { RADIO_BUTTONS_ELEMENTS } from '../../types'

import './radioButtons.scss'

const RadioButtons = ({
  className,
  disabled,
  elements,
  onChangeCallback,
  selectedValue
}) => {
  const [checked, setChecked] = useState('')

  const radioButtonsClassNames = classnames(
    'radio-buttons',
    disabled && 'disabled',
    className
  )

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

              {element.info && (
                <span className="radio-button__info">{element.info}</span>
              )}
            </div>
          )
      )}
    </div>
  )
}

RadioButtons.defaultProps = {
  className: '',
  disabled: false,
  elements: [],
  onChangeCallback: () => {},
  selectedValue: null
}

RadioButtons.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  elements: RADIO_BUTTONS_ELEMENTS.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  selectedValue: PropTypes.string
}

export default React.memo(RadioButtons)

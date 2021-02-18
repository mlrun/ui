import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import './radioButtons.scss'
import classnames from 'classnames'

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
      {elements.map((element, index) => (
        <label className="radio-button" key={index}>
          <input
            type="radio"
            value={element.value}
            disabled={disabled}
            checked={checked === element.value}
            onChange={onChange}
          />
          <span className="checkmark" />
          <span>{element.label}</span>
        </label>
      ))}
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
  elements: PropTypes.array.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  selectedValue: PropTypes.string
}

export default React.memo(RadioButtons)

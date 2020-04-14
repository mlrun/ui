import React from 'react'
import PropTypes from 'prop-types'

import Input from '../Input/Input'

import { ReactComponent as Arrow } from '../../images/range-arrow.svg'

import './rangeInput.scss'

const RangeInput = ({ onChange, value, label }) => {
  const handleIncrease = () => {
    onChange(++value)
  }

  const handleDecrease = () => {
    if (value <= 0) return

    onChange(--value)
  }
  return (
    <div className="range">
      <Input
        type="number"
        label={label}
        floatingLabel
        onChange={onChange}
        className="range__input"
        value={value}
      />
      <Arrow className="range__icon increase" onClick={handleIncrease} />
      <Arrow className="range__icon decrease" onClick={handleDecrease} />
    </div>
  )
}

RangeInput.defaultProps = {
  label: ''
}

RangeInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default React.memo(RangeInput)
